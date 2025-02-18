<template>
  <div class="ai-feedback">
    <el-card class="feedback-card">
      <template #header>
        <div class="card-header">
          <span>AI智能评估反馈</span>
          <el-button-group>
            <el-button 
              size="small" 
              @click="refreshAnalysis"
              :loading="isRefreshing"
            >
              刷新分析
            </el-button>
            <el-button 
              size="small" 
              @click="exportReport"
            >
              导出报告
            </el-button>
          </el-button-group>
        </div>
      </template>

      <!-- 评估维度 -->
      <section class="analysis-dimensions">
        <el-row :gutter="20">
          <el-col :span="8" v-for="dimension in dimensions" :key="dimension.key">
            <div class="dimension-card" :class="dimension.status">
              <div class="dimension-header">
                <h3>{{ dimension.name }}</h3>
                <el-tag size="small" :type="dimension.status">
                  {{ dimension.score }}分
                </el-tag>
              </div>
              <el-progress 
                :percentage="dimension.progress" 
                :color="dimension.color"
              />
              <div class="dimension-details">
                <p v-for="point in dimension.points" 
                   :key="point.id"
                   :class="point.type">
                  {{ point.content }}
                </p>
              </div>
            </div>
          </el-col>
        </el-row>
      </section>

      <!-- AI建议 -->
      <section class="ai-recommendations">
        <h3>AI改进建议</h3>
        <div class="recommendations-list">
          <div v-for="rec in recommendations" 
               :key="rec.id"
               class="recommendation-item">
            <div class="rec-header">
              <el-tag size="small" :type="rec.priority">
                {{ rec.priorityText }}
              </el-tag>
              <h4>{{ rec.title }}</h4>
            </div>
            <p>{{ rec.description }}</p>
            <div class="action-steps">
              <div v-for="step in rec.steps" 
                   :key="step.id"
                   class="step-item">
                <span class="step-number">{{ step.number }}</span>
                <span class="step-content">{{ step.content }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 学习轨迹 -->
      <section class="learning-trajectory">
        <h3>学习轨迹分析</h3>
        <div class="trajectory-chart">
          <trajectory-chart 
            :data="trajectoryData"
            :milestones="learningMilestones"
          />
        </div>
        <div class="milestone-list">
          <el-timeline>
            <el-timeline-item
              v-for="milestone in learningMilestones"
              :key="milestone.id"
              :timestamp="milestone.time"
              :type="milestone.type"
            >
              <h4>{{ milestone.title }}</h4>
              <p>{{ milestone.description }}</p>
            </el-timeline-item>
          </el-timeline>
        </div>
      </section>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAssessmentStore } from '@/stores/assessment';
import TrajectoryChart from './charts/TrajectoryChart.vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  userId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['student', 'class', 'grade'].includes(value)
  }
});

// ... 其他代码实现 ...
</script>

<style scoped>
.ai-feedback {
  padding: 20px;
}

.analysis-dimensions {
  margin-bottom: 30px;
}

.dimension-card {
  padding: 16px;
  border-radius: 8px;
  background: #f8f9fa;
  margin-bottom: 20px;
}

.dimension-card.warning {
  background: #fff8e6;
}

.dimension-card.danger {
  background: #fff3f3;
}

.recommendations-list {
  margin: 20px 0;
}

.recommendation-item {
  padding: 16px;
  border-left: 4px solid #409eff;
  background: #f8f9fa;
  margin-bottom: 16px;
  border-radius: 0 8px 8px 0;
}

.action-steps {
  margin-top: 12px;
  padding-left: 20px;
}

.step-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #409eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.trajectory-chart {
  height: 400px;
  margin: 20px 0;
}
</style>
