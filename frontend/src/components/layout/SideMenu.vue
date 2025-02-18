<template>
  <div class="side-menu">
    <el-menu
      :default-active="activeMenu"
      class="menu-vertical"
      :collapse="isCollapse"
      @select="handleSelect"
    >
      <el-menu-item index="/ai-interaction">
        <el-icon><ChatSquare /></el-icon>
        <span>AI交互</span>
      </el-menu-item>
      <el-menu-item index="/ai-image">
        <el-icon><Picture /></el-icon>
        <span>AI绘画</span>
      </el-menu-item>
      <el-menu-item index="/ai-video">
        <el-icon><VideoCamera /></el-icon>
        <span>AI视频</span>
      </el-menu-item>
      <el-menu-item index="/ai-music">
        <el-icon><Headset /></el-icon>
        <span>AI音乐</span>
      </el-menu-item>
      <el-menu-item index="/ai-coding">
        <el-icon><Terminal /></el-icon>
        <span>AI编程</span>
      </el-menu-item>
      <el-menu-item index="/ai-comprehensive">
        <el-icon><Grid /></el-icon>
        <span>AI综合</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ChatSquare,
  Picture,
  VideoCamera,
  Headset,
  Terminal,
  Grid
} from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const isCollapse = ref(false);

const activeMenu = computed(() => route.path);

const handleSelect = (path) => {
  router.push(path);
};
</script>

<style scoped>
.side-menu {
  height: 100%;
  border-right: 1px solid var(--el-border-color-light);
}

.menu-vertical {
  height: 100%;
}

.menu-vertical:not(.el-menu--collapse) {
  width: 200px;
}
</style>
