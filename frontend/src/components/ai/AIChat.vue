<template>
  <div class="ai-chat">
    <div class="chat-messages" ref="messageContainer">
      <div v-for="(message, index) in messages" 
           :key="index" 
           :class="['message', message.role]">
        <el-avatar 
          :src="message.role === 'user' ? userAvatar : aiAvatar"
          :size="40"
        />
        <div class="message-content">
          <div class="message-text" v-html="formatMessage(message.content)"></div>
          <div class="message-time">{{ formatTime(message.timestamp) }}</div>
        </div>
      </div>
    </div>

    <div class="chat-input">
      <el-input
        v-model="inputMessage"
        type="textarea"
        :rows="3"
        placeholder="输入您的问题..."
        @keyup.enter.ctrl="sendMessage"
      />
      <div class="input-actions">
        <el-upload
          action=""
          :auto-upload="false"
          :show-file-list="false"
          accept="image/*,.pdf,.doc,.docx"
          @change="handleFileUpload"
        >
          <el-button>
            <el-icon><Upload /></el-icon>
            上传文件
          </el-button>
        </el-upload>
        <el-button type="primary" @click="sendMessage">
          发送
          <el-icon class="el-icon--right"><Send /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useAIStore } from '@/store/ai';
import { useUserStore } from '@/store/user';
import { Upload, Send } from '@element-plus/icons-vue';
import { formatTime, formatMessage } from '@/utils/format';

const aiStore = useAIStore();
const userStore = useUserStore();
const messages = ref([]);
const inputMessage = ref('');
const messageContainer = ref(null);
const userAvatar = userStore.user?.profile.avatar;
const aiAvatar = '/ai-avatar.png';

onMounted(() => {
  // 加载历史消息
  loadHistoryMessages();
});

async function sendMessage() {
  if (!inputMessage.value.trim()) return;

  const userMessage = {
    role: 'user',
    content: inputMessage.value,
    timestamp: new Date()
  };

  messages.value.push(userMessage);
  inputMessage.value = '';
  
  await nextTick();
  scrollToBottom();

  try {
    const response = await aiStore.sendMessage(userMessage.content);
    messages.value.push({
      role: 'assistant',
      content: response,
      timestamp: new Date()
    });
    
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error('发送消息失败:', error);
  }
}

function handleFileUpload(file) {
  // 处理文件上传逻辑
}

function scrollToBottom() {
  const container = messageContainer.value;
  container.scrollTop = container.scrollHeight;
}

// ... 其他辅助方法
</script>

<style scoped>
.ai-chat {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message {
  display: flex;
  margin-bottom: 20px;
  gap: 12px;
}

.message.user {
  flex-direction: row-reverse;
}

.message-content {
  max-width: 70%;
  padding: 10px;
  border-radius: 8px;
  background: var(--el-bg-color-page);
}

.chat-input {
  padding: 20px;
  border-top: 1px solid var(--el-border-color-light);
}

.input-actions {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
</style>
