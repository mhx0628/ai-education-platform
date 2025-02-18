import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout')
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data)
};

export const contentAPI = {
  getContents: (params) => api.get('/contents', { params }),
  createContent: (data) => api.post('/contents', data),
  updateContent: (id, data) => api.put(`/contents/${id}`, data),
  deleteContent: (id) => api.delete(`/contents/${id}`)
};

export default api;
