<template>
  <div class="work-display">
    <el-row :gutter="20">
      <el-col 
        v-for="work in works" 
        :key="work.id" 
        :span="8"
      >
        <el-card class="work-card" :body-style="{ padding: '0' }">
          <!-- 作品预览 -->
          <div class="work-preview" @click="viewWork(work)">
            <template v-if="work.content.type === 'image'">
              <el-image :src="work.content.url" fit="cover" />
            </template>
            <template v-else-if="work.content.type === 'video'">
              <video-player :source="work.content.url" />
            </template>
            <template v-else>
              <div class="text-preview">{{ work.content.text }}</div>
            </template>
          </div>

          <!-- 作品信息 -->
          <div class="work-info">
            <h4>{{ work.title }}</h4>
            <p class="creator">
              <el-avatar :size="24" :src="work.creator.avatar" />
              <span>{{ work.creator.name }}</span>
            </p>
            <p class="description">{{ work.description }}</p>
          </div>

          <!-- 投票区域 -->
          <div class="voting-area" v-if="showVoting">
            <div class="vote-stats">
              <span>{{ work.stats.voteCount }} 票</span>
              <span>{{ work.stats.averageScore }} 分</span>
            </div>
            <div class="vote-actions">
              <el-rate
                v-model="work.userScore"
                :disabled="work.hasVoted"
                @change="handleVote(work, $event)"
              />
            </div>
          </div>

          <!-- 社交互动 -->
          <div class="social-actions">
            <el-button-group>
              <el-button 
                :icon="Star" 
                :type="work.isLiked ? 'primary' : 'default'"
                @click="toggleLike(work)"
              >
                {{ work.stats.likeCount }}
              </el-button>
              <el-button 
                :icon="ChatSquare"
                @click="showComments(work)"
              >
                {{ work.stats.commentCount }}
              </el-button>
              <el-button 
                :icon="Share"
                @click="shareWork(work)"
              >
                分享
              </el-button>
            </el-button-group>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 作品详情对话框 -->
    <el-dialog
      v-model="workDetailVisible"
      :title="selectedWork?.title"
      width="70%"
    >
      <work-detail 
        v-if="workDetailVisible"
        :work="selectedWork"
        @close="workDetailVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Star, ChatSquare, Share } from '@element-plus/icons-vue';
import VideoPlayer from '../common/VideoPlayer.vue';
import WorkDetail from './WorkDetail.vue';

// ... 其他代码实现 ...
</script>

<style scoped>
.work-display {
  margin: 20px 0;
}

.work-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.work-card:hover {
  transform: translateY(-5px);
}

.work-preview {
  height: 200px;
  overflow: hidden;
  cursor: pointer;
}

.text-preview {
  padding: 15px;
  height: 100%;
  background: #f5f7fa;
}

.work-info {
  padding: 15px;
}

.creator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
}

.voting-area, .social-actions {
  padding: 15px;
  border-top: 1px solid #eee;
}

.vote-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
</style>
