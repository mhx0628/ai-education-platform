<template>
  <div class="competition-detail">
    <div class="detail-header">
      <div class="competition-basic">
        <el-image 
          :src="competition.coverUrl" 
          class="cover-image"
          fit="cover"
        />
        <div class="basic-info">
          <h1>{{ competition.name }}</h1>
          <div class="tags">
            <el-tag>{{ competition.type }}</el-tag>
            <el-tag type="warning">参与人数: {{ competition.participantsCount }}</el-tag>
            <el-tag 
              :type="getStatusType(competition.status)"
            >
              {{ getStatusLabel(competition.status) }}
            </el-tag>
          </div>
          <div class="time-info">
            <p>报名时间：{{ formatTime(competition.enrollStartDate) }} - {{ formatTime(competition.enrollEndDate) }}</p>
            <p>竞赛时间：{{ formatTime(competition.startDate) }} - {{ formatTime(competition.endDate) }}</p>
          </div>
        </div>
      </div>

      <div class="action-panel">
        <el-button 
          type="primary" 
          size="large"
          :disabled="!canEnroll"
          @click="handleEnroll"
        >
          {{ enrollButtonText }}
        </el-button>
        <el-button 
          v-if="isEnrolled"
          @click="viewMySubmission"
        >
          查看我的作品
        </el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="detail-tabs">
      <el-tab-pane label="竞赛介绍" name="intro">
        <div v-html="competition.description" class="rich-text"></div>
      </el-tab-pane>

      <el-tab-pane label="参赛规则" name="rules">
        <div v-html="competition.rules" class="rich-text"></div>
      </el-tab-pane>

      <el-tab-pane label="参赛名单" name="participants">
        <el-table :data="participants" style="width: 100%">
          <el-table-column label="参赛者">
            <template #default="{ row }">
              <div class="participant-info">
                <el-avatar :src="row.avatar" :size="40" />
                <span>{{ row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="school" label="学校" />
          <el-table-column prop="submissionTime" label="提交时间">
            <template #default="{ row }">
              {{ formatTime(row.submissionTime) }}
            </template>
          </el-table-column>
          <el-table-column label="作品">
            <template #default="{ row }">
              <el-button 
                v-if="row.workUrl"
                @click="viewWork(row)"
              >
                查看作品
              </el-button>
              <span v-else>未提交</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane v-if="competition.status === 'ended'" label="获奖名单" name="winners">
        <div class="winners-list">
          <div v-for="(winners, award) in competition.awards" 
               :key="award"
               class="award-group"
          >
            <h3>{{ award }}</h3>
            <div class="winners-grid">
              <div v-for="winner in winners" 
                   :key="winner.id"
                   class="winner-card"
              >
                <el-avatar :src="winner.avatar" :size="60" />
                <h4>{{ winner.name }}</h4>
                <p>{{ winner.school }}</p>
                <el-button @click="viewWork(winner)">查看作品</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
// ... script implementation will follow in the next message ...
</script>

<style scoped>
.competition-detail {
  padding: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.competition-basic {
  display: flex;
  gap: 20px;
}

.cover-image {
  width: 300px;
  height: 200px;
  border-radius: 8px;
}

.basic-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.tags {
  display: flex;
  gap: 10px;
}

.time-info {
  color: var(--el-text-color-secondary);
}

.detail-tabs {
  margin-top: 20px;
}

.rich-text {
  line-height: 1.6;
}

.participant-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.winners-list {
  padding: 20px 0;
}

.award-group {
  margin-bottom: 30px;
}

.winners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.winner-card {
  text-align: center;
  padding: 20px;
  background: var(--el-bg-color-page);
  border-radius: 8px;
}

.winner-card h4 {
  margin: 10px 0 5px;
}

.winner-card p {
  color: var(--el-text-color-secondary);
  margin: 0 0 10px;
}
</style>
