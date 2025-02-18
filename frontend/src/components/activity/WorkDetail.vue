<template>
  <div class="work-detail">
    <!-- 作品内容展示 -->
    <section class="work-content">
      <template v-if="work.content.type === 'image'">
        <el-image-viewer
          v-if="showViewer"
          :url-list="work.content.files.map(f => f.url)"
          @close="showViewer = false"
        />
        <div class="image-grid">
          <el-image
            v-for="file in work.content.files"
            :key="file.url"
            :src="file.url"
            :preview-src-list="work.content.files.map(f => f.url)"
            @click="showViewer = true"
          />
        </div>
      </template>

      <template v-else-if="work.content.type === 'video'">
        <video-player
          :source="work.content.files[0].url"
          :poster="work.content.files[0].thumbnail"
        />
      </template>

      <template v-else>
        <div class="text-content" v-html="formatContent(work.content.text)" />
      </template>
    </section>

    <!-- AI创作过程 -->
    <section class="ai-process" v-if="work.aiTools?.length">
      <h3>AI创作过程</h3>
      <el-timeline>
        <el-timeline-item
          v-for="tool in work.aiTools"
          :key="tool.name"
          :timestamp="tool.timestamp"
        >
          <h4>{{ tool.name }}</h4>
          <p>{{ tool.usage }}</p>
          <p>贡献：{{ tool.contribution }}</p>
        </el-timeline-item>
      </el-timeline>
    </section>

    <!-- 评分与评论 -->
    <section class="feedback">
      <div class="scores">
        <div class="expert-scores" v-if="work.scores.expertScores?.length">
          <h3>专家评分</h3>
          <el-table :data="work.scores.expertScores">
            <el-table-column prop="expert.name" label="评委" />
            <el-table-column label="评分">
              <template #default="{ row }">
                <div class="score-details">
                  <div v-for="score in row.scores" :key="score.criterion">
                    {{ score.criterion }}: {{ score.score }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="comment" label="评语" />
          </el-table>
        </div>

        <div class="public-votes">
          <h3>公众评分</h3>
          <div class="vote-summary">
            <el-statistic :value="work.stats.averageScore">
              <template #title>平均分</template>
            </el-statistic>
            <el-statistic :value="work.stats.voteCount">
              <template #title>投票数</template>
            </el-statistic>
          </div>
        </div>
      </div>

      <div class="comments">
        <h3>评论区</h3>
        <div class="comment-list">
          <div 
            v-for="comment in comments" 
            :key="comment.id"
            class="comment-item"
          >
            <div class="comment-user">
              <el-avatar :src="comment.user.avatar" />
              <span>{{ comment.user.name }}</span>
              <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
            </div>
            <p>{{ comment.content }}</p>
          </div>
        </div>
        <div class="comment-input">
          <el-input
            v-model="newComment"
            type="textarea"
            :rows="2"
            placeholder="写下你的评论..."
          />
          <el-button type="primary" @click="submitComment">
            发表评论
          </el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// ... 脚本实现 ...
</script>

<style scoped>
.work-detail {
  padding: 20px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.text-content {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 4px;
  line-height: 1.8;
}

.scores {
  margin: 30px 0;
}

.vote-summary {
  display: flex;
  gap: 40px;
  margin: 20px 0;
}

.comments {
  margin-top: 30px;
}

.comment-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.comment-user {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.comment-time {
  color: #999;
  font-size: 12px;
}

.comment-input {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
</style>
