<template>
  <div class="learning-center">
    <!-- 学习概览 -->
    <el-row :gutter="20" class="dashboard">
      <el-col :span="6" v-for="stat in learningStats" :key="stat.id">
        <el-card shadow="hover" class="stat-card">
          <el-statistic :value="stat.value" :title="stat.title">
            <template #suffix>{{ stat.unit }}</template>
          </el-statistic>
          <el-progress 
            :percentage="stat.percentage"
            :color="stat.color"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 学习内容区 -->
    <el-row :gutter="20" class="content-area">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>当前学习</span>
              <el-button type="text" @click="refreshContent">刷新</el-button>
            </div>
          </template>
          
          <!-- 课程进度 -->
          <div class="course-progress">
            <div v-for="course in currentCourses" :key="course.id" class="course-item">
              <div class="course-info">
                <h3>{{ course.title }}</h3>
                <p>{{ course.description }}</p>
              </div>
              <div class="progress-info">
                <el-progress 
                  :percentage="course.progress"
                  :status="course.progress === 100 ? 'success' : ''"
                />
                <el-button 
                  type="primary" 
                  size="small"
                  @click="continueLearning(course)"
                >
                  继续学习
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- AI助手 -->
      <el-col :span="8">
        <el-card class="ai-assistant">
          <template #header>
            <div class="card-header">
              <span>AI学习助手</span>
              <el-switch 
                v-model="aiAssistantEnabled"
                active-text="开启"
                inactive-text="关闭"
              />
            </div>
          </template>
          
          <div class="chat-window">
            <div class="messages" ref="messageBox">
              <div 
                v-for="msg in messages" 
                :key="msg.id"
                :class="['message', msg.type]"
              >
                {{ msg.content }}
              </div>
            </div>
            
            <div class="input-area">
              <el-input
                v-model="userInput"
                placeholder="请输入问题..."
                :disabled="!aiAssistantEnabled"
                @keyup.enter="sendMessage"
              >
                <template #append>
                  <el-button @click="sendMessage">发送</el-button>
                </template>
              </el-input>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 推荐学习 -->
    <el-card class="recommendations">
      <template #header>
        <div class="card-header">
          <span>个性化推荐</span>
          <el-radio-group v-model="recommendationType" size="small">
            <el-radio-button label="course">课程</el-radio-button>
            <el-radio-button label="resource">资源</el-radio-button>
            <el-radio-button label="practice">练习</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      
      <el-row :gutter="20">
        <el-col 
          :span="6" 
          v-for="item in recommendedItems" 
          :key="item.id"
        >
          <el-card 
            shadow="hover" 
            class="recommendation-card"
            @click="viewRecommendation(item)"
          >
            <img :src="item.cover" :alt="item.title">
            <h4>{{ item.title }}</h4>
            <p>{{ item.description }}</p>
            <div class="item-meta">
              <span>
                <el-icon><User /></el-icon>
                {{ item.students }}人学习
              </span>
              <span>
                <el-icon><Star /></el-icon>
                {{ item.rating }}
              </span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-tabs v-model="activeTab" class="learning-tabs">
      <el-tab-pane label="学科闯关" name="challenge">
        <challenge-dashboard :grade="currentGrade" />
      </el-tab-pane>
      <el-tab-pane label="兴趣课程" name="interest">
        <interest-courses />
      </el-tab-pane>
      <el-tab-pane label="AI专项" name="ai">
        <ai-courses />
      </el-tab-pane>
    </el-tabs>
    
    <div class="learning-status">
      <el-card class="status-card">
        <template #header>
          <div class="card-header">
            <span>学习进度</span>
            <el-button type="text">查看详情</el-button>
          </div>
        </template>
        <progress-chart :data="progressData" />
      </el-card>
      
      <el-card class="study-plan">
        <template #header>
          <div class="card-header">
            <span>AI学习建议</span>
            <el-tag size="small" type="success">每日更新</el-tag>
          </div>
        </template>
        <study-recommendations :recommendations="aiRecommendations" />
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { User, Star } from '@element-plus/icons-vue';
import ChallengeDashboard from './components/ChallengeDashboard.vue'
import InterestCourses from './components/InterestCourses.vue'
import AiCourses from './components/AiCourses.vue'
import ProgressChart from './components/ProgressChart.vue'
import StudyRecommendations from './components/StudyRecommendations.vue'

const activeTab = ref('challenge')
const currentGrade = ref('grade7') // 默认初一

const progressData = ref({
  // 模拟数据
  subjects: {
    math: 75,
    chinese: 85,
    english: 90
  },
  aiCourses: 60,
  interests: 80
})

const aiRecommendations = ref([
  {
    type: 'weakness',
    subject: '数学',
    content: '建议加强函数概念训练',
    resources: ['函数入门视频', '典型题目讲解']
  },
  {
    type: 'strength',
    subject: '英语',
    content: '口语表达能力突出',
    resources: ['高级口语训练', '英语演讲比赛']
  }
])

// 状态数据
const learningStats = ref([
  {
    id: 1,
    title: '学习时长',
    value: 128,
    unit: '小时',
    percentage: 85,
    color: '#409EFF'
  },
  {
    id: 2,
    title: '完成课程',
    value: 12,
    unit: '门',
    percentage: 60,
    color: '#67C23A'
  },
  {
    id: 3,
    title: '获得积分',
    value: 2360,
    unit: '分',
    percentage: 70,
    color: '#E6A23C'
  },
  {
    id: 4,
    title: '掌握知识点',
    value: 168,
    unit: '个',
    percentage: 75,
    color: '#F56C6C'
  }
]);

// ... 其他数据和方法实现 ...

</script>

<style scoped>
.learning-center {
  padding: 20px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.dashboard {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
  padding: 20px;
}

.content-area {
  margin-bottom: 20px;
}

.course-item {
  border-bottom: 1px solid #eee;
  padding: 15px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-assistant {
  height: 100%;
}

.chat-window {
  height: 400px;
  display: flex;
  flex-direction: column;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
}

.message.user {
  background: #f0f9ff;
  margin-left: 20%;
}

.message.assistant {
  background: #f5f7fa;
  margin-right: 20%;
}

.recommendations {
  margin-top: 20px;
}

.recommendation-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.recommendation-card:hover {
  transform: translateY(-5px);
}

.item-meta {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 14px;
}

.learning-tabs {
  min-height: 500px;
}

.learning-status {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.status-card, .study-plan {
  height: fit-content;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
