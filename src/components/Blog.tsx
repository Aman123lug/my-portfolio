import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts, formatDate } from '../services/hashnode';
import type { BlogPost as BlogPostType } from '../services/hashnode';
import './Blog.css';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <section id="blog" className="blog">
        <div className="blog-container">
          <div className="section-header">
            <span className="section-tag">Blog</span>
            <h2 className="section-title">Latest Articles</h2>
            <p className="section-subtitle">Loading posts from Hashnode...</p>
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
            <h2 className="section-title">Latest Articles</h2>
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
          <h2 className="section-title">Latest Articles</h2>
          <p className="section-subtitle">
            Thoughts, insights, and stories from my journey. Powered by{' '}
            <a href="https://amanblog.hashnode.dev" target="_blank" rel="noopener noreferrer">
              Hashnode
            </a>
          </p>
        </div>

        <div className="blog-grid">
          {posts.map((post) => (
            <article key={post.id} className="blog-card">
              <Link to={`/blog/${post.slug}`} className="blog-card-link">
                {post.coverImage?.url && (
                  <div className="blog-image">
                    <img src={post.coverImage.url} alt={post.title} />
                  </div>
                )}
                <div className="blog-card-content">
                  <div className="blog-card-header">
                    {post.tags && post.tags[0] && (
                      <span className="blog-category">{post.tags[0].name}</span>
                    )}
                    <span className="blog-date">{formatDate(post.publishedAt)}</span>
                  </div>
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-excerpt">{post.brief}</p>
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
