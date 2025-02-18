<template>
  <div class="ai-agent-container">
    <!-- 智能体状态栏 -->
    <div class="agent-status-bar">
      <el-avatar :src="agentInfo.avatar" />
      <div class="agent-info">
        <h3>{{ agentInfo.name }}</h3>
        <el-tag size="small" :type="agentInfo.status === 'active' ? 'success' : 'warning'">
          {{ agentInfo.status === 'active' ? '在线' : '训练中' }}
        </el-tag>
      </div>
      <div class="agent-controls">
        <el-button-group>
          <el-button 
            size="small" 
            :icon="Setting"
            @click="showSettings = true"
          />
          <el-button 
            size="small" 
            :icon="RefreshRight"
            @click="refreshAgent"
          />
        </el-button-group>
      </div>
    </div>

    <!-- 智能体工作区 -->
    <div class="agent-workspace">
      <!-- 多模态输入区 -->
      <div class="input-area">
        <div class="input-tabs">
          <el-radio-group v-model="inputMode" size="small">
            <el-radio-button label="text">文本</el-radio-button>
            <el-radio-button label="voice">语音</el-radio-button>
            <el-radio-button label="image">图像</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 文本输入 -->
        <div v-show="inputMode === 'text'" class="text-input">
          <el-input
            v-model="textInput"
            type="textarea"
            :rows="3"
            placeholder="请输入您的需求..."
          />
        </div>

        <!-- 语音输入 -->
        <div v-show="inputMode === 'voice'" class="voice-input">
          <el-button 
            :icon="Microphone"
            :class="{ recording: isRecording }"
            @mousedown="startRecording"
            @mouseup="stopRecording"
          >
            {{ isRecording ? '正在录音...' : '按住说话' }}
          </el-button>
        </div>

        <!-- 图像输入 -->
        <div v-show="inputMode === 'image'" class="image-input">
          <el-upload
            action=""
            :show-file-list="false"
            :before-upload="handleImageUpload"
          >
            <el-button :icon="PictureUpload">上传图片</el-button>
          </el-upload>
        </div>
      </div>

      <!-- 智能体响应区 -->
      <div class="response-area" ref="responseArea">
        <template v-if="responses.length">
          <div v-for="response in responses" 
               :key="response.id"
               :class="['response-item', response.type]">
            <div class="response-content" v-html="formatResponse(response)" />
            <div class="response-actions">
              <el-button-group size="small">
                <el-button @click="regenerateResponse(response)">重新生成</el-button>
                <el-button @click="copyResponse(response)">复制</el-button>
                <el-button @click="saveResponse(response)">保存</el-button>
              </el-button-group>
            </div>
          </div>
        </template>
        <el-empty v-else description="暂无对话记录" />
      </div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <el-button-group>
          <el-button 
            type="primary" 
            :loading="isProcessing"
            @click="sendRequest"
          >
            发送
          </el-button>
          <el-button 
            :disabled="!responses.length"
            @click="clearResponses"
          >
            清空
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 设置面板 -->
    <el-dialog
      v-model="showSettings"
      title="智能体设置"
      width="500px"
    >
      <agent-settings 
        :settings="agentSettings"
        @update="updateSettings"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAIStore } from '@/stores/ai';
import { Setting, RefreshRight, Microphone, PictureUpload } from '@element-plus/icons-vue';
import AgentSettings from './AgentSettings.vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['teacher', 'student', 'parent', 'principal'].includes(value)
  },
  mode: {
    type: String,
    default: 'chat'
  }
});

// ... 其他代码实现 ...
</script>

<style scoped>
.ai-agent-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.agent-status-bar {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.agent-workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.input-area {
  margin-bottom: 16px;
}

.response-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 4px;
}

.response-item {
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 4px;
  background: #fff;
}

.voice-input .el-button.recording {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
</style>
