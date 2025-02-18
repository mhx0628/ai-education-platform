import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { api } from '../utils/api';

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null,
    preferences: null,
    notifications: [],
    learningStats: null,
    loading: false
  }),

  getters: {
    userRole: state => state.profile?.role || 'guest',
    isTeacher: state => state.profile?.role === 'teacher',
    isStudent: state => state.profile?.role === 'student',
    hasUnreadNotifications: state => 
      state.notifications.filter(n => !n.read).length > 0
  },

  actions: {
    async fetchUserProfile() {
      try {
        this.loading = true;
        const response = await api.get('/user/profile');
        this.profile = response.data;
        this.preferences = response.data.preferences;
      } catch (error) {
        console.error('获取用户信息失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateUserProfile(data) {
      try {
        const response = await api.put('/user/profile', data);
        this.profile = response.data;
        return response.data;
      } catch (error) {
        console.error('更新用户信息失败:', error);
        throw error;
      }
    },

    async fetchNotifications() {
      try {
        const response = await api.get('/user/notifications');
        this.notifications = response.data;
      } catch (error) {
        console.error('获取通知失败:', error);
        throw error;
      }
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user',
        storage: localStorage,
        paths: ['preferences']
      }
    ]
  }
});
