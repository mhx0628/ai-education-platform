<template>
  <nav class="nav-bar">
    <div class="nav-logo">
      <img src="@/assets/logo.png" alt="AI教育平台">
    </div>
    <div class="nav-menu">
      <el-menu mode="horizontal" :router="true">
        <el-menu-item index="/ai-news">AI资讯</el-menu-item>
        <el-menu-item index="/ai-courses">AI课程</el-menu-item>
        <el-menu-item index="/ai-explore">AI探索</el-menu-item>
        <el-menu-item index="/about">关于我们</el-menu-item>
      </el-menu>
    </div>
    <div class="nav-user">
      <template v-if="isLoggedIn">
        <el-dropdown @command="handleCommand">
          <div class="user-info">
            <el-avatar :src="userAvatar" />
            <span>{{ userName }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item command="settings">设置</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <template v-else>
        <el-button type="primary" @click="$router.push('/auth/login')">
          登录/注册
        </el-button>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();

const isLoggedIn = computed(() => authStore.isAuthenticated);
const userAvatar = computed(() => userStore.profile?.avatar || '');
const userName = computed(() => userStore.profile?.name || '');

const handleCommand = async (command) => {
  switch (command) {
    case 'profile':
      router.push('/user/profile');
      break;
    case 'settings':
      router.push('/user/settings');
      break;
    case 'logout':
      await authStore.logout();
      router.push('/auth/login');
      break;
  }
};
</script>

<style scoped>
.nav-bar {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-logo {
  width: 120px;
}

.nav-menu {
  flex: 1;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-info span {
  margin-left: 8px;
}
</style>
