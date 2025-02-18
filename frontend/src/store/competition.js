import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiClient } from '@/utils/apiClient';

export const useCompetitionStore = defineStore('competition', () => {
  const competitions = ref([]);
  const loading = ref(false);
  const currentCompetition = ref(null);

  // 获取竞赛列表
  async function getCompetitions(params) {
    loading.value = true;
    try {
      const response = await apiClient.get('/competitions', { params });
      competitions.value = response.data.items;
      return response.data;
    } catch (error) {
      console.error('获取竞赛列表失败:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  // 获取竞赛详情
  async function getCompetitionDetail(id) {
    try {
      const response = await apiClient.get(`/competitions/${id}`);
      currentCompetition.value = response.data;
      return response.data;
    } catch (error) {
      console.error('获取竞赛详情失败:', error);
      throw error;
    }
  }

  // 报名参加竞赛
  async function enrollCompetition(id) {
    try {
      const response = await apiClient.post(`/competitions/${id}/enroll`);
      return response.data;
    } catch (error) {
      console.error('竞赛报名失败:', error);
      throw error;
    }
  }

  // 获取参赛者列表
  async function getCompetitionParticipants(id) {
    try {
      const response = await apiClient.get(`/competitions/${id}/participants`);
      return response.data;
    } catch (error) {
      console.error('获取参赛者列表失败:', error);
      throw error;
    }
  }

  // 提交参赛作品
  async function submitWork(id, data) {
    try {
      const response = await apiClient.post(
        `/competitions/${id}/submissions`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('提交作品失败:', error);
      throw error;
    }
  }

  // 获取作品详情
  async function getWorkDetail(competitionId, participantId) {
    try {
      const response = await apiClient.get(
        `/competitions/${competitionId}/submissions/${participantId}`
      );
      return response.data;
    } catch (error) {
      console.error('获取作品详情失败:', error);
      throw error;
    }
  }

  return {
    competitions,
    loading,
    currentCompetition,
    getCompetitions,
    getCompetitionDetail,
    enrollCompetition,
    getCompetitionParticipants,
    submitWork,
    getWorkDetail
  };
});
