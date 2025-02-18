<template>
  <div class="challenge-dashboard">
    <div class="subject-selector">
      <el-radio-group v-model="currentSubject">
        <el-radio-button label="math">数学</el-radio-button>
        <el-radio-button label="chinese">语文</el-radio-button>
        <el-radio-button label="english">英语</el-radio-button>
      </el-radio-group>
    </div>

    <div class="challenge-map">
      <div class="level-path">
        <div v-for="level in 20" 
             :key="level"
             class="level-node"
             :class="{
               'completed': isLevelCompleted(level),
               'current': isCurrentLevel(level),
               'locked': isLevelLocked(level)
             }"
             @click="handleLevelClick(level)"
        >
          <span class="level-number">{{ level }}</span>
          <el-progress
            v-if="getLevelProgress(level)"
            type="circle"
            :percentage="getLevelProgress(level)"
            :width="40"
          />
          <el-icon v-else-if="isLevelCompleted(level)">
            <Check />
          </el-icon>
          <el-icon v-else>
            <Lock />
          </el-icon>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="challengeDialogVisible"
      :title="`第${selectedLevel}关`"
      width="80%"
    >
      <challenge-content
        v-if="challengeDialogVisible"
        :level="selectedLevel"
        :subject="currentSubject"
        @complete="handleChallengeComplete"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Check, Lock } from '@element-plus/icons-vue';
import { useLearningStore } from '@/store/learning';
import ChallengeContent from './components/ChallengeContent.vue';

const learningStore = useLearningStore();
const currentSubject = ref('math');
const selectedLevel = ref(1);
const challengeDialogVisible = ref(false);

// 获取当前科目的闯关数据
const subjectProgress = computed(() => {
  return learningStore.getChallengeProgress(currentSubject.value);
});

// 判断关卡状态的方法
const isLevelCompleted = (level) => {
  return subjectProgress.value?.completedLevels?.includes(level);
};

const isCurrentLevel = (level) => {
  return level === subjectProgress.value?.currentLevel;
};

const isLevelLocked = (level) => {
  return level > (subjectProgress.value?.currentLevel || 1);
};

const getLevelProgress = (level) => {
  return subjectProgress.value?.levelProgress?.[level] || 0;
};

// 处理关卡点击
const handleLevelClick = (level) => {
  if (isLevelLocked(level)) {
    ElMessage.warning('请先完成前面的关卡');
    return;
  }
  selectedLevel.value = level;
  challengeDialogVisible.value = true;
};

// 处理闯关完成
const handleChallengeComplete = async (result) => {
  try {
    await learningStore.updateChallengeProgress({
      subject: currentSubject.value,
      level: selectedLevel.value,
      result
    });
    challengeDialogVisible.value = false;
    ElMessage.success('恭喜完成闯关！');
  } catch (error) {
    console.error('更新闯关进度失败:', error);
  }
};
</script>

<style scoped>
.challenge-dashboard {
  padding: 20px;
}

.subject-selector {
  margin-bottom: 30px;
  text-align: center;
}

.challenge-map {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.level-path {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  position: relative;
}

.level-node {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  background: var(--el-bg-color);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.level-node:hover {
  transform: scale(1.1);
}

.level-node.completed {
  background: var(--el-color-success-light-9);
}

.level-node.current {
  background: var(--el-color-primary-light-9);
}

.level-node.locked {
  cursor: not-allowed;
  opacity: 0.7;
}

.level-number {
  position: absolute;
  top: -20px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}
</style>
