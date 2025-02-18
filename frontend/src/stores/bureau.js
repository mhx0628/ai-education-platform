import { defineStore } from 'pinia';
import { api } from '@/utils/api';

export const useBureauStore = defineStore('bureau', {
  state: () => ({
    districtData: null,
    activeAlerts: [],
    analyticsData: null,
    schoolRankings: [],
    selectedDistrict: null
  }),

  actions: {
    async fetchDistrictData(districtId) {
      try {
        const response = await api.get(`/bureau/district/${districtId}/overview`);
        this.districtData = response.data;
      } catch (error) {
        console.error('获取区域数据失败:', error);
        throw error;
      }
    },

    async getActiveAlerts() {
      try {
        const response = await api.get('/bureau/alerts/active');
        this.activeAlerts = response.data;
      } catch (error) {
        console.error('获取预警信息失败:', error);
        throw error;
      }
    },

    async handleAlert(alertId, action) {
      try {
        await api.post(`/bureau/alerts/${alertId}/handle`, { action });
        await this.getActiveAlerts();
      } catch (error) {
        console.error('处理预警失败:', error);
        throw error;
      }
    },

    async getSchoolRankings(type = 'comprehensive') {
      try {
        const response = await api.get(`/bureau/schools/rankings`, {
          params: { type }
        });
        this.schoolRankings = response.data;
      } catch (error) {
        console.error('获取学校排名失败:', error);
        throw error;
      }
    },

    async getAnalyticsData(params) {
      try {
        const response = await api.get('/bureau/analytics', { params });
        this.analyticsData = response.data;
      } catch (error) {
        console.error('获取分析数据失败:', error);
        throw error;
      }
    }
  }
});
