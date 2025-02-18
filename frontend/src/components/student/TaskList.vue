<template>
  <div class="task-list">
    <el-card class="task-card">
      <template #header>
        <div class="card-header">
          <span>今日任务</span>
          <el-button type="text" @click="refreshTasks">刷新</el-button>
        </div>
      </template>
      
      <el-table :data="tasks" style="width: 100%">
        <el-table-column prop="title" label="任务名称" />
        <el-table-column prop="deadline" label="截止时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              size="small"
              @click="handleTask(row)"
            >
              开始
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const tasks = ref([
  {
    id: 1,
    title: '完成数学作业',
    deadline: '2024-03-20 18:00',
    status: '待完成'
  },
  {
    id: 2,
    title: 'AI编程练习',
    deadline: '2024-03-20 20:00',
    status: '进行中'
  }
]);

const getStatusType = (status) => {
  const types = {
    '待完成': 'warning',
    '进行中': 'primary',
    '已完成': 'success'
  };
  return types[status] || 'info';
};

const refreshTasks = async () => {
  // TODO: 实现刷新任务列表的逻辑
};

const handleTask = (task) => {
  // TODO: 实现处理任务的逻辑
};
</script>

<style scoped>
.task-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
