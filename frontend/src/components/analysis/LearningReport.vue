<template>
  <div class="learning-report">
    <div class="report-header">
      <h2>学习报告</h2>
      <el-date-picker
        v-model="reportDate"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
    </div>

    <!-- 成就进展 -->
    <section class="achievements">
      <h3>学习成就</h3>
      <el-row :gutter="20">
        <el-col :span="8" v-for="achievement in achievements" :key="achievement.id">
          <el-card class="achievement-card">
            <div class="achievement-icon">
              <el-icon><component :is="achievement.icon" /></el-icon>
            </div>
            <div class="achievement-info">
              <h4>{{ achievement.name }}</h4>
              <p>{{ achievement.description }}</p>
              <el-progress 
                :percentage="achievement.progress"
                :color="achievement.color"
              />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <!-- 学习数据 -->
    <section class="learning-data">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="知识掌握" name="knowledge">
          <knowledge-map :data="knowledgeData" />
        </el-tab-pane>
        <el-tab-pane label="能力评估" name="competency">
          <competency-analysis :data="competencyData" />
        </el-tab-pane>
        <el-tab-pane label="学习行为" name="behavior">
          <behavior-analysis :data="behaviorData" />
        </el-tab-pane>
      </el-tabs>
    </section>

    <!-- AI建议 -->
    <section class="ai-recommendations">
      <el-collapse v-model="activeRecommendations">
        <el-collapse-item 
          v-for="rec in recommendations" 
          :key="rec.id"
          :title="rec.title"
          :name="rec.id">
          <div class="recommendation-content">
            <p>{{ rec.content }}</p>
            <div class="action-points">
              <div v-for="point in rec.actionPoints" 
                   :key="point.id" 
                   class="action-point">
                <el-tag size="small">{{ point.tag }}</el-tag>
                <span>{{ point.description }}</span>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </section>
  </div>
</template>

<script setup>
// ... 组件实现代码 ...
</script>

<style scoped>
.learning-report {
  padding: 20px;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.achievement-card {
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.learning-data {
  margin: 24px 0;
}

.recommendation-content {
  padding: 16px;
}

.action-points {
  margin-top: 12px;
}

.action-point {
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
