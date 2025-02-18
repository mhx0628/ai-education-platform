<template>
  <el-container class="dashboard-container">
    <el-header>
      <main-header />
    </el-header>
    <el-container>
      <el-aside width="200px">
        <side-menu />
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import MainHeader from '../components/layout/MainHeader.vue'
import SideMenu from '../components/layout/SideMenu.vue'
</script>

<style scoped>
.dashboard-container {
  height: 100vh;
}
.el-header {
  padding: 0;
  border-bottom: 1px solid #e6e6e6;
}
.el-aside {
  border-right: 1px solid #e6e6e6;
}
</style>
