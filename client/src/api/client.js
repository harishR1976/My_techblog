import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const isLogin = err.config?.url?.includes('/auth/login');
    if (status === 401 && !isLogin && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default api;
