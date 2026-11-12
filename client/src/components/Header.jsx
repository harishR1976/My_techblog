import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container nav-bar">
        <Link to="/" className="brand">
          <span className="brand-dot" />
          <span>MyTechBlog</span>
        </Link>

        <nav className="nav-actions">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
          <NavLink to="/blog" className="nav-link">
            All Articles
          </NavLink>
          <NavLink to="/admin/dashboard" className="nav-link">
            Admin Panel
          </NavLink>
          <Link to="/write" className="btn-write">
            + Write Article
          </Link>
        </nav>
      </div>
    </header>
  );
}
