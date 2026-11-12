import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts/admin/all').catch(() => api.get('/posts?limit=100'));
      const list = Array.isArray(res.data) ? res.data : res.data.posts || [];
      setPosts(list);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleToggleStatus = async (post) => {
    const nextStatus = post.status === 'published' ? 'unpublished' : 'published';
    try {
      await api.put(`/posts/${post._id}`, { status: nextStatus });
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const visible = posts.filter((p) => {
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const q = search.trim().toLowerCase();
    const matchSearch = !q || (p.title || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="container">
      <div className="admin-card">
        <div className="admin-top">
          <div>
            <h2 style={{ fontSize: '20px' }}>Article Management</h2>
            <p style={{ fontSize: '13.5px', color: '#57606a' }}>
              Manage, publish, and curate community and editorial posts.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn-secondary" onClick={handleLogout}>
              Logout
            </button>
            <button type="button" className="btn-secondary" onClick={fetchPosts}>
              Refresh
            </button>
            <Link to="/write" className="btn-write">
              + New Article
            </Link>
          </div>
        </div>

        <div className="controls-row">
          <div className="admin-tabs" style={{ marginBottom: 0 }}>
            {['all', 'published', 'draft', 'scheduled', 'unpublished'].map((st) => (
              <button
                key={st}
                type="button"
                className={`cat-pill ${statusFilter === st ? 'active' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                {st.charAt(0).toUpperCase() + st.slice(1)}
              </button>
            ))}
          </div>

          <div className="search-box" style={{ maxWidth: '260px' }}>
            <input
              type="search"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Loading articles...</div>
        ) : visible.length === 0 ? (
          <div className="empty-state">
            <p style={{ marginBottom: '10px' }}>
              No articles found in "{statusFilter}" status.
            </p>
            <Link to="/write" className="btn-primary">
              + Create Your First Article
            </Link>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <Link to={`/blog/${p.slug}`}>
                        <strong>{p.title}</strong>
                      </Link>
                    </td>
                    <td>{p.category?.name || p.category || 'General'}</td>
                    <td>{p.authorName || p.author?.name || 'Admin'}</td>
                    <td>
                      <span className={`badge-status badge-${p.status || 'published'}`}>
                        {p.status || 'published'}
                      </span>
                    </td>
                    <td>
                      {new Date(p.publishedAt || p.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="action-btn"
                        onClick={() => handleToggleStatus(p)}
                      >
                        {p.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        type="button"
                        className="action-btn danger"
                        onClick={() => handleDelete(p._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
