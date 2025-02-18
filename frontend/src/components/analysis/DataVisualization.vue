<template>
  <div class="data-visualization">
    <div class="chart-controls">
      <el-radio-group v-model="currentView" size="small">
        <el-radio-button label="overview">总览</el-radio-button>
        <el-radio-button label="trending">趋势</el-radio-button>
        <el-radio-button label="comparison">对比</el-radio-button>
      </el-radio-group>

      <el-select v-model="timeRange" size="small" placeholder="时间范围">
        <el-option label="本周" value="week" />
        <el-option label="本月" value="month" />
        <el-option label="本学期" value="semester" />
      </el-select>
    </div>

    <div class="charts-container">
      <!-- 总览图表 -->
      <div v-show="currentView === 'overview'" class="chart-grid">
        <div class="chart-item">
          <h4>学习活跃度</h4>
          <line-chart :data="activityData" />
        </div>
        <div class="chart-item">
          <h4>知识掌握度</h4>
          <radar-chart :data="knowledgeData" />
        </div>
        <div class="chart-item">
          <h4>能力成长图谱</h4>
          <tree-chart :data="competencyData" />
        </div>
      </div>

      <!-- 趋势分析 -->
      <div v-show="currentView === 'trending'" class="trend-analysis">
        <trend-chart 
          :data="trendData"
          :predictions="aiPredictions"
        />
      </div>

      <!-- 对比分析 -->
      <div v-show="currentView === 'comparison'" class="comparison-analysis">
        <el-tabs v-model="comparisonType">
          <el-tab-pane label="班级对比" name="class">
            <comparison-chart 
              type="class"
              :data="classComparisonData"
            />
          </el-tab-pane>
          <el-tab-pane label="年级对比" name="grade">
            <comparison-chart 
              type="grade"
              :data="gradeComparisonData"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- AI分析见解 -->
    <div class="ai-insights">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>AI分析洞察</span>
            <el-button type="text" @click="refreshInsights">
              刷新分析
            </el-button>
          </div>
        </template>
        <div class="insights-content">
          <div v-for="insight in aiInsights" 
               :key="insight.id" 
               class="insight-item">
            <el-icon :class="insight.type">
              <component :is="getInsightIcon(insight.type)" />
            </el-icon>
            <span>{{ insight.content }}</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAnalyticsStore } from '@/stores/analytics';
import LineChart from './charts/LineChart.vue';
import RadarChart from './charts/RadarChart.vue';
import TreeChart from './charts/TreeChart.vue';
import TrendChart from './charts/TrendChart.vue';
import ComparisonChart from './charts/ComparisonChart.vue';

const props = defineProps({
  userId: String,
  type: {
    type: String,
    validator: (value) => ['student', 'class', 'school', 'district'].includes(value)
  }
});

const analyticsStore = useAnalyticsStore();
const currentView = ref('overview');
const timeRange = ref('month');
const comparisonType = ref('class');

// 获取数据
const loadData = async () => {
  try {
    const data = await analyticsStore.getAnalyticsData({
      userId: props.userId,
      type: props.type,
      timeRange: timeRange.value
    });

    updateChartData(data);
    generateAIInsights(data);
  } catch (error) {
    console.error('加载分析数据失败:', error);
  }
};

// 监听时间范围变化
watch(timeRange, loadData);

onMounted(loadData);

// 实现其他方法...
</script>

<style scoped>
.data-visualization {
  padding: 20px;
}

.chart-controls {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.charts-container {
  min-height: 400px;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.chart-item {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.insights-content {
  padding: 16px;
}

.insight-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px;
  border-radius: 4px;
  background: #f8f9fa;
}

.insight-item .el-icon {
  margin-right: 8px;
  font-size: 18px;
}
</style>
