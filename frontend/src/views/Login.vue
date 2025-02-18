<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2>AI教育平台</h2>
      <el-form>
        <el-form-item>
          <el-input v-model="username" placeholder="用户名" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="password" type="password" placeholder="密码" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="role" placeholder="选择角色">
            <el-option label="教师" value="teacher" />
            <el-option label="学生" value="student" />
            <el-option label="家长" value="parent" />
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="handleLogin" style="width: 100%">
          登录
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const role = ref('')
const router = useRouter()

const handleLogin = () => {
  // 简单的角色判断和跳转
  switch(role.value) {
    case 'teacher':
      router.push('/teacher')
      break
    case 'student':
      router.push('/student')
      break
    case 'parent':
      router.push('/parent')
      break
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
}

.login-card {
  width: 400px;
  padding: 20px;
}
</style>
