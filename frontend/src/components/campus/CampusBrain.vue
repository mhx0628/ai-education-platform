<template>
  <div class="campus-brain">
    <!-- 实时监控大屏 -->
    <div class="monitoring-dashboard">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="status-panel safety">
            <h3>校园安全</h3>
            <div class="status-content">
              <div class="metric-item" v-for="item in safetyMetrics" :key="item.id">
                <span class="label">{{ item.label }}</span>
                <span :class="['value', item.status]">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </el-col>

        <el-col :span="12">
          <div class="central-monitor">
            <div class="campus-map">
              <!-- 3D校园地图 -->
              <three-campus-map
                :buildings="campusData.buildings"
                :events="realTimeEvents"
                @select-building="handleBuildingSelect"
              />
            </div>
            <div class="event-ticker">
              <marquee>
                <span v-for="event in latestEvents" 
                       :key="event.id"
                       :class="event.type">
                  {{ event.message }}
                </span>
              </marquee>
            </div>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="ai-analysis">
            <h3>AI分析洞察</h3>
            <div class="insight-list">
              <div v-for="insight in aiInsights" 
                   :key="insight.id"
                   class="insight-item">
                <el-icon :class="insight.type"><component :is="insight.icon" /></el-icon>
                <span>{{ insight.content }}</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- AI决策支持 -->
    <div class="decision-support">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>AI决策建议</span>
            <el-button-group>
              <el-button size="small" @click="generateReport">生成报告</el-button>
              <el-button size="small" @click="showTrends">趋势分析</el-button>
            </el-button-group>
          </div>
        </template>
        <div class="suggestion-list">
          <div v-for="suggestion in aiSuggestions" 
               :key="suggestion.id"
               class="suggestion-item">
            <h4>{{ suggestion.title }}</h4>
            <p>{{ suggestion.description }}</p>
            <div class="action-points">
              <el-tag v-for="point in suggestion.actionPoints"
                     :key="point"
                     size="small">
                {{ point }}
              </el-tag>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 智能预警面板 -->
    <div class="alert-panel" v-show="hasActiveAlerts">
      <div class="alert-header">
        <span class="title">实时预警</span>
        <span class="count">{{ activeAlerts.length }}</span>
      </div>
      <div class="alert-list">
        <transition-group name="alert">
          <div v-for="alert in activeAlerts" 
               :key="alert.id"
               :class="['alert-item', alert.severity]">
            <div class="alert-content">
              <h4>{{ alert.title }}</h4>
              <p>{{ alert.description }}</p>
            </div>
            <div class="alert-actions">
              <el-button size="small" @click="handleAlert(alert)">处理</el-button>
              <el-button size="small" @click="dismissAlert(alert)">忽略</el-button>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCampusStore } from '@/stores/campus';
import { useAIStore } from '@/stores/ai';
import ThreeCampusMap from './ThreeCampusMap.vue';

// ... 其他代码实现 ...
</script>

<style scoped>
.campus-brain {
  height: 100vh;
  padding: 20px;
  background: #1a1a1a;
  color: #fff;
}

.monitoring-dashboard {
  margin-bottom: 20px;
}

.status-panel {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
}

.central-monitor {
  height: 600px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
}

.campus-map {
  height: 90%;
}

.event-ticker {
  height: 10%;
  background: rgba(0, 0, 0, 0.5);
  line-height: 40px;
}

.ai-analysis {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
}

.alert-panel {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 300px;
  max-height: 400px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  padding: 16px;
}

// ... 其他样式 ...
</style>
