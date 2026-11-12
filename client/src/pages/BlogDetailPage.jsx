import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [prevPost, setPrevPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    api
      .get(`/posts/${slug}`)
      .then((res) => {
        if (res.data.post) {
          setPost(res.data.post);
          setPrevPost(res.data.previous || null);
          setNextPost(res.data.next || null);
        } else {
          setPost(res.data);
        }
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const { htmlWithIds, toc } = useMemo(() => {
    const raw = post?.content || '';
    const items = [];
    let i = 0;
    const processed = raw.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (m, attrs, text) => {
      const id = `sec-${i++}`;
      items.push({ id, text: text.replace(/<[^>]*>/g, '') });
      return `<h2 id="${id}"${attrs}>${text}</h2>`;
    });
    return { htmlWithIds: processed, toc: items };
  }, [post?.content]);

  if (loading) {
    return (
      <div className="container">
        <div className="empty-state">Loading article...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>Article Not Found</h2>
          <p style={{ marginTop: '8px' }}>
            <Link to="/">← Back to Home</Link>
          </p>
        </div>
      </div>
    );
  }

  const authorName = post.authorName || post.author?.name || 'Community Writer';
  const catName = post.category?.name || post.category || 'Technology';

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container">
      <article className="article-view">
        <Link to="/" className="back-link">
          ← Back to all articles
        </Link>

        <h1>{post.title}</h1>

        <div className="article-meta-row">
          <div>
            <span>
              By <strong>{authorName}</strong>
            </span>{' '}
            • <span>{catName}</span> • <span>{post.readingTime || 3} min read</span> •{' '}
            <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
          </div>
          <button type="button" className="btn-secondary" onClick={handleCopyLink}>
            {copied ? 'Link Copied!' : 'Copy Share Link'}
          </button>
        </div>

        {post.featuredImage && (
          <img src={post.featuredImage} alt={post.title} className="detail-cover" />
        )}

        {toc.length >= 2 && (
          <div className="toc-box">
            <strong>Table of Contents</strong>
            <ul>
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.text}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: htmlWithIds }}
        />

        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="tag-list">
            {post.tags.map((t) => (
              <span key={t} className="tag-item">
                #{t}
              </span>
            ))}
          </div>
        )}

        {(prevPost || nextPost) && (
          <div className="prev-next">
            <div>
              {prevPost && <Link to={`/blog/${prevPost.slug}`}>← {prevPost.title}</Link>}
            </div>
            <div>
              {nextPost && <Link to={`/blog/${nextPost.slug}`}>{nextPost.title} →</Link>}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
