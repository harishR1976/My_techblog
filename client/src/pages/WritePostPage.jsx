import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';

const CATEGORIES = [
  'Software Development',
  'Artificial Intelligence & Machine Learning',
  'Web and Mobile App Development',
  'Technology & Innovation',
  'Cybersecurity',
  'Cloud Computing',
  'Industry Insights'
];

export default function WritePostPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    authorName: '',
    title: '',
    category: CATEGORIES[0],
    tags: '',
    shortDescription: '',
    featuredImage: '',
    content: ''
  });

  const addSnippet = (snip) => {
    setForm((prev) => ({
      ...prev,
      content: prev.content + (prev.content ? '\n' : '') + snip
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      let bodyContent = form.content.trim();
      if (!bodyContent.includes('<')) {
        bodyContent = bodyContent
          .split('\n\n')
          .map((p) => `<p>${p}</p>`)
          .join('');
      }
      const { data } = await api.post('/posts', {
        ...form,
        content: bodyContent,
        status: 'published'
      });
      navigate(`/blog/${data.slug || ''}`);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Could not publish post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="form-card">
        <h2>Write a New Article</h2>
        <p className="form-sub">
          Publish your technical note or tutorial directly to the blog.
        </p>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Your Name *</label>
            <input
              required
              placeholder="e.g. Harish Krishna"
              value={form.authorName}
              onChange={(e) => setForm({ ...form, authorName: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Article Title *</label>
            <input
              required
              placeholder="e.g. Connecting MongoDB Atlas to Node.js"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Short Summary *</label>
            <input
              required
              placeholder="1-2 line summary shown on article cards..."
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Cover Image URL (Optional)</label>
            <input
              placeholder="https://images.unsplash.com/..."
              value={form.featuredImage}
              onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Content *</label>
            <div className="toolbar-mini">
              <button type="button" onClick={() => addSnippet('<h2>Section Heading</h2>')}>
                + Heading
              </button>
              <button type="button" onClick={() => addSnippet('<p>Paragraph text...</p>')}>
                + Paragraph
              </button>
              <button type="button" onClick={() => addSnippet('<pre>// Code snippet</pre>')}>
                + Code Block
              </button>
            </div>
            <textarea
              rows="9"
              required
              placeholder="Write your article content here..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish Now'}
            </button>
            <Link to="/" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
