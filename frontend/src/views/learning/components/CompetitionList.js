import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useCompetitionStore } from '@/store/competition';
import { formatTime } from '@/utils/format';

export default {
  name: 'CompetitionList',
  
  setup() {
    const router = useRouter();
    const competitionStore = useCompetitionStore();
    const loading = ref(false);
    const competitions = ref([]);
    const total = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(10);

    // 筛选配置
    const filters = ref({
      type: '',
      status: ''
    });

    const competitionTypes = [
      { label: '科技创新', value: 'tech_innovation' },
      { label: '学科竞赛', value: 'subject' },
      { label: 'AI创作', value: 'ai_creation' },
      { label: '研究报告', value: 'research' },
      { label: '创客作品', value: 'maker' }
    ];

    const competitionStatus = [
      { label: '报名中', value: 'enrolling' },
      { label: '进行中', value: 'in_progress' },
      { label: '已结束', value: 'ended' }
    ];

    // 加载竞赛列表
    const loadCompetitions = async () => {
      loading.value = true;
      try {
        const result = await competitionStore.getCompetitions({
          page: currentPage.value,
          pageSize: pageSize.value,
          ...filters.value
        });
        competitions.value = result.items;
        total.value = result.total;
      } catch (error) {
        ElMessage.error('加载竞赛列表失败');
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    // 刷新列表
    const refreshList = () => {
      currentPage.value = 1;
      loadCompetitions();
    };

    // 处理报名
    const handleEnroll = async (competition) => {
      try {
        await competitionStore.enrollCompetition(competition.id);
        ElMessage.success('报名成功！');
        // 更新竞赛状态
        competition.isEnrolled = true;
      } catch (error) {
        ElMessage.error('报名失败，请重试');
        console.error(error);
      }
    };

    // 查看详情
    const viewDetail = (competition) => {
      router.push({
        name: 'CompetitionDetail',
        params: { id: competition.id }
      });
    };

    // 判断是否可以报名
    const canEnroll = (competition) => {
      return competition.status === 'enrolling' && !competition.isEnrolled;
    };

    // 获取状态标签类型
    const getStatusType = (status) => {
      const types = {
        enrolling: 'success',
        in_progress: 'warning',
        ended: 'info'
      };
      return types[status] || 'info';
    };

    // 获取状态标签文本
    const getStatusLabel = (status) => {
      const labels = {
        enrolling: '报名中',
        in_progress: '进行中',
        ended: '已结束'
      };
      return labels[status] || status;
    };

    // 分页处理
    const handleSizeChange = (size) => {
      pageSize.value = size;
      refreshList();
    };

    const handleCurrentChange = (page) => {
      currentPage.value = page;
      loadCompetitions();
    };

    onMounted(() => {
      loadCompetitions();
    });

    return {
      loading,
      competitions,
      total,
      currentPage,
      pageSize,
      filters,
      competitionTypes,
      competitionStatus,
      refreshList,
      handleEnroll,
      viewDetail,
      canEnroll,
      getStatusType,
      getStatusLabel,
      handleSizeChange,
      handleCurrentChange,
      formatTime
    };
  }
};
