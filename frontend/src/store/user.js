import { defineStore } from 'pinia';
import { authAPI, userAPI } from '@/services/api';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null
  }),

  actions: {
    async login(credentials) {
      this.loading = true;
      try {
        const data = await authAPI.login(credentials);
        this.token = data.token;
        localStorage.setItem('token', data.token);
        await this.fetchUserProfile();
        return true;
      } catch (error) {
        this.error = error.message;
        return false;
      } finally {
        this.loading = false;
      }
    },

    async fetchUserProfile() {
      if (!this.token) return;
      try {
        const data = await userAPI.getProfile();
        this.user = data;
      } catch (error) {
        this.error = error.message;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
    }
  }
});
