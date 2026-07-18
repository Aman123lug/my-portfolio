import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPost, formatDate } from '../services/hashnode';
import type { BlogPost } from '../services/hashnode';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './BlogPostPage.css';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkRead, setDarkRead] = useState(
    () => localStorage.getItem('reading-dark') === '1'
  );

  useEffect(() => {
    localStorage.setItem('reading-dark', darkRead ? '1' : '0');
  }, [darkRead]);

  const pageClass = `blog-post-page${darkRead ? ' reading-dark' : ''}`;

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      
      try {
        const blogPost = await getBlogPost(slug);
        if (blogPost) {
          setPost(blogPost);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        setError('Failed to load blog post');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className={pageClass}>
          <div className="blog-post-container">
            <div className="blog-post-loading">
              <div className="loading-spinner"></div>
              <p>Loading article...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navbar />
        <main className={pageClass}>
          <div className="blog-post-container">
            <div className="blog-post-error">
              <h1>Article Not Found</h1>
              <p>{error || 'The article you are looking for does not exist.'}</p>
              <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={pageClass}>
        <button
          className="reading-toggle"
          onClick={() => setDarkRead((d) => !d)}
          aria-label={darkRead ? 'Switch to light reading' : 'Switch to dark reading'}
        >
          {darkRead ? '☀ light' : '☾ reading mode'}
        </button>
        <article className="blog-post-container">
          <header className="blog-post-header">
            <Link to="/blog" className="back-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Blog
            </Link>
            
            <div className="blog-post-meta">
              {post.tags && post.tags[0] && (
                <span className="blog-post-category">{post.tags[0].name}</span>
              )}
              <span className="blog-post-date">{formatDate(post.publishedAt)}</span>
              <span className="blog-post-read-time">{post.readTimeInMinutes} min read</span>
            </div>
            
            <h1 className="blog-post-title">{post.title}</h1>
            
            {post.coverImage?.url && (
              <div className="blog-post-cover">
                <img src={post.coverImage.url} alt={post.title} />
              </div>
            )}
          </header>

          <div 
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: post.content?.html || '' }}
          />

          <footer className="blog-post-footer">
            <div className="blog-post-actions">
              {post.source !== 'local' && (
                <a
                  href={`https://amanblog.hashnode.dev/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  View on Hashnode
                </a>
              )}
              <Link to="/blog" className="btn btn-primary">
                More Articles
              </Link>
            </div>

            {post.source !== 'local' && (
              <p className="blog-post-attribution">
                Originally published on{' '}
                <a href="https://amanblog.hashnode.dev" target="_blank" rel="noopener noreferrer">
                  Hashnode
                </a>
              </p>
            )}
          </footer>
        </article>
      </main>
      <Footer />
    </>
  );
}
