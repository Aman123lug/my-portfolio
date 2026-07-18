/**
 * Builds the blog data (src/data/posts.ts) from two sources:
 *
 *  1. Local markdown posts in content/blog/<post-folder>/index.md
 *     (MLflow-website style: one folder per post, images live inside it).
 *     Post images are copied to public/blog-images/<slug>/ and relative
 *     paths in the markdown are rewritten to match.
 *
 *  2. The Hashnode RSS feed (their GraphQL API went paid in May 2026;
 *     RSS is still free). Fails soft: if the feed is unreachable, the
 *     Hashnode posts from the previously generated file are kept.
 *
 * Runs automatically before `npm run dev` and `npm run build`, which means
 * publishing a post is just: write markdown → git push → CI deploys it.
 */
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
  cpSync,
  rmSync,
  statSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = join(ROOT, 'content/blog');
const IMAGES_OUT = join(ROOT, 'public/blog-images');
const OUT = join(ROOT, 'src/data/posts.ts');
const FEED = 'https://amanblog.hashnode.dev/rss.xml';
const BASE = '/my-portfolio/'; // must match vite.config.ts `base`

/* ---------------- shared helpers ---------------- */

const stripHtml = (html) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

const toBrief = (text) => (text.length > 240 ? `${text.slice(0, 237)}…` : text);

const readTime = (html) =>
  Math.max(1, Math.round(stripHtml(html).split(/\s+/).filter(Boolean).length / 220));

/* ---------------- local markdown posts ---------------- */

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { attrs: {}, body: raw };
  const attrs = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, valueRaw] = kv;
    let value = valueRaw.trim().replace(/^["']|["']$/g, '');
    if (key === 'tags') {
      value = value
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((t) => t.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    }
    attrs[key] = value;
  }
  return { attrs, body: raw.slice(m[0].length) };
}

const rewriteRelative = (path, slug) =>
  `${BASE}blog-images/${slug}/${path.replace(/^\.\//, '')}`;

function buildLocalPosts() {
  if (!existsSync(CONTENT_DIR)) return [];

  rmSync(IMAGES_OUT, { recursive: true, force: true });

  const posts = [];
  for (const dir of readdirSync(CONTENT_DIR)) {
    const postDir = join(CONTENT_DIR, dir);
    const indexMd = join(postDir, 'index.md');
    if (!statSync(postDir).isDirectory() || !existsSync(indexMd)) continue;

    const { attrs, body } = parseFrontmatter(readFileSync(indexMd, 'utf8'));
    if (attrs.draft === 'true') continue;

    const slug = dir.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    const dateFromDir = dir.match(/^(\d{4}-\d{2}-\d{2})-/)?.[1];
    const publishedAt = new Date(
      attrs.date || dateFromDir || statSync(indexMd).mtime
    ).toISOString();

    let html = marked.parse(body, { gfm: true });
    // point relative image/asset paths at the copied public folder
    html = html.replace(
      /(src|href)="(?!https?:\/\/|\/|#|data:|mailto:)([^"]+)"/g,
      (_all, attr, path) => `${attr}="${rewriteRelative(path, slug)}"`
    );

    // copy everything except markdown into public/blog-images/<slug>/
    cpSync(postDir, join(IMAGES_OUT, slug), {
      recursive: true,
      filter: (src) => !src.endsWith('.md'),
    });

    posts.push({
      id: slug,
      title: attrs.title || slug.replace(/-/g, ' '),
      brief: attrs.brief || toBrief(stripHtml(html)),
      slug,
      publishedAt,
      readTimeInMinutes: readTime(html),
      ...(attrs.cover ? { coverImage: { url: rewriteRelative(attrs.cover, slug) } } : {}),
      tags: (attrs.tags || []).map((name) => ({ name })),
      content: { html, markdown: '' },
      source: 'local',
    });
  }
  return posts;
}

/* ---------------- hashnode RSS posts ---------------- */

const cdata = (s) => {
  if (s == null) return '';
  const m = s.match(/^<!\[CDATA\[([\s\S]*)\]\]>$/);
  return (m ? m[1] : s).trim();
};

const pick = (block, tag) => {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? cdata(m[1].trim()) : '';
};

function parseFeed(xml) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);

  return items.map((item) => {
    const link = pick(item, 'link');
    const slug = link.split('/').filter(Boolean).pop() ?? '';
    const content = pick(item, 'content:encoded');
    const cover = item.match(/<enclosure url="([^"]+)"/)?.[1];
    const tags = [...item.matchAll(/<category[^>]*>([\s\S]*?)<\/category>/g)]
      .map((m) => cdata(m[1].trim()))
      .filter(Boolean)
      .map((name) => ({ name }));

    return {
      id: pick(item, 'guid') || slug,
      title: stripHtml(pick(item, 'title')),
      brief: toBrief(stripHtml(pick(item, 'description'))),
      slug,
      publishedAt: new Date(pick(item, 'pubDate')).toISOString(),
      readTimeInMinutes: readTime(content),
      ...(cover ? { coverImage: { url: cover } } : {}),
      tags,
      content: { html: content, markdown: '' },
      source: 'hashnode',
    };
  });
}

function previousHashnodePosts() {
  // fall back to the hashnode posts inside the last generated file
  try {
    const prev = readFileSync(OUT, 'utf8');
    const json = prev.slice(prev.indexOf('['), prev.lastIndexOf(']') + 1);
    return JSON.parse(json).filter((p) => p.source === 'hashnode');
  } catch {
    return [];
  }
}

async function buildHashnodePosts() {
  try {
    const res = await fetch(FEED, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const posts = parseFeed(await res.text());
    if (!posts.length) throw new Error('feed parsed to 0 posts');
    return posts;
  } catch (err) {
    const cached = previousHashnodePosts();
    console.warn(
      `⚠ could not refresh Hashnode posts (${err.message}) — using ${cached.length} cached`
    );
    return cached;
  }
}

/* ---------------- merge & write ---------------- */

const local = buildLocalPosts();
const hashnode = await buildHashnodePosts();

const all = [...local, ...hashnode].sort(
  (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(
  OUT,
  `// Generated by scripts/build-posts.mjs — do not edit by hand.\n` +
    `// Sources: content/blog (local markdown) + ${FEED}\n` +
    `// Generated ${new Date().toISOString()}\n` +
    `import type { BlogPost } from '../services/hashnode';\n\n` +
    `export const posts: BlogPost[] = ${JSON.stringify(all, null, 2)};\n`
);
console.log(
  `✔ blog data built: ${local.length} local + ${hashnode.length} hashnode = ${all.length} posts`
);
