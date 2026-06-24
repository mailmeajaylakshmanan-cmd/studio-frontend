import axios from 'axios';

const api = axios.create({ 
  // This will use the variable you set in Vercel
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials: true 
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
