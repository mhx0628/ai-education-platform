<template>
  <div class="main-layout">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="logo">AI教育平台</div>
      <nav>
        <el-menu mode="horizontal">
          <el-menu-item index="1">首页</el-menu-item>
          <el-menu-item index="2">AI资讯</el-menu-item>
          <el-menu-item index="3">AI课程</el-menu-item>
          <el-menu-item index="4">关于</el-menu-item>
        </el-menu>
      </nav>
      <div class="user-info">
        <el-avatar :size="32" />
        <span>{{ username }}</span>
      </div>
    </header>

    <!-- 侧边栏 -->
    <div class="main-container">
      <aside class="sidebar">
        <el-menu>
          <el-menu-item v-for="item in menuItems" 
                        :key="item.id"
                        @click="handleMenuClick(item)">
            {{ item.name }}
          </el-menu-item>
        </el-menu>
      </aside>

      <!-- 主内容区 -->
      <main class="content">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('测试用户')
const menuItems = ref([
  { id: 1, name: 'AI交互' },
  { id: 2, name: 'AI生图' },
  { id: 3, name: 'AI视频' },
  { id: 4, name: 'AI音乐' },
  { id: 5, name: 'AI编程' },
  { id: 6, name: 'AI综合' }
])

const handleMenuClick = (item) => {
  console.log('点击菜单项:', item.name)
}
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.main-container {
  display: flex;
  height: calc(100vh - 60px);
}

.sidebar {
  width: 200px;
  background: #fff;
  border-right: 1px solid #eee;
}

.content {
  flex: 1;
  padding: 20px;
  background: #f5f7fa;
}

.user-info {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
