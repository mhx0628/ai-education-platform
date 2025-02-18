<template>
  <div class="data-monitoring">
    <el-card class="monitoring-header">
      <template #header>
        <div class="card-header">
          <h3>数据监控中心</h3>
          <el-button-group>
            <el-button size="small" @click="refreshData">刷新</el-button>
            <el-button size="small" @click="exportData">导出</el-button>
          </el-button-group>
        </div>
      </template>
      
      <!-- 实时监控指标 -->
      <div class="metrics-grid">
        <div v-for="metric in realTimeMetrics" 
             :key="metric.id"
             class="metric-card"
             :class="{ alert: metric.status === 'alert' }">
          <h4>{{ metric.name }}</h4>
          <div class="metric-value">{{ metric.value }}</div>
          <div class="metric-trend">
            <el-icon :class="metric.trend">
              <component :is="getTrendIcon(metric.trend)" />
            </el-icon>
            <span>{{ metric.changeRate }}%</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 监控面板 -->
    <div class="monitoring-panels">
      <!-- 系统状态 -->
      <el-card class="panel">
        <template #header>
          <div class="panel-header">
            <span>系统状态</span>
            <el-tag 
              :type="systemStatus.type"
              size="small"
            >
              {{ systemStatus.text }}
            </el-tag>
          </div>
        </template>
        <system-status-chart :data="systemStatusData" />
      </el-card>

      <!-- 访问统计 -->
      <el-card class="panel">
        <template #header>
          <div class="panel-header">
            <span>访问统计</span>
            <el-select v-model="accessTimeRange" size="small">
              <el-option label="今日" value="today" />
              <el-option label="本周" value="week" />
              <el-option label="本月" value="month" />
            </el-select>
          </div>
        </template>
        <access-stats-chart :data="accessStatsData" />
      </el-card>

      <!-- 告警列表 -->
      <el-card class="panel">
        <template #header>
          <div class="panel-header">
            <span>实时告警</span>
            <el-button 
              type="text"
              size="small"
              @click="handleAllAlerts"
            >
              全部处理
            </el-button>
          </div>
        </template>
        <div class="alerts-list">
          <div v-for="alert in alerts" 
               :key="alert.id"
               class="alert-item"
               :class="alert.severity">
            <el-icon><Warning /></el-icon>
            <div class="alert-content">
              <div class="alert-title">{{ alert.title }}</div>
              <div class="alert-desc">{{ alert.description }}</div>
            </div>
            <el-button 
              size="small"
              @click="handleAlert(alert)"
            >
              处理
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
// ... 组件实现代码 ...
</script>

<style scoped>
.data-monitoring {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.monitoring-header {
  margin-bottom: 20px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.metric-card {
  padding: 16px;
  border-radius: 8px;
  background: #f8f9fa;
}

.metric-card.alert {
  background: #fff3f3;
}

.monitoring-panels {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.alerts-list {
  max-height: 400px;
  overflow-y: auto;
}

.alert-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 4px;
  background: #f8f9fa;
}

.alert-item.critical {
  background: #fff3f3;
}

.alert-item.warning {
  background: #fff8e6;
}
</style>
