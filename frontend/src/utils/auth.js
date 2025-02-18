import { api } from './api';
import { logger } from './logger';
import { useAuthStore } from '@/stores/auth';

class AuthService {
  constructor() {
    this.tokenKey = 'ai_edu_token';
    this.refreshTokenKey = 'ai_edu_refresh_token';
    this.userKey = 'ai_edu_user';
  }

  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      this.setTokens(response.data.token, response.data.refreshToken);
      this.setUser(response.data.user);
      return response.data;
    } catch (error) {
      logger.error('Login failed:', error);
      throw error;
    }
  }

  async logout() {
    try {
      const authStore = useAuthStore();
      await api.post('/auth/logout');
      this.clearAuth();
      authStore.resetState();
    } catch (error) {
      logger.error('Logout failed:', error);
      // 即使API调用失败也清除本地认证状态
      this.clearAuth();
    }
  }

  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh-token', {
        refreshToken
      });

      this.setTokens(response.data.token, response.data.refreshToken);
      return response.data.token;
    } catch (error) {
      logger.error('Token refresh failed:', error);
      this.clearAuth();
      throw error;
    }
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey);
  }

  getUser() {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  setTokens(token, refreshToken) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  setUser(user) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  clearAuth() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  hasRole(role) {
    const user = this.getUser();
    return user && user.roles && user.roles.includes(role);
  }

  async validateToken() {
    try {
      await api.post('/auth/validate-token');
      return true;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return this.handleTokenExpiration();
      }
      return false;
    }
  }

  private async handleTokenExpiration() {
    try {
      await this.refreshToken();
      return true;
    } catch (error) {
      this.clearAuth();
      return false;
    }
  }
}

export const authService = new AuthService();
