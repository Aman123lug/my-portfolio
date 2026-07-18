/**
 * Blog data layer.
 *
 * Previously fetched from Hashnode's GraphQL API at runtime, but Hashnode
 * moved that API behind a paid Pro plan (May 2026). Posts now come from the
 * free RSS feed, fetched at build time by scripts/fetch-posts.mjs (runs on
 * `npm run dev` and `npm run build`) and baked into src/data/posts.ts.
 * The async signatures are kept so consumers didn't have to change.
 */
import { posts } from '../data/posts';

export interface BlogPost {
  id: string;
  title: string;
  brief: string;
  slug: string;
  publishedAt: string;
  readTimeInMinutes: number;
  coverImage?: {
    url: string;
  };
  tags?: {
    name: string;
  }[];
  content?: {
    html: string;
    markdown: string;
  };
  /** 'local' = markdown post from content/blog, 'hashnode' = from the RSS feed */
  source?: 'hashnode' | 'local';
}

// Fetch all blog posts
export async function getBlogPosts(first: number = 10): Promise<BlogPost[]> {
  return posts.slice(0, first);
}

// Fetch a single blog post by slug
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return posts.find((p) => p.slug === slug) ?? null;
}

// Format date helper
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
