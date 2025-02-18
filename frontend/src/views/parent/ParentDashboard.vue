<template>
  <div class="parent-dashboard">
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="main-content">
          <!-- 学生进度概览卡片 -->
          <el-card class="progress-overview">
            <div class="student-select">
              <el-select v-model="currentStudent" placeholder="选择孩子">
                <el-option
                  v-for="child in children"
                  :key="child.id"
                  :label="child.name"
                  :value="child.id"
                />
              </el-select>
            </div>
            <div class="progress-charts">
              <div class="chart-item">
                <h3>学习成绩</h3>
                <line-chart :data="academicData" />
              </div>
              <div class="chart-item">
                <h3>能力评估</h3>
                <radar-chart :data="competencyData" />
              </div>
            </div>
          </el-card>

          <!-- 每日报告卡片 -->
          <el-card class="daily-report">
            <template #header>
              <div class="card-header">
                <span>每日学习报告</span>
                <el-date-picker
                  v-model="selectedDate"
                  type="date"
                  placeholder="选择日期"
                />
              </div>
            </template>
            <div class="report-content">
              <div v-for="item in dailyReport" :key="item.type" 
                   class="report-item">
                <h4>{{ item.title }}</h4>
                <p>{{ item.content }}</p>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>

      <el-col :span="8">
        <div class="side-content">
          <!-- AI教育助手 -->
          <el-card class="ai-advisor">
            <template #header>
              <div class="card-header">
                <span>AI教育顾问</span>
              </div>
            </template>
            <div class="chat-container">
              <div class="chat-messages" ref="chatBox">
                <div v-for="msg in chatMessages" :key="msg.id"
                     :class="['message', msg.role]">
                  {{ msg.content }}
                </div>
              </div>
              <div class="chat-input">
                <el-input
                  v-model="question"
                  placeholder="询问孩子的学习情况..."
                  @keyup.enter="askAIAdvisor"
                >
                  <template #append>
                    <el-button @click="askAIAdvisor">咨询</el-button>
                  </template>
                </el-input>
              </div>
            </div>
          </el-card>

          <!-- 近期活动 -->
          <el-card class="upcoming-events">
            <template #header>
              <div class="card-header">
                <span>近期活动</span>
              </div>
            </template>
            <el-timeline>
              <el-timeline-item
                v-for="event in upcomingEvents"
                :key="event.id"
                :timestamp="event.time"
                :type="event.type"
              >
                {{ event.title }}
                <p class="event-description">{{ event.description }}</p>
              </el-timeline-item>
            </el-timeline>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useParentStore } from '@/stores/parent';
import { useAIStore } from '@/stores/ai';
import LineChart from '@/components/charts/LineChart.vue';
import RadarChart from '@/components/charts/RadarChart.vue';

const parentStore = useParentStore();
const aiStore = useAIStore();

// 状态管理
const currentStudent = ref('');
const selectedDate = ref(new Date());
const question = ref('');
const chatMessages = ref([]);

// 监听学生选择变化
watch(currentStudent, async (newVal) => {
  if (newVal) {
    await loadStudentData(newVal);
  }
});

// 加载学生数据
const loadStudentData = async (studentId) => {
  const data = await parentStore.getStudentData(studentId);
  academicData.value = data.academic;
  competencyData.value = data.competency;
  dailyReport.value = data.dailyReport;
};

// AI顾问功能
const askAIAdvisor = async () => {
  if (!question.value.trim()) return;

  chatMessages.value.push({
    id: Date.now(),
    role: 'user',
    content: question.value
  });

  const response = await aiStore.getParentAdvice({
    studentId: currentStudent.value,
    question: question.value
  });

  chatMessages.value.push({
    id: Date.now() + 1,
    role: 'assistant',
    content: response
  });

  question.value = '';
};

onMounted(async () => {
  const children = await parentStore.getChildren();
  if (children.length > 0) {
    currentStudent.value = children[0].id;
  }
});
</script>

<style scoped>
.parent-dashboard {
  padding: 20px;
}

.progress-overview {
  margin-bottom: 20px;
}

.progress-charts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.chat-container {
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

.event-description {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}
</style>
