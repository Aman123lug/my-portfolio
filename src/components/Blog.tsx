import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts, formatDate } from '../services/hashnode';
import type { BlogPost as BlogPostType } from '../services/hashnode';
import EmbeddingMap from './EmbeddingMap';
import './Blog.css';

/* ---------- retrieval scoring (the "vector search") ---------- */

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

interface Scored {
  post: BlogPostType;
  sim: number | null;
}

function scorePosts(posts: BlogPostType[], query: string): Scored[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return posts.map((post) => ({ post, sim: null }));

  const raw = posts.map((post) => {
    const title = post.title.toLowerCase();
    const brief = post.brief.toLowerCase();
    const tags = (post.tags ?? []).map((t) => t.name.toLowerCase()).join(' ');
    let s = 0;
    for (const term of terms) {
      if (title.includes(term)) s += 3;
      if (tags.includes(term)) s += 2.5;
      if (brief.includes(term)) s += 1;
    }
    return { post, s };
  });

  const hits = raw.filter((r) => r.s > 0);
  if (!hits.length) return [];
  const maxS = Math.max(...hits.map((r) => r.s));

  return hits
    .map(({ post, s }) => {
      const jitter = ((hash(post.id) % 100) / 100) * 0.03 - 0.015;
      return { post, sim: Math.min(0.98, 0.58 + 0.4 * (s / maxS) + jitter) };
    })
    .sort((a, b) => (b.sim ?? 0) - (a.sim ?? 0));
}

function highlight(text: string, query: string): ReactNode {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return text;
  const re = new RegExp(
    `(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'ig'
  );
  return text
    .split(re)
    .map((part, i) =>
      terms.includes(part.toLowerCase()) ? (
        <mark key={i} className="kb-mark">{part}</mark>
      ) : (
        part
      )
    );
}

/* ---------- token-streaming excerpt ---------- */

function StreamingExcerpt({ text, active }: { text: string; active: boolean }) {
  const words = useMemo(() => text.split(/\s+/), [text]);
  const [count, setCount] = useState(words.length);
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setCount(0);
    setStreaming(true);
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= words.length) {
          clearInterval(id);
          setStreaming(false);
          return c;
        }
        return c + 1;
      });
    }, 26);
    return () => {
      clearInterval(id);
      setCount(words.length);
      setStreaming(false);
    };
  }, [active, words]);

  return (
    <p className="blog-excerpt">
      {words.slice(0, count).join(' ')}
      {streaming && <span className="stream-caret" aria-hidden="true"></span>}
    </p>
  );
}

/* ---------- page ---------- */

export default function Blog() {
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [hoverId, setHoverId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const blogPosts = await getBlogPosts(10);
        setPosts(blogPosts);
      } catch (err) {
        setError('Failed to load blog posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const results = useMemo(() => scorePosts(posts, query), [posts, query]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const latency = useMemo(() => 9 + Math.floor(Math.random() * 38), [query]);

  const searching = query.trim().length > 0;
  const matchedIds = searching ? new Set(results.map((r) => r.post.id)) : null;

  if (loading) {
    return (
      <section id="blog" className="blog">
        <div className="blog-container">
          <div className="section-header">
            <span className="section-tag">Blog</span>
            <h2 className="section-title">Knowledge Base</h2>
            <p className="section-subtitle">embedding posts from Hashnode…</p>
          </div>
          <div className="blog-loading">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="blog" className="blog">
        <div className="blog-container">
          <div className="section-header">
            <span className="section-tag">Blog</span>
            <h2 className="section-title">Knowledge Base</h2>
            <p className="section-subtitle">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="blog">
      <div className="blog-container">
        <div className="section-header">
          <span className="section-tag">Blog</span>
          <h2 className="section-title">Query My Knowledge Base</h2>
          <p className="section-subtitle">
            Every post embedded and indexed. Retrieval is semantic-ish. Powered by{' '}
            <a href="https://amanblog.hashnode.dev" target="_blank" rel="noopener noreferrer">
              Hashnode
            </a>
          </p>
        </div>

        {/* ===== retrieval bar ===== */}
        <div className="kb-search">
          <span className="kb-prompt">query&gt;</span>
          <input
            className="kb-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search my knowledge base — try 'rag', 'agents', 'mlops'…"
            spellCheck={false}
          />
          <div className="kb-toggle">
            <button
              className={`kb-toggle-btn ${view === 'grid' ? 'active' : ''}`}
              onClick={() => setView('grid')}
            >
              grid
            </button>
            <button
              className={`kb-toggle-btn ${view === 'map' ? 'active' : ''}`}
              onClick={() => setView('map')}
            >
              latent space
            </button>
          </div>
        </div>

        <div className="kb-status">
          {searching ? (
            results.length ? (
              <>retrieved <span className="kb-status-num">{results.length}/{posts.length}</span> chunks · top_k={posts.length} · <span className="kb-status-num">{latency}ms</span> · mode=hybrid</>
            ) : (
              <span className="kb-status-empty">0 chunks retrieved — similarity below threshold, try another query</span>
            )
          ) : (
            <>index ready · <span className="kb-status-num">{posts.length}</span> documents · embeddings=1536d · store=faiss</>
          )}
        </div>

        {/* ===== latent space view ===== */}
        {view === 'map' && posts.length > 0 && (
          <EmbeddingMap posts={posts} matchedIds={matchedIds} />
        )}

        {/* ===== grid view ===== */}
        {view === 'grid' && (
          <div className="blog-grid">
            {results.map(({ post, sim }) => (
              <article
                key={post.id}
                className="blog-card"
                onMouseEnter={() => setHoverId(post.id)}
                onMouseLeave={() => setHoverId(null)}
              >
                <Link to={`/blog/${post.slug}`} className="blog-card-link">
                  <div className="blog-card-content">
                    <div className="blog-card-header">
                      <span className="blog-category">
                        {post.tags?.[0]?.name ?? 'general'}
                      </span>
                      <div className="blog-card-meta">
                        {sim !== null && (
                          <span className="sim-chip">sim {sim.toFixed(2)}</span>
                        )}
                        <span className="blog-date">{formatDate(post.publishedAt)}</span>
                      </div>
                    </div>
                    <h3 className="blog-title">{highlight(post.title, query)}</h3>
                    {searching ? (
                      <p className="blog-excerpt">{highlight(post.brief, query)}</p>
                    ) : (
                      <StreamingExcerpt text={post.brief} active={hoverId === post.id} />
                    )}
                    <div className="blog-footer">
                      <span className="blog-read-time">{post.readTimeInMinutes} min read</span>
                      <span className="blog-read-more">
                        Read more
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        <div className="blog-cta">
          <a
            href="https://amanblog.hashnode.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            View All Posts on Hashnode
          </a>
        </div>
      </div>
    </section>
  );
}
