<template>
  <div class="home">
    <el-row :gutter="20">
      <!-- 轮播图区域 -->
      <el-col :span="24">
        <el-carousel height="400px">
          <el-carousel-item v-for="item in carouselItems" :key="item.id">
            <img :src="item.image" :alt="item.title">
            <div class="carousel-caption">
              <h2>{{ item.title }}</h2>
              <p>{{ item.description }}</p>
            </div>
          </el-carousel-item>
        </el-carousel>
      </el-col>

      <!-- 特色功能区 -->
      <el-col :span="24">
        <div class="feature-section">
          <h2 class="section-title">AI教育特色</h2>
          <el-row :gutter="20">
            <el-col :span="8" v-for="feature in features" :key="feature.id">
              <el-card class="feature-card">
                <div class="feature-icon">
                  <el-icon><component :is="feature.icon" /></el-icon>
                </div>
                <h3>{{ feature.title }}</h3>
                <p>{{ feature.description }}</p>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-col>

      <!-- 最新活动 -->
      <el-col :span="24">
        <div class="activities-section">
          <h2 class="section-title">最新活动</h2>
          <el-row :gutter="20">
            <el-col :span="6" v-for="activity in activities" :key="activity.id">
              <el-card class="activity-card" @click="viewActivity(activity)">
                <img :src="activity.image" :alt="activity.title">
                <div class="activity-info">
                  <h4>{{ activity.title }}</h4>
                  <p>{{ activity.description }}</p>
                  <div class="activity-meta">
                    <span>{{ activity.date }}</span>
                    <el-tag size="small">{{ activity.type }}</el-tag>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 轮播图数据
const carouselItems = ref([
  {
    id: 1,
    title: 'AI教育创新',
    description: '使用最新AI技术，打造智能学习体验',
    image: '/images/carousel/ai-education.jpg'
  },
  {
    id: 2,
    title: '个性化学习',
    description: '根据学生特点，定制专属学习计划',
    image: '/images/carousel/personalized.jpg'
  },
  {
    id: 3,
    title: '智慧校园',
    description: '全方位数字化校园解决方案',
    image: '/images/carousel/smart-campus.jpg'
  }
]);

// 特色功能
const features = ref([
  {
    id: 1,
    icon: 'School',
    title: 'AI助教',
    description: '智能辅导，随时答疑解惑'
  },
  {
    id: 2,
    icon: 'DataAnalysis',
    title: '学习分析',
    description: '深度分析学习数据，优化学习路径'
  },
  {
    id: 3,
    icon: 'Connection',
    title: '智能协作',
    description: '促进师生互动，提升学习效果'
  }
]);

// 活动数据
const activities = ref([
  {
    id: 1,
    title: 'AI编程大赛',
    description: '激发创造力，培养编程思维',
    image: '/images/activities/coding.jpg',
    date: '2024-03-20',
    type: '竞赛'
  },
  // ... 其他活动数据
]);

// 查看活动详情
const viewActivity = (activity) => {
  router.push({
    name: 'ActivityDetail',
    params: { id: activity.id }
  });
};
</script>

<style scoped>
.home {
  padding: 20px;
}

.carousel-caption {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.section-title {
  text-align: center;
  margin: 40px 0;
  font-size: 28px;
  color: #333;
}

.feature-card {
  text-align: center;
  padding: 30px;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 48px;
  color: #409EFF;
  margin-bottom: 20px;
}

.activity-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.activity-card:hover {
  transform: translateY(-5px);
}

.activity-info {
  padding: 15px;
}

.activity-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
</style>
