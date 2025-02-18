<template>
  <div class="project-list">
    <el-row :gutter="20">
      <el-col 
        v-for="project in projects" 
        :key="project.id" 
        :xs="24" 
        :sm="12" 
        :md="8"
        :lg="6"
      >
        <el-card 
          class="project-card" 
          :body-style="{ padding: '0px' }"
          @click="$emit('select', project)"
        >
          <div class="project-cover">
            <img :src="project.coverUrl || '/default-project.png'" alt="项目封面">
            <div class="project-tags">
              <el-tag 
                v-for="tag in project.tags" 
                :key="tag"
                size="small"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
          
          <div class="project-info">
            <h3>{{ project.name }}</h3>
            <p class="description">{{ project.description }}</p>
            
            <div class="project-meta">
              <div class="members">
                <el-avatar-group :size="24" :max="3">
                  <el-avatar 
                    v-for="member in project.members" 
                    :key="member.id"
                    :src="member.avatar"
                  />
                </el-avatar-group>
                <span>{{ project.members.length }}人参与</span>
              </div>
              <div class="stats">
                <span>
                  <el-icon><View /></el-icon>
                  {{ project.viewCount }}
                </span>
                <span>
                  <el-icon><Star /></el-icon>
                  {{ project.starCount }}
                </span>
              </div>
            </div>

            <div class="project-status">
              <el-progress 
                :percentage="project.progress" 
                :status="getProgressStatus(project.progress)"
              />
              <span class="update-time">
                {{ formatTime(project.lastUpdateTime) }}
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div v-if="!projects.length" class="empty-state">
      <el-empty description="暂无项目" />
    </div>

    <div v-if="hasMore" class="load-more">
      <el-button @click="loadMore">加载更多</el-button>
    </div>
  </div>
</template>

<script setup>
import { View, Star } from '@element-plus/icons-vue';
import { formatTime } from '@/utils/format';

defineProps({
  projects: {
    type: Array,
    required: true
  },
  hasMore: {
    type: Boolean,
    default: false
  }
});

defineEmits(['select', 'loadMore']);

const getProgressStatus = (progress) => {
  if (progress >= 100) return 'success';
  if (progress >= 60) return 'warning';
  return '';
};
</script>

<style scoped>
.project-list {
  min-height: 400px;
}

.project-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.project-card:hover {
  transform: translateY(-5px);
}

.project-cover {
  position: relative;
  height: 160px;
}

.project-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-tags {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
}

.project-info {
  padding: 15px;
}

.project-info h3 {
  margin: 0;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.description {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin: 10px 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.members {
  display: flex;
  align-items: center;
  gap: 5px;
}

.stats {
  display: flex;
  gap: 15px;
  color: var(--el-text-color-secondary);
}

.stats span {
  display: flex;
  align-items: center;
  gap: 3px;
}

.project-status {
  margin-top: 10px;
}

.update-time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.load-more {
  text-align: center;
  margin-top: 20px;
}
</style>
