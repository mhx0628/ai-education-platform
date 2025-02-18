<template>
  <router-view></router-view>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(() => {
  // 检查登录状态
  userStore.checkAuth()
})
</script>
