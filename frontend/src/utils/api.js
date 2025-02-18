import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    
    // 添加防重放标识
    config.headers['X-Request-Id'] = generateRequestId();
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    handleApiError(error);
    return Promise.reject(error);
  }
);

// 错误处理函数
function handleApiError(error) {
  const authStore = useAuthStore();
  
  if (error.response) {
    switch (error.response.status) {
      case 401:
        authStore.logout();
        router.push('/login');
        break;
      case 403:
        ElMessage.error('权限不足');
        break;
      case 404:
        ElMessage.error('请求的资源不存在');
        break;
      case 500:
        ElMessage.error('服务器错误');
        break;
      default:
        ElMessage.error(error.response.data.message || '请求失败');
    }
  } else if (error.request) {
    ElMessage.error('网络错误，请检查您的网络连接');
  } else {
    ElMessage.error('发生错误，请稍后重试');
  }
}

// 生成请求ID
function generateRequestId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// API请求封装
export const apiService = {
  async get(url, params = {}, config = {}) {
    try {
      const response = await api.get(url, { params, ...config });
      return response;
    } catch (error) {
      console.error(`GET ${url} failed:`, error);
      throw error;
    }
  },

  async post(url, data = {}, config = {}) {
    try {
      const response = await api.post(url, data, config);
      return response;
    } catch (error) {
      console.error(`POST ${url} failed:`, error);
      throw error;
    }
  },

  async put(url, data = {}, config = {}) {
    try {
      const response = await api.put(url, data, config);
      return response;
    } catch (error) {
      console.error(`PUT ${url} failed:`, error);
      throw error;
    }
  },

  async delete(url, config = {}) {
    try {
      const response = await api.delete(url, config);
      return response;
    } catch (error) {
      console.error(`DELETE ${url} failed:`, error);
      throw error;
    }
  }
};

export { api };
