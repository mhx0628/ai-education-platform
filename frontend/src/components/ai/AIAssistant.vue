<template>
  <div class="ai-assistant" :class="{ 'is-minimized': isMinimized }">
    <div class="assistant-header" @click="toggleMinimize">
      <h3>AI助手 - {{ role }}</h3>
      <div class="header-controls">
        <el-button 
          size="small" 
          icon="el-icon-minus" 
          @click.stop="isMinimized = !isMinimized"
        />
      </div>
    </div>

    <div v-show="!isMinimized" class="assistant-body">
      <div class="chat-messages" ref="chatBox">
        <div v-for="msg in messages" 
             :key="msg.id" 
             :class="['message', msg.role]">
          <div class="message-content" v-html="formatMessage(msg.content)" />
          <div class="message-meta">
            <span class="time">{{ formatTime(msg.timestamp) }}</span>
            <div class="actions" v-if="msg.role === 'assistant'">
              <el-button 
                size="mini" 
                type="text" 
                @click="regenerateResponse(msg)">
                重新生成
              </el-button>
              <el-button 
                size="mini" 
                type="text" 
                @click="copyToClipboard(msg.content)">
                复制
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <el-input
          v-model="userInput"
          type="textarea"
          :rows="2"
          placeholder="请输入问题..."
          @keyup.enter.native="sendMessage"
        >
          <template #append>
            <el-button-group>
              <el-button 
                type="primary" 
                :loading="isProcessing"
                @click="sendMessage">
                发送
              </el-button>
              <el-upload
                action=""
                :show-file-list="false"
                :before-upload="handleFileUpload">
                <el-button icon="el-icon-paperclip" />
              </el-upload>
            </el-button-group>
          </template>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAIStore } from '@/stores/ai';
import { useUserStore } from '@/stores/user';
import { ElMessage } from 'element-plus';

const props = defineProps({
  role: {
    type: String,
    required: true,
    validator: (value) => ['teacher', 'student', 'parent'].includes(value)
  }
});

// 状态管理
const aiStore = useAIStore();
const userStore = useUserStore();

const isMinimized = ref(false);
const userInput = ref('');
const isProcessing = ref(false);
const messages = ref([]);
const chatBox = ref(null);

// 监听新消息，自动滚动到底部
watch(messages, () => {
  scrollToBottom();
}, { deep: true });

// 方法实现
const sendMessage = async () => {
  if (!userInput.value.trim() || isProcessing.value) return;

  try {
    isProcessing.value = true;
    const response = await aiStore.sendMessage({
      role: props.role,
      content: userInput.value,
      userId: userStore.user.id
    });

    messages.value.push({
      id: Date.now(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    });

    userInput.value = '';
  } catch (error) {
    ElMessage.error('发送消息失败，请重试');
  } finally {
    isProcessing.value = false;
    scrollToBottom();
  }
};

// ... 其他方法实现 ...

onMounted(() => {
  // 初始化欢迎消息
  messages.value.push({
    id: Date.now(),
    role: 'assistant',
    content: getWelcomeMessage(props.role),
    timestamp: new Date()
  });
});
</script>

<style scoped>
.ai-assistant {
  width: 360px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.assistant-header {
  padding: 12px 16px;
  background: var(--el-color-primary);
  color: #fff;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-messages {
  height: 400px;
  overflow-y: auto;
  padding: 16px;
}

.message {
  margin-bottom: 16px;
  max-width: 80%;
}

.message.user {
  margin-left: 20%;
  background-color: #e6f7ff;
}

.message.assistant {
  margin-right: 20%;
  background-color: #f5f5f5;
}

// ... 其他样式 ...
</style>
