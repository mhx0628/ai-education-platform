import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),

  actions: {
    async login(credentials) {
      try {
        // TODO: 实现登录逻辑
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        const data = await response.json();
        this.setUser(data.user);
        this.setToken(data.token);
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },

    setUser(user) {
      this.user = user;
      this.isAuthenticated = true;
    },

    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
    }
  }
});
