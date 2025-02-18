import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useCompetitionStore } from '@/store/competition';
import { useUserStore } from '@/store/user';
import { formatTime } from '@/utils/format';

export default {
  name: 'CompetitionDetail',

  setup() {
    const route = useRoute();
    const router = useRouter();
    const competitionStore = useCompetitionStore();
    const userStore = useUserStore();

    const competition = ref({});
    const participants = ref([]);
    const activeTab = ref('intro');
    const loading = ref(false);

    // 计算属性
    const canEnroll = computed(() => {
      return competition.value.status === 'enrolling' && !isEnrolled.value;
    });

    const isEnrolled = computed(() => {
      return participants.value.some(p => p.id === userStore.user?.id);
    });

    const enrollButtonText = computed(() => {
      if (isEnrolled.value) return '已报名';
      if (competition.value.status === 'ended') return '已结束';
      if (competition.value.status === 'in_progress') return '进行中';
      return '立即报名';
    });

    // 方法
    const loadCompetitionDetail = async () => {
      loading.value = true;
      try {
        const id = route.params.id;
        competition.value = await competitionStore.getCompetitionDetail(id);
        participants.value = await competitionStore.getCompetitionParticipants(id);
      } catch (error) {
        ElMessage.error('加载竞赛详情失败');
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    const handleEnroll = async () => {
      try {
        await competitionStore.enrollCompetition(competition.value.id);
        ElMessage.success('报名成功！');
        await loadCompetitionDetail(); // 刷新数据
      } catch (error) {
        ElMessage.error('报名失败，请重试');
        console.error(error);
      }
    };

    const viewMySubmission = () => {
      router.push({
        name: 'CompetitionSubmission',
        params: { 
          id: competition.value.id,
          userId: userStore.user.id
        }
      });
    };

    const viewWork = (participant) => {
      router.push({
        name: 'CompetitionWork',
        params: { 
          id: competition.value.id,
          participantId: participant.id
        }
      });
    };

    const getStatusType = (status) => {
      const types = {
        enrolling: 'success',
        in_progress: 'warning',
        ended: 'info'
      };
      return types[status] || 'info';
    };

    const getStatusLabel = (status) => {
      const labels = {
        enrolling: '报名中',
        in_progress: '进行中',
        ended: '已结束'
      };
      return labels[status] || status;
    };

    onMounted(loadCompetitionDetail);

    return {
      competition,
      participants,
      activeTab,
      loading,
      canEnroll,
      isEnrolled,
      enrollButtonText,
      handleEnroll,
      viewMySubmission,
      viewWork,
      getStatusType,
      getStatusLabel,
      formatTime
    };
  }
};
