import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import ArticleCard from '../components/ArticleCard';

const DEFAULT_CATEGORIES = [
  'All',
  'Software Development',
  'Artificial Intelligence & Machine Learning',
  'Web and Mobile App Development',
  'Technology & Innovation',
  'Cybersecurity',
  'Cloud Computing',
  'Industry Insights'
];

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [visibleLimit, setVisibleLimit] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get('/posts?limit=50')
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data.posts || [];
        setPosts(list);
      })
      .catch((err) => console.error('Error loading posts:', err))
      .finally(() => setLoading(false));
  }, []);

  const featuredPost =
    activeCategory === 'All' && !search.trim()
      ? posts.find((p) => p.isFeatured) || posts[0]
      : null;

  let filtered = posts.filter((p) => {
    if (featuredPost && p._id === featuredPost._id) return false;
    const catName = p.category?.name || p.category || '';
    const matchCat = activeCategory === 'All' || catName === activeCategory;
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      (p.title || '').toLowerCase().includes(q) ||
      (p.shortDescription || '').toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  if (sortBy === 'popular') {
    filtered = [...filtered].sort((a, b) => (b.views || 0) - (a.views || 0));
  }

  const shown = filtered.slice(0, visibleLimit);
  const trending = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4);

  return (
    <div className="container">
      <section className="intro-box">
        <div className="intro-text">
          <h1>Tech Notes & Community Blog</h1>
          <p>Developer notes, tutorials, and engineering articles. Anyone can read or publish a post.</p>
        </div>
        <div className="search-box">
          <input
            type="search"
            placeholder="Search title or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {featuredPost && (
        <section className="featured-card">
          <Link to={`/blog/${featuredPost.slug}`} className="featured-thumb">
            <img
              src={
                featuredPost.featuredImage ||
                'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
              }
              alt={featuredPost.title}
            />
          </Link>
          <div className="featured-body">
            <span className="featured-label">Featured Note</span>
            <h2 className="featured-title">
              <Link to={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
            </h2>
            <p className="card-desc">{featuredPost.shortDescription}</p>
            <div className="card-meta" style={{ borderTop: 'none', paddingTop: 0 }}>
              <span>
                By {featuredPost.authorName || featuredPost.author?.name || 'Admin'} •{' '}
                {featuredPost.readingTime || 3} min read
              </span>
              <span>
                {new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </section>
      )}

      <div className="controls-row">
        <div className="cat-strip">
          {DEFAULT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory(cat);
                setVisibleLimit(6);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="latest">Sort: Latest</option>
          <option value="popular">Sort: Most Viewed</option>
        </select>
      </div>

      <div className="home-layout">
        <div>
          {loading ? (
            <div className="empty-state">Loading articles...</div>
          ) : shown.length === 0 ? (
            <div className="empty-state">
              <p>
                No articles match your filter.{' '}
                <Link to="/write">Click here to write the first post!</Link>
              </p>
            </div>
          ) : (
            <>
              <div className="posts-grid">
                {shown.map((post) => (
                  <ArticleCard key={post._id} post={post} />
                ))}
              </div>
              {filtered.length > shown.length && (
                <div style={{ textAlign: 'center', marginTop: '18px' }}>
                  <button
                    className="btn-secondary"
                    onClick={() => setVisibleLimit((prev) => prev + 6)}
                  >
                    Load More Articles
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <aside>
          <div className="sidebar-box">
            <h3>Popular Articles</h3>
            {trending.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#57606a' }}>No trending articles yet.</p>
            ) : (
              trending.map((t) => (
                <div key={t._id} className="trending-item">
                  <Link to={`/blog/${t.slug}`} className="trending-link">
                    {t.title}
                  </Link>
                  <span className="trending-meta">
                    {t.views || 1} views • {t.readingTime || 2} min read
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="sidebar-box">
            <h3>Open Contribution</h3>
            <p style={{ fontSize: '13px', color: '#57606a', marginBottom: '10px' }}>
              Have a setup note, bug fix, or tutorial to share?
            </p>
            <Link to="/write" className="btn-write" style={{ width: '100%', textAlign: 'center' }}>
              + Write a Post
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
