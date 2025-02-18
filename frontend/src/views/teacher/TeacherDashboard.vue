<template>
  <div class="teacher-dashboard">
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="main-content">
          <el-card class="quick-actions">
            <template #header>
              <div class="card-header">
                <span>快捷功能</span>
              </div>
            </template>
            <div class="action-grid">
              <div v-for="action in quickActions" :key="action.id" 
                   class="action-item" @click="handleAction(action)">
                <el-icon><component :is="action.icon"/></el-icon>
                <span>{{ action.name }}</span>
              </div>
            </div>
          </el-card>

          <el-card class="ai-tools">
            <template #header>
              <div class="card-header">
                <span>AI助手</span>
              </div>
            </template>
            <div class="ai-chat">
              <div class="chat-messages" ref="chatBox">
                <div v-for="msg in chatMessages" :key="msg.id"
                     :class="['message', msg.role]">
                  {{ msg.content }}
                </div>
              </div>
              <div class="chat-input">
                <el-input v-model="chatInput" placeholder="请输入问题..."
                         @keyup.enter="sendMessage">
                  <template #append>
                    <el-button @click="sendMessage">发送</el-button>
                  </template>
                </el-input>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>

      <el-col :span="8">
        <div class="side-content">
          <el-card class="statistics">
            <template #header>
              <div class="card-header">
                <span>教学统计</span>
              </div>
            </template>
            <div class="stat-list">
              <div v-for="stat in statistics" :key="stat.key" class="stat-item">
                <div class="stat-label">{{ stat.label }}</div>
                <div class="stat-value">{{ stat.value }}</div>
              </div>
            </div>
          </el-card>

          <el-card class="recent-activities">
            <template #header>
              <div class="card-header">
                <span>最近活动</span>
              </div>
            </template>
            <el-timeline>
              <el-timeline-item v-for="activity in recentActivities" 
                              :key="activity.id"
                              :timestamp="activity.time">
                {{ activity.content }}
              </el-timeline-item>
            </el-timeline>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTeacherStore } from '@/stores/teacher';
import { useAIStore } from '@/stores/ai';

const teacherStore = useTeacherStore();
const aiStore = useAIStore();

// 快捷功能
const quickActions = [
  { id: 1, name: 'AI教案创作', icon: 'Document' },
  { id: 2, name: 'AI课件制作', icon: 'Present' },
  { id: 3, name: '作业批改', icon: 'Check' },
  { id: 4, name: '教学分析', icon: 'DataAnalysis' }
];

// AI聊天相关
const chatInput = ref('');
const chatMessages = ref([]);
const chatBox = ref(null);

const sendMessage = async () => {
  if (!chatInput.value.trim()) return;
  
  const userMessage = {
    id: Date.now(),
    role: 'user',
    content: chatInput.value
  };
  
  chatMessages.value.push(userMessage);
  chatInput.value = '';

  // 获取AI响应
  const response = await aiStore.getTeachingAssistance(userMessage.content);
  
  chatMessages.value.push({
    id: Date.now() + 1,
    role: 'assistant',
    content: response
  });

  // 滚动到底部
  setTimeout(() => {
    chatBox.value.scrollTop = chatBox.value.scrollHeight;
  }, 100);
};

// 教学统计数据
const statistics = ref([]);
const recentActivities = ref([]);

onMounted(async () => {
  // 获取教学统计和活动数据
  statistics.value = await teacherStore.getTeachingStats();
  recentActivities.value = await teacherStore.getRecentActivities();
});
</script>

<style scoped>
.teacher-dashboard {
  padding: 20px;
}

.quick-actions {
  margin-bottom: 20px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-item:hover {
  background-color: #f5f7fa;
  transform: translateY(-2px);
}

.ai-chat {
  height: 400px;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.message {
  margin-bottom: 12px;
  padding: 8px 12px;
  border-radius: 4px;
}

.message.user {
  background-color: #e6f7ff;
  margin-left: 20%;
}

.message.assistant {
  background-color: #f5f5f5;
  margin-right: 20%;
}

.stat-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 12px;
}
</style>
