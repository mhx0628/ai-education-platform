<template>
  <div class="study-recommendations">
    <div v-for="(rec, index) in recommendations" 
         :key="index" 
         class="recommendation-item"
    >
      <el-card :class="['rec-card', rec.type]">
        <template #header>
          <div class="rec-header">
            <el-icon v-if="rec.type === 'weakness'"><Warning /></el-icon>
            <el-icon v-else><Star /></el-icon>
            <span>{{ rec.subject }}</span>
          </div>
        </template>
        
        <p class="rec-content">{{ rec.content }}</p>
        
        <div class="rec-resources">
          <h5>推荐资源：</h5>
          <el-link 
            v-for="(resource, idx) in rec.resources"
            :key="idx"
            type="primary"
            :underline="false"
            @click="openResource(resource)"
          >
            {{ resource }}
            <el-icon class="resource-icon"><ArrowRight /></el-icon>
          </el-link>
        </div>
      </el-card>
    </div>

    <div class="ai-chat">
      <el-button type="primary" @click="startAiChat">
        <el-icon><ChatLineRound /></el-icon>
        咨询AI学习助手
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { Warning, Star, ArrowRight, ChatLineRound } from '@element-plus/icons-vue'

const props = defineProps({
  recommendations: {
    type: Array,
    required: true
  }
})

const openResource = (resource) => {
  // TODO: 实现资源打开逻辑
  console.log('打开学习资源:', resource)
}

const startAiChat = () => {
  // TODO: 实现AI对话逻辑
  console.log('启动AI对话')
}
</script>

<style scoped>
.study-recommendations {
  padding: 10px;
}

.recommendation-item {
  margin-bottom: 20px;
}

.rec-card {
  transition: transform 0.3s;
}

.rec-card:hover {
  transform: translateY(-3px);
}

.rec-card.weakness {
  border-left: 4px solid #F56C6C;
}

.rec-card.strength {
  border-left: 4px solid #67C23A;
}

.rec-header {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #606266;
}

.rec-content {
  margin: 10px 0;
  color: #303133;
}

.rec-resources {
  margin-top: 15px;
}

.rec-resources h5 {
  margin-bottom: 10px;
  color: #606266;
}

.rec-resources .el-link {
  display: block;
  margin: 5px 0;
}

.resource-icon {
  margin-left: 5px;
}

.ai-chat {
  text-align: center;
  margin-top: 20px;
}

.ai-chat .el-button {
  width: 100%;
}
</style>
