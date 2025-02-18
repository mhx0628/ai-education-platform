<template>
  <div class="main-layout">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="logo">AI教育平台</div>
      <nav>
        <el-menu mode="horizontal" router>
          <el-menu-item index="/ai-news">AI资讯</el-menu-item>
          <el-menu-item index="/ai-courses">AI课程</el-menu-item>
          <el-menu-item index="/ai-explore">AI探索</el-menu-item>
          <el-menu-item index="/about">关于</el-menu-item>
        </el-menu>
      </nav>
      <div class="user-info" v-if="userStore.isAuthenticated">
        <el-avatar :src="userStore.user?.avatar" />
        <span>{{ userStore.user?.username }}</span>
      </div>
      <el-button v-else @click="$router.push('/auth/login')">登录/注册</el-button>
    </header>

    <!-- 左侧边栏 -->
    <div class="container">
      <aside class="sidebar">
        <el-menu class="ai-tools-menu">
          <el-menu-item v-for="tool in aiTools" 
                        :key="tool.id"
                        @click="handleToolClick(tool)">
            <el-icon><component :is="tool.icon" /></el-icon>
            <span>{{ tool.name }}</span>
          </el-menu-item>
        </el-menu>
      </aside>

      <!-- 主内容区域 -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const aiTools = ref([
  { id: 1, name: 'AI交互', icon: 'Chat' },
  { id: 2, name: 'AI生图', icon: 'Picture' },
  { id: 3, name: 'AI视频', icon: 'VideoCamera' },
  { id: 4, name: 'AI音乐', icon: 'Headset' },
  { id: 5, name: 'AI编程', icon: 'Monitor' },
  { id: 6, name: 'AI综合', icon: 'Grid' }
]);

const handleToolClick = (tool) => {
  // TODO: 实现AI工具点击处理逻辑
};
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,.1);
}

.container {
  flex: 1;
  display: flex;
}

.sidebar {
  width: 200px;
  background: #fff;
  border-right: 1px solid #eee;
}

.ai-tools-menu {
  border-right: none;
}

.main-content {
  flex: 1;
  padding: 20px;
  background: #f5f7fa;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
