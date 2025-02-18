import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { learningApi } from '@/api/learning';

export const useLearningStore = defineStore('learning', () => {
  // 状态
  const currentCourse = ref(null);
  const learningProgress = ref({});
  const challenges = ref([]);
  const projects = ref([]);
  const activities = ref([]);

  // Getters
  const completedChallenges = computed(() => 
    challenges.value.filter(c => c.status === 'completed')
  );

  const activeProjects = computed(() => 
    projects.value.filter(p => p.status === 'in_progress')
  );

  // Actions
  async function loadCourseProgress(courseId) {
    try {
      const progress = await learningApi.getCourseProgress(courseId);
      learningProgress.value[courseId] = progress;
    } catch (error) {
      console.error('加载课程进度失败:', error);
      throw error;
    }
  }

  async function startChallenge(challengeId) {
    try {
      const challenge = await learningApi.startChallenge(challengeId);
      challenges.value.push(challenge);
      return challenge;
    } catch (error) {
      console.error('开始挑战失败:', error);
      throw error;
    }
  }

  async function submitProject(projectId, data) {
    try {
      const result = await learningApi.submitProject(projectId, data);
      const index = projects.value.findIndex(p => p.id === projectId);
      if (index !== -1) {
        projects.value[index] = result;
      }
      return result;
    } catch (error) {
      console.error('提交项目失败:', error);
      throw error;
    }
  }

  return {
    // 状态
    currentCourse,
    learningProgress,
    challenges,
    projects,
    activities,
    // Getters
    completedChallenges,
    activeProjects,
    // Actions
    loadCourseProgress,
    startChallenge,
    submitProject
  };
});
