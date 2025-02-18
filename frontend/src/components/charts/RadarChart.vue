<template>
  <div class="radar-chart" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const chartContainer = ref(null);
let chart = null;

const initChart = () => {
  if (!chartContainer.value) return;

  chart = echarts.init(chartContainer.value);
  updateChart();
};

const updateChart = () => {
  if (!chart) return;

  const option = {
    radar: {
      indicator: [
        { name: '学习能力', max: 100 },
        { name: '创新思维', max: 100 },
        { name: '团队协作', max: 100 },
        { name: '问题解决', max: 100 },
        { name: '自主学习', max: 100 }
      ]
    },
    series: [{
      type: 'radar',
      data: [{
        value: [
          props.data.learning || 0,
          props.data.innovation || 0,
          props.data.teamwork || 0,
          props.data.problemSolving || 0,
          props.data.selfStudy || 0
        ],
        name: '能力评估'
      }]
    }]
  };

  chart.setOption(option);
};

watch(() => props.data, updateChart, { deep: true });

onMounted(() => {
  initChart();
  window.addEventListener('resize', () => chart?.resize());
});

onUnmounted(() => {
  chart?.dispose();
  window.removeEventListener('resize', () => chart?.resize());
});
</script>

<style scoped>
.radar-chart {
  width: 100%;
  height: 300px;
}
</style>
