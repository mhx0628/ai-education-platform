import { ref, computed } from 'vue';
import { Star, Share } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useProjectStore } from '@/store/project';
import { formatTime } from '@/utils/format';
import draggable from 'vuedraggable';

export default {
  name: 'ProjectDetail',
  components: {
    draggable
  },

  props: {
    project: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const projectStore = useProjectStore();
    const activeTab = ref('overview');

    // 任务状态定义
    const taskStatus = [
      { label: '待处理', value: 'todo' },
      { label: '进行中', value: 'doing' },
      { label: '已完成', value: 'done' }
    ];

    // 任务分组数据
    const taskGroups = computed(() => {
      const groups = { todo: [], doing: [], done: [] };
      props.project.tasks?.forEach(task => {
        groups[task.status].push(task);
      });
      return groups;
    });

    // 权限检查
    const canEdit = computed(() => {
      return projectStore.hasProjectPermission(props.project.id, 'edit');
    });

    // 方法定义
    const toggleStar = async () => {
      try {
        await projectStore.toggleProjectStar(props.project.id);
        ElMessage.success(props.project.isStarred ? '已取消收藏' : '收藏成功');
      } catch (error) {
        ElMessage.error('操作失败');
        console.error(error);
      }
    };

    const shareProject = () => {
      // 实现分享功能，可以调用原生分享API或自定义分享面板
      const shareData = {
        title: props.project.name,
        text: props.project.description,
        url: window.location.href
      };

      if (navigator.share && navigator.canShare(shareData)) {
        navigator.share(shareData);
      } else {
        ElMessage.info('分享功能开发中...');
      }
    };

    const addTask = (status) => {
      projectStore.openTaskDialog({
        projectId: props.project.id,
        initialStatus: status
      });
    };

    const handleTaskMove = async ({ moved }) => {
      if (!moved) return;

      try {
        const { element, newIndex, oldIndex } = moved;
        await projectStore.updateTaskStatus({
          taskId: element.id,
          newStatus: taskStatus[newIndex].value,
          oldStatus: taskStatus[oldIndex].value
        });
      } catch (error) {
        ElMessage.error('更新任务状态失败');
        console.error(error);
      }
    };

    return {
      activeTab,
      taskStatus,
      taskGroups,
      canEdit,
      toggleStar,
      shareProject,
      addTask,
      handleTaskMove,
      formatTime
    };
  }
};
