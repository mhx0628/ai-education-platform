<template>
  <div class="challenge-content">
    <div class="challenge-info">
      <el-progress :percentage="timePercentage" :format="formatTime" />
      <div class="score-info">
        得分：{{ currentScore }} / {{ totalScore }}
      </div>
    </div>

    <div class="questions-container">
      <div v-for="(question, index) in questions" 
           :key="index"
           :class="['question-card', { active: currentIndex === index }]"
      >
        <div class="question-header">
          <span class="question-number">第 {{ index + 1 }} 题</span>
          <span class="question-points">{{ question.points }}分</span>
        </div>
        
        <div class="question-content">
          <div v-html="question.content"></div>
          
          <!-- 选择题 -->
          <template v-if="question.type === 'choice'">
            <el-radio-group v-model="answers[index]">
              <el-radio 
                v-for="(option, idx) in question.options" 
                :key="idx"
                :label="option"
              >
                {{ option }}
              </el-radio>
            </el-radio-group>
          </template>

          <!-- 填空题 -->
          <template v-else-if="question.type === 'fill'">
            <el-input 
              v-model="answers[index]"
              type="textarea"
              :rows="3"
              placeholder="请输入答案"
            />
          </template>
        </div>

        <div class="question-actions">
          <el-button 
            v-if="answers[index]"
            type="primary"
            @click="checkAnswer(index)"
          >
            提交答案
          </el-button>
          <el-button 
            v-if="questionStatus[index] === 'wrong'"
            @click="showHint(index)"
          >
            查看提示
          </el-button>
        </div>

        <div v-if="questionStatus[index]" class="question-feedback">
          <div :class="['feedback-content', questionStatus[index]]">
            <template v-if="questionStatus[index] === 'correct'">
              <el-icon><CircleCheckFilled /></el-icon>
              <span>回答正确！</span>
            </template>
            <template v-else>
              <el-icon><CircleCloseFilled /></el-icon>
              <span>再想想看~</span>
            </template>
          </div>
          <div v-if="showExplanation[index]" class="explanation">
            {{ question.explanation }}
          </div>
        </div>
      </div>
    </div>

    <div class="challenge-actions">
      <el-button 
        @click="previousQuestion" 
        :disabled="currentIndex === 0"
      >
        上一题
      </el-button>
      <el-button 
        type="primary" 
        @click="nextQuestion"
        :disabled="currentIndex === questions.length - 1"
      >
        下一题
      </el-button>
      <el-button 
        type="success"
        @click="submitChallenge"
        :disabled="!canSubmit"
      >
        完成闯关
      </el-button>
    </div>
  </div>
</template>

<script setup>
// ... script implementation will follow in the next message ...
</script>

<style scoped>
.challenge-content {
  padding: 20px;
}

.challenge-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.questions-container {
  margin: 20px 0;
}

.question-card {
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  display: none;
}

.question-card.active {
  display: block;
}

.question-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.question-content {
  margin: 20px 0;
}

.question-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.question-feedback {
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
}

.feedback-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.feedback-content.correct {
  color: var(--el-color-success);
}

.feedback-content.wrong {
  color: var(--el-color-danger);
}

.explanation {
  margin-top: 10px;
  padding: 10px;
  background-color: var(--el-color-info-light-9);
  border-radius: 4px;
  font-size: 14px;
}

.challenge-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}
</style>
