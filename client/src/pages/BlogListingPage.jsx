import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/client';
import ArticleCard from '../components/ArticleCard';

export default function BlogListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get('/posts?limit=50')
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data.posts || [];
        setPosts(list);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (p.title || '').toLowerCase().includes(q) ||
      (p.shortDescription || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="container">
      <section className="intro-box">
        <div className="intro-text">
          <h1>All Published Articles ({filtered.length})</h1>
          <p>Browse every published tutorial and technical note.</p>
        </div>
        <div className="search-box">
          <input
            type="search"
            placeholder="Filter by keyword..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchParams(e.target.value ? { search: e.target.value } : {});
            }}
          />
        </div>
      </section>

      {loading ? (
        <div className="empty-state">Loading articles...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          No articles found. <Link to="/write">Write a new article</Link>.
        </div>
      ) : (
        <div className="posts-grid">
          {filtered.map((post) => (
            <ArticleCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
