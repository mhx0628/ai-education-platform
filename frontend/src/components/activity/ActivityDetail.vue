<template>
  <div class="activity-detail">
    <!-- 活动基本信息 -->
    <div class="activity-header">
      <el-page-header @back="goBack" :title="activity.title">
        <template #extra>
          <el-tag>{{ activity.level }}</el-tag>
          <el-tag type="success">{{ activity.category }}</el-tag>
          <el-tag type="warning">{{ activity.status }}</el-tag>
        </template>
      </el-page-header>

      <div class="activity-meta">
        <div class="meta-item">
          <el-icon><Calendar /></el-icon>
          <span>报名时间：{{ formatDate(activity.timeline.registration.start) }} 至 {{ formatDate(activity.timeline.registration.end) }}</span>
        </div>
        <div class="meta-item">
          <el-icon><Timer /></el-icon>
          <span>投票时间：{{ formatDate(activity.timeline.voting.start) }} 至 {{ formatDate(activity.timeline.voting.end) }}</span>
        </div>
        <div class="meta-item">
          <el-icon><User /></el-icon>
          <span>参与人数：{{ activity.stats.participants }}</span>
        </div>
      </div>
    </div>

    <!-- 作品展示区 -->
    <div class="submissions-section">
      <h3>作品展示
        <el-button 
          type="primary" 
          size="small"
          @click="showSubmitDialog"
          v-if="canSubmit"
        >
          提交作品
        </el-button>
      </h3>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="最新作品" name="latest">
          <work-display 
            :works="latestWorks"
            :showVoting="isVotingPhase"
            @vote="handleVote"
          />
        </el-tab-pane>
        <el-tab-pane label="最受欢迎" name="popular">
          <work-display 
            :works="popularWorks"
            :showVoting="isVotingPhase"
            @vote="handleVote"
          />
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- AI评审意见 -->
    <div class="ai-review" v-if="activity.aiEvaluation">
      <h3>AI评审意见</h3>
      <div class="review-content">
        <el-card v-for="review in activity.aiEvaluation" :key="review.id">
          <template #header>
            <div class="review-header">
              <span>{{ review.aspect }}</span>
              <el-rate v-model="review.score" disabled />
            </div>
          </template>
          <p>{{ review.comment }}</p>
        </el-card>
      </div>
    </div>

    <!-- 提交作品对话框 -->
    <el-dialog
      title="提交作品"
      v-model="submitDialogVisible"
      width="60%"
    >
      <work-submit-form
        v-if="submitDialogVisible"
        :activityId="activity.id"
        @submit="handleWorkSubmit"
        @cancel="submitDialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Calendar, Timer, User } from '@element-plus/icons-vue';
import WorkDisplay from './WorkDisplay.vue';
import WorkSubmitForm from './WorkSubmitForm.vue';

// ... 其他代码实现 ...
</script>

<style scoped>
.activity-detail {
  padding: 20px;
}

.activity-header {
  margin-bottom: 30px;
}

.activity-meta {
  margin-top: 20px;
  display: flex;
  gap: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.submissions-section {
  margin: 30px 0;
}

.review-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
