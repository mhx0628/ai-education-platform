<template>
  <div class="bureau-dashboard">
    <el-row :gutter="20">
      <el-col :span="24">
        <!-- 地区教育总览 -->
        <el-card class="overview-card">
          <template #header>
            <div class="card-header">
              <span>地区教育概况</span>
              <el-select v-model="selectedDistrict" placeholder="选择区域">
                <el-option
                  v-for="district in districts"
                  :key="district.id"
                  :label="district.name"
                  :value="district.id"
                />
              </el-select>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :span="6" v-for="stat in statsCards" :key="stat.title">
              <div class="stat-card" :class="stat.type">
                <h3>{{ stat.title }}</h3>
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-trend">
                  较上月
                  <span :class="stat.trend >= 0 ? 'up' : 'down'">
                    {{ Math.abs(stat.trend) }}%
                  </span>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="data-section">
      <el-col :span="16">
        <div class="main-content">
          <!-- AI预警系统 -->
          <el-card class="alert-card">
            <template #header>
              <div class="card-header">
                <span>实时预警</span>
                <el-tag 
                  v-if="activeAlerts.length" 
                  type="danger"
                >{{ activeAlerts.length }}个待处理</el-tag>
              </div>
            </template>
            <div class="alert-list">
              <el-timeline>
                <el-timeline-item
                  v-for="alert in activeAlerts"
                  :key="alert.id"
                  :type="alert.severity"
                  :timestamp="alert.time"
                >
                  <template #dot>
                    <el-icon :class="alert.severity"><Warning /></el-icon>
                  </template>
                  <h4>{{ alert.title }}</h4>
                  <p>{{ alert.description }}</p>
                  <el-button 
                    size="small" 
                    type="primary"
                    @click="handleAlert(alert)"
                  >处理</el-button>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-card>

          <!-- 数据分析面板 -->
          <el-card class="analytics-card">
            <template #header>
              <div class="card-header">
                <span>教育质量分析</span>
                <el-radio-group v-model="analysisType">
                  <el-radio-button label="academic">学业表现</el-radio-button>
                  <el-radio-button label="competency">核心素养</el-radio-button>
                  <el-radio-button label="resources">资源利用</el-radio-button>
                </el-radio-group>
              </div>
            </template>
            <div class="chart-container">
              <analytics-chart 
                :type="analysisType"
                :data="analyticsData"
              />
            </div>
          </el-card>
        </div>
      </el-col>

      <el-col :span="8">
        <div class="side-content">
          <!-- AI决策助手 -->
          <el-card class="ai-assistant">
            <template #header>
              <div class="card-header">
                <span>AI决策助手</span>
              </div>
            </template>
            <div class="ai-chat">
              <div class="chat-messages" ref="chatBox">
                <div v-for="msg in chatMessages" 
                     :key="msg.id"
                     :class="['message', msg.role]">
                  {{ msg.content }}
                </div>
              </div>
              <div class="chat-input">
                <el-input
                  v-model="question"
                  placeholder="输入您的决策咨询..."
                  @keyup.enter="askAIAssistant"
                >
                  <template #append>
                    <el-button @click="askAIAssistant">咨询</el-button>
                  </template>
                </el-input>
              </div>
            </div>
          </el-card>

          <!-- 学校排名 -->
          <el-card class="rankings-card">
            <template #header>
              <div class="card-header">
                <span>学校综合评估</span>
                <el-dropdown @command="handleRankingType">
                  <span class="el-dropdown-link">
                    {{ rankingTypes[currentRankingType] }}
                    <el-icon><arrow-down /></el-icon>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item 
                        v-for="(name, type) in rankingTypes"
                        :key="type"
                        :command="type"
                      >{{ name }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
            <div class="ranking-list">
              <div v-for="school in schoolRankings" 
                   :key="school.id"
                   class="ranking-item"
                   @click="showSchoolDetail(school)">
                <span class="rank">{{ school.rank }}</span>
                <span class="name">{{ school.name }}</span>
                <span class="score">{{ school.score }}</span>
                <el-progress 
                  :percentage="school.progressPercentage"
                  :color="school.trend >= 0 ? '#67C23A' : '#F56C6C'"
                />
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useBureauStore } from '@/stores/bureau';
import { useAIStore } from '@/stores/ai';
import AnalyticsChart from '@/components/charts/AnalyticsChart.vue';

// ... 其余代码省略 ...
</script>

<style scoped>
.bureau-dashboard {
  padding: 20px;
}

.overview-card {
  margin-bottom: 20px;
}

.stat-card {
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.alert-list {
  max-height: 400px;
  overflow-y: auto;
}

.chart-container {
  height: 400px;
}

.ai-chat {
  height: 400px;
  display: flex;
  flex-direction: column;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.ranking-item:hover {
  background-color: #f5f7fa;
}

// ... 其余样式省略 ...
</style>
