<template>
  <div class="student-dashboard">
    <el-row :gutter="20">
      <el-col :span="18">
        <div class="main-content">
          <el-card class="learning-status">
            <div class="status-header">
              <h2>学习进度</h2>
              <el-progress
                :percentage="learningProgress.percentage"
                :status="learningProgress.status"
              />
            </div>
            <div class="status-details">
              <div v-for="item in learningDetails" 
                   :key="item.subject" 
                   class="subject-progress">
                <span>{{ item.subject }}</span>
                <el-progress 
                  :percentage="item.progress"
                  :color="item.color"
                  :stroke-width="10"
                />
              </div>
            </div>
          </el-card>

          <el-card class="today-tasks">
            <template #header>
              <div class="card-header">
                <span>今日任务</span>
                <el-button type="text">查看全部</el-button>
              </div>
            </template>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="作业" name="homework">
                <task-list :tasks="homeworkTasks" @complete="completeTask"/>
              </el-tab-pane>
              <el-tab-pane label="学习" name="study">
                <task-list :tasks="studyTasks" @complete="completeTask"/>
              </el-tab-pane>
              <el-tab-pane label="挑战" name="challenge">
                <task-list :tasks="challengeTasks" @complete="completeTask"/>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="side-content">
          <el-card class="ai-assistant">
            <template #header>
              <div class="card-header">
                <span>AI学习助手</span>
              </div>
            </template>
            <div class="assistant-chat">
              <div class="chat-messages" ref="chatArea">
                <div v-for="msg in aiMessages" 
                     :key="msg.id"
                     :class="['message', msg.type]">
                  {{ msg.content }}
                </div>
              </div>
              <div class="chat-input">
                <el-input
                  v-model="userQuestion"
                  placeholder="请输入问题..."
                  @keyup.enter="askAI"
                >
                  <template #append>
                    <el-button @click="askAI">提问</el-button>
                  </template>
                </el-input>
              </div>
            </div>
          </el-card>

          <el-card class="achievements">
            <template #header>
              <div class="card-header">
                <span>成就徽章</span>
              </div>
            </template>
            <div class="badge-grid">
              <div v-for="badge in badges" 
                   :key="badge.id" 
                   class="badge-item">
                <el-tooltip :content="badge.description" placement="top">
                  <img :src="badge.icon" :alt="badge.name">
                </el-tooltip>
                <span>{{ badge.name }}</span>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStudentStore } from '@/stores/student';
import { useAIStore } from '@/stores/ai';
import TaskList from '@/components/student/TaskList.vue';

const studentStore = useStudentStore();
const aiStore = useAIStore();

// 状态和数据
const activeTab = ref('homework');
const userQuestion = ref('');
const aiMessages = ref([]);

// 获取数据
onMounted(async () => {
  await studentStore.fetchLearningProgress();
  await studentStore.fetchTodayTasks();
  await studentStore.fetchAchievements();
});

// AI助手功能
const askAI = async () => {
  if (!userQuestion.value.trim()) return;

  const question = userQuestion.value;
  userQuestion.value = '';

  aiMessages.value.push({
    id: Date.now(),
    type: 'user',
    content: question
  });

  // 获取AI回答
  const answer = await aiStore.getStudyAssistance(question);
  
  aiMessages.value.push({
    id: Date.now() + 1,
    type: 'ai',
    content: answer
  });
};

// 完成任务处理
const completeTask = async (taskId) => {
  await studentStore.completeTask(taskId);
};
</script>

<style scoped>
.student-dashboard {
  padding: 20px;
}

.learning-status {
  margin-bottom: 20px;
}

.status-details {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.assistant-chat {
  height: 400px;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.badge-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 12px;
}

.badge-item {
  text-align: center;
  cursor: pointer;
}

.badge-item img {
  width: 48px;
  height: 48px;
}
</style>
