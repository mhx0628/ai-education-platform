<template>
  <div class="activities">
    <!-- 活动过滤器 -->
    <section class="filter-section">
      <el-form :inline="true" class="filter-form">
        <el-form-item label="活动级别">
          <el-select v-model="filters.level" placeholder="选择级别">
            <el-option label="班级活动" value="class" />
            <el-option label="年级活动" value="grade" />
            <el-option label="学校活动" value="school" />
            <el-option label="区域活动" value="district" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动类型">
          <el-select v-model="filters.type" placeholder="选择类型">
            <el-option label="作品展示" value="exhibition" />
            <el-option label="比赛" value="competition" />
            <el-option label="科技活动" value="tech" />
            <el-option label="实践活动" value="practice" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchActivities">搜索</el-button>
          <el-button v-if="canCreateActivity" @click="showCreateDialog">
            创建活动
          </el-button>
        </el-form-item>
      </el-form>
    </section>

    <!-- 活动列表 -->
    <section class="activities-list">
      <el-row :gutter="20">
        <el-col 
          v-for="activity in activities" 
          :key="activity.id" 
          :span="8"
        >
          <el-card class="activity-card" @click="viewActivityDetail(activity)">
            <img :src="activity.coverImage" class="activity-image">
            <div class="activity-info">
              <h3>{{ activity.title }}</h3>
              <p class="description">{{ activity.description }}</p>
              <div class="meta-info">
                <span class="time">
                  <el-icon><Timer /></el-icon>
                  {{ formatDate(activity.startTime) }}
                </span>
                <el-tag :type="activity.status === 'ongoing' ? 'success' : 'info'">
                  {{ getStatusText(activity.status) }}
                </el-tag>
              </div>
              <div class="stats">
                <span>{{ activity.participants }}人参与</span>
                <span>{{ activity.submissions }}个作品</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 分页器 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[12, 24, 36, 48]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </section>

    <!-- 创建活动对话框 -->
    <el-dialog
      v-model="createDialogVisible"
      title="创建新活动"
      width="60%"
    >
      <activity-form
        v-if="createDialogVisible"
        @submit="handleCreateActivity"
        @cancel="createDialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { Timer } from '@element-plus/icons-vue';
import ActivityForm from '@/components/activity/ActivityForm.vue';

const router = useRouter();
const userStore = useUserStore();

// 状态
const filters = ref({
  level: '',
  type: ''
});
const page = ref(1);
const pageSize = ref(12);
const total = ref(0);
const activities = ref([]);
const createDialogVisible = ref(false);

// 计算属性
const canCreateActivity = computed(() => {
  return ['teacher', 'admin'].includes(userStore.user?.role);
});

// 方法
const searchActivities = async () => {
  // TODO: 实现活动搜索逻辑
};

const viewActivityDetail = (activity) => {
  router.push({
    name: 'ActivityDetail',
    params: { id: activity.id }
  });
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const getStatusText = (status) => {
  const statusMap = {
    upcoming: '即将开始',
    ongoing: '进行中',
    ended: '已结束'
  };
  return statusMap[status] || status;
};

const handleCreateActivity = async (formData) => {
  try {
    // TODO: 实现创建活动逻辑
    createDialogVisible.value = false;
    await searchActivities();
  } catch (error) {
    console.error('创建活动失败:', error);
  }
};

onMounted(() => {
  searchActivities();
});
</script>

<style scoped>
.activities {
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
}

.activity-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.activity-card:hover {
  transform: translateY(-5px);
}

.activity-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.activity-info {
  padding: 15px;
}

.meta-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.stats {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 14px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
