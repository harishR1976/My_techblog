import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { FileText, PlusCircle, LogOut, User, LayoutDashboard, Globe } from 'lucide-react'

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="admin-root">
      <header className="admin-header">
        <div className="admin-header-container">
          <div className="admin-brand">
            <Link to="/admin/dashboard" className="admin-logo">
              <LayoutDashboard size={22} className="logo-icon" />
              <span>Blog CMS</span>
            </Link>
          </div>

          <nav className="admin-nav">
            <NavLink
              to="/admin/dashboard"
              end
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? 'active' : ''}`
              }
            >
              <FileText size={18} />
              <span>Articles</span>
            </NavLink>
            <NavLink
              to="/admin/posts/new"
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? 'active' : ''}`
              }
            >
              <PlusCircle size={18} />
              <span>New Article</span>
            </NavLink>
          </nav>

          <div className="admin-user-menu">
            <Link to="/" target="_blank" rel="noopener noreferrer" className="admin-visit-site" title="Visit Public Site">
              <Globe size={16} />
              <span>Site</span>
            </Link>
            <div className="admin-user-info" title={user?.email || 'Logged in admin'}>
              <User size={16} />
              <span className="user-name">{user?.name || user?.email || 'Admin'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="admin-logout-btn"
              title="Sign Out"
              type="button"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
