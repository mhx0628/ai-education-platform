<template>
  <div class="main-header">
    <div class="logo">
      <img src="@/assets/logo.png" alt="AI教育平台">
      <span>AI教育平台</span>
    </div>
    <el-menu mode="horizontal" router>
      <el-menu-item index="/dashboard/ai-news">AI资讯</el-menu-item>
      <el-menu-item index="/dashboard/ai-courses">AI课程</el-menu-item>
      <el-menu-item index="/dashboard/ai-explore">AI探索</el-menu-item>
      <el-menu-item index="/dashboard/about">关于</el-menu-item>
    </el-menu>
    <div class="user-info">
      <el-dropdown>
        <span class="user-dropdown">
          <el-avatar :size="32" :src="userAvatar" />
          {{ userName }}
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userAvatar = ref('https://placeholder.com/32x32')
const userName = ref('测试用户')

const handleLogout = () => {
  // TODO: 实现退出登录逻辑
  router.push('/login')
}
</script>

<style scoped>
.main-header {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 20px;
}
.logo {
  display: flex;
  align-items: center;
  margin-right: 40px;
}
.logo img {
  height: 32px;
  margin-right: 8px;
}
.user-info {
  margin-left: auto;
}
.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.user-dropdown .el-avatar {
  margin-right: 8px;
}
</style>
