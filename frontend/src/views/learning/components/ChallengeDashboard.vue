<template>
  <div class="challenge-dashboard">
    <div class="subject-tabs">
      <el-radio-group v-model="currentSubject">
        <el-radio-button label="math">数学</el-radio-button>
        <el-radio-button label="chinese">语文</el-radio-button>
        <el-radio-button label="english">英语</el-radio-button>
      </el-radio-group>
    </div>

    <div class="level-map">
      <div v-for="level in 20" :key="level" class="level-item">
        <el-button 
          :type="getLevelType(level)"
          :disabled="!isLevelUnlocked(level)"
          @click="startChallenge(level)"
        >
          第{{ level }}关
          <el-icon v-if="isLevelCompleted(level)"><Check /></el-icon>
        </el-button>
        <div class="level-info">
          <el-progress :percentage="getLevelProgress(level)" />
          <span class="level-status">{{ getLevelStatus(level) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Check } from '@element-plus/icons-vue'

const props = defineProps({
  grade: {
    type: String,
    required: true
  }
})

const currentSubject = ref('math')

// 模拟数据，实际应从API获取
const levelStatus = {
  1: { completed: true, progress: 100 },
  2: { completed: true, progress: 100 },
  3: { completed: false, progress: 60 },
  4: { unlocked: true, progress: 0 }
}

const getLevelType = (level) => {
  if (levelStatus[level]?.completed) return 'success'
  if (levelStatus[level]?.unlocked) return 'primary'
  return 'info'
}

const isLevelUnlocked = (level) => {
  return levelStatus[level]?.unlocked || level === 1
}

const isLevelCompleted = (level) => {
  return levelStatus[level]?.completed
}

const getLevelProgress = (level) => {
  return levelStatus[level]?.progress || 0
}

const getLevelStatus = (level) => {
  if (levelStatus[level]?.completed) return '已完成'
  if (levelStatus[level]?.progress > 0) return '进行中'
  if (isLevelUnlocked(level)) return '可挑战'
  return '未解锁'
}

const startChallenge = (level) => {
  // TODO: 实现开始闯关逻辑
  console.log(`开始第${level}关挑战`)
}
</script>

<style scoped>
.challenge-dashboard {
  padding: 20px;
}

.subject-tabs {
  margin-bottom: 20px;
}

.level-map {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  padding: 20px;
}

.level-item {
  text-align: center;
}

.level-info {
  margin-top: 10px;
}

.level-status {
  font-size: 12px;
  color: #666;
}
</style>
