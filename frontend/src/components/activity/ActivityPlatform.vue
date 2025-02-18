<template>
  <div class="activity-platform">
    <!-- 活动导航 -->
    <div class="activity-nav">
      <el-menu mode="horizontal" :router="true">
        <el-menu-item index="/activities/ongoing">进行中</el-menu-item>
        <el-menu-item index="/activities/upcoming">即将开始</el-menu-item>
        <el-menu-item index="/activities/ended">已结束</el-menu-item>
        <el-menu-item index="/activities/mine">我的活动</el-menu-item>
      </el-menu>
      
      <el-button 
        type="primary" 
        @click="showCreateDialog"
        v-if="canCreateActivity"
      >
        创建活动
      </el-button>
    </div>

    <!-- 活动筛选器 -->
    <div class="activity-filters">
      <el-select v-model="filters.level" placeholder="活动级别">
        <el-option label="班级活动" value="class" />
        <el-option label="年级活动" value="grade" />
        <el-option label="学校活动" value="school" />
        <el-option label="区域活动" value="district" />
      </el-select>

      <el-select v-model="filters.category" placeholder="作品类型">
        <el-option label="作文创作" value="essay" />
        <el-option label="视频创作" value="video" />
        <el-option label="编程作品" value="code" />
        <el-option label="艺术创作" value="art" />
      </el-select>

      <el-date-picker
        v-model="filters.dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
    </div>

    <!-- 活动列表 -->
    <div class="activity-list">
      <el-row :gutter="20">
        <el-col 
          v-for="activity in activities" 
          :key="activity.id" 
          :span="8"
        >
          <activity-card 
            :activity="activity"
            @click="viewActivity(activity)"
          />
        </el-col>
      </el-row>

      <div class="pagination">
        <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :total="total"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 创建活动对话框 -->
    <el-dialog
      title="创建新活动"
      v-model="createDialogVisible"
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
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ActivityCard from './ActivityCard.vue';
import ActivityForm from './ActivityForm.vue';

const store = useStore();
const router = useRouter();

// 状态管理
const filters = ref({
  level: '',
  category: '',
  dateRange: null
});

const page = ref(1);
const pageSize = ref(12);
const total = ref(0);
const activities = ref([]);
const createDialogVisible = ref(false);

// 计算属性
const canCreateActivity = computed(() => {
  const userRole = store.state.user.role;
  return ['teacher', 'admin'].includes(userRole);
});

// 方法
const loadActivities = async () => {
  try {
    const response = await store.dispatch('activities/getActivities', {
      page: page.value,
      pageSize: pageSize.value,
      filters: filters.value
    });
    
    activities.value = response.data;
    total.value = response.total;
  } catch (error) {
    console.error('加载活动失败:', error);
  }
};

const handlePageChange = (newPage) => {
  page.value = newPage;
  loadActivities();
};

const viewActivity = (activity) => {
  router.push(`/activities/${activity.id}`);
};

const showCreateDialog = () => {
  createDialogVisible.value = true;
};

const handleCreateActivity = async (activityData) => {
  try {
    await store.dispatch('activities/createActivity', activityData);
    createDialogVisible.value = false;
    loadActivities();
  } catch (error) {
    console.error('创建活动失败:', error);
  }
};

// 生命周期钩子
onMounted(() => {
  loadActivities();
});
</script>

<style scoped>
.activity-platform {
  padding: 20px;
}

.activity-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.activity-filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.activity-list {
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
