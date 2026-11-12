import { Link } from 'react-router-dom';

const DEFAULT_IMG =
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';

export default function ArticleCard({ post }) {
  const categoryName = post.category?.name || post.category || 'Technology';
  const authorName = post.authorName || post.author?.name || 'Community Writer';
  const dateStr = new Date(post.publishedAt || post.createdAt || Date.now()).toLocaleDateString();

  return (
    <article className="post-card">
      <Link to={`/blog/${post.slug}`} className="card-thumb">
        <img src={post.featuredImage || DEFAULT_IMG} alt={post.title} loading="lazy" />
      </Link>
      <div className="card-body">
        <span className="card-cat">{categoryName}</span>
        <h3 className="card-title">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="card-desc">{post.shortDescription}</p>
        <div className="card-meta">
          <span>By {authorName}</span>
          <span>
            {post.readingTime || 3} min • {dateStr}
          </span>
        </div>
      </div>
    </article>
  );
}
