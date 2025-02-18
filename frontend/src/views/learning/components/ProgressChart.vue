<template>
  <div class="progress-charts">
    <div class="chart-section">
      <h4>学科进度</h4>
      <el-progress
        v-for="(value, subject) in data.subjects"
        :key="subject"
        :percentage="value"
        :color="getProgressColor(value)"
        :format="format"
        :stroke-width="15"
        class="subject-progress"
      >
        <template #prefix>{{ getSubjectName(subject) }}</template>
      </el-progress>
    </div>

    <div class="chart-section">
      <h4>学习概览</h4>
      <div class="radar-chart" ref="radarChart"></div>
    </div>

    <div class="chart-section">
      <h4>近期活跃度</h4>
      <div class="activity-chart" ref="activityChart"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const radarChart = ref(null)
const activityChart = ref(null)

const getSubjectName = (subject) => {
  const names = {
    math: '数学',
    chinese: '语文',
    english: '英语'
  }
  return names[subject] || subject
}

const getProgressColor = (value) => {
  if (value >= 90) return '#67C23A'
  if (value >= 70) return '#409EFF'
  if (value >= 50) return '#E6A23C'
  return '#F56C6C'
}

const format = (percentage) => `${percentage}%`

const initRadarChart = () => {
  const chart = echarts.init(radarChart.value)
  const option = {
    radar: {
      indicator: [
        { name: '知识掌握', max: 100 },
        { name: '学习效率', max: 100 },
        { name: '专注度', max: 100 },
        { name: '作业完成', max: 100 },
        { name: '课堂参与', max: 100 }
      ]
    },
    series: [{
      type: 'radar',
      data: [{
        value: [85, 70, 90, 80, 75],
        name: '学习能力评估',
        areaStyle: {
          color: 'rgba(64,158,255,0.2)'
        },
        lineStyle: {
          color: '#409EFF'
        }
      }]
    }]
  }
  chart.setOption(option)
}

const initActivityChart = () => {
  const chart = echarts.init(activityChart.value)
  const option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
      color: '#409EFF'
    }]
  }
  chart.setOption(option)
}

onMounted(() => {
  initRadarChart()
  initActivityChart()
})

// 监听窗口大小变化，重绘图表
window.addEventListener('resize', () => {
  const radarChartInstance = echarts.getInstanceByDom(radarChart.value)
  const activityChartInstance = echarts.getInstanceByDom(activityChart.value)
  radarChartInstance?.resize()
  activityChartInstance?.resize()
})
</script>

<style scoped>
.progress-charts {
  padding: 20px;
}

.chart-section {
  margin-bottom: 30px;
}

.chart-section h4 {
  margin-bottom: 15px;
  color: #606266;
}

.subject-progress {
  margin-bottom: 15px;
}

.radar-chart, .activity-chart {
  height: 300px;
  width: 100%;
}
</style>
