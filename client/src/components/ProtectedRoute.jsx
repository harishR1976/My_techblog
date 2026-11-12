import { Navigate } from 'react-router-dom';

function hasValidToken() {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const payload = JSON.parse(
      atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    return !payload.exp || payload.exp * 1000 > Date.now();
  } catch (err) {
    return false;
  }
}

export default function ProtectedRoute({ children }) {
  if (!hasValidToken()) {
    localStorage.removeItem('token');
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
