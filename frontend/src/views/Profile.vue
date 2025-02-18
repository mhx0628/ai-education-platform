<template>
  <div class="profile">
    <el-row :gutter="20">
      <!-- 个人信息卡片 -->
      <el-col :span="6">
        <el-card class="profile-card">
          <div class="avatar-container">
            <el-avatar :size="100" :src="user.avatar" />
            <div class="upload-avatar">
              <el-upload
                class="avatar-uploader"
                action="/api/upload/avatar"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
              >
                <el-icon class="upload-icon"><Plus /></el-icon>
              </el-upload>
            </div>
          </div>
          <h2>{{ user.name }}</h2>
          <p class="role-tag">
            <el-tag>{{ getRoleText(user.role) }}</el-tag>
          </p>
          <div class="stats">
            <div class="stat-item">
              <span class="number">{{ user.works }}</span>
              <span class="label">作品</span>
            </div>
            <div class="stat-item">
              <span class="number">{{ user.followers }}</span>
              <span class="label">关注者</span>
            </div>
            <div class="stat-item">
              <span class="number">{{ user.following }}</span>
              <span class="label">关注</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 主要内容区 -->
      <el-col :span="18">
        <el-card>
          <template #header>
            <div class="card-header">
              <el-tabs v-model="activeTab">
                <el-tab-pane label="基本信息" name="basic">
                  <el-form
                    ref="profileForm"
                    :model="profileData"
                    :rules="rules"
                    label-width="100px"
                  >
                    <el-form-item label="姓名" prop="name">
                      <el-input v-model="profileData.name" />
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                      <el-input v-model="profileData.email" />
                    </el-form-item>
                    <el-form-item label="电话" prop="phone">
                      <el-input v-model="profileData.phone" />
                    </el-form-item>
                    <el-form-item label="所属学校" prop="school">
                      <el-input v-model="profileData.school" disabled />
                    </el-form-item>
                    <el-form-item label="简介" prop="bio">
                      <el-input
                        type="textarea"
                        v-model="profileData.bio"
                        rows="4"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="updateProfile">
                        保存修改
                      </el-button>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                
                <el-tab-pane label="我的作品" name="works">
                  <div class="works-grid">
                    <el-card
                      v-for="work in works"
                      :key="work.id"
                      class="work-card"
                      @click="viewWork(work)"
                    >
                      <img :src="work.coverImage" :alt="work.title">
                      <div class="work-info">
                        <h4>{{ work.title }}</h4>
                        <p>{{ work.description }}</p>
                        <div class="work-stats">
                          <span>
                            <el-icon><View /></el-icon>
                            {{ work.views }}
                          </span>
                          <span>
                            <el-icon><Star /></el-icon>
                            {{ work.likes }}
                          </span>
                        </div>
                      </div>
                    </el-card>
                  </div>
                </el-tab-pane>

                <el-tab-pane label="学习统计" name="stats">
                  <div class="learning-stats">
                    <el-row :gutter="20">
                      <el-col :span="8" v-for="stat in learningStats" :key="stat.id">
                        <el-card class="stat-card">
                          <h3>{{ stat.title }}</h3>
                          <div class="stat-value">{{ stat.value }}</div>
                          <el-progress
                            :percentage="stat.percentage"
                            :color="stat.color"
                          />
                        </el-card>
                      </el-col>
                    </el-row>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { Plus, View, Star } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const userStore = useUserStore();
const activeTab = ref('basic');

// 用户数据
const user = ref({
  avatar: '',
  name: '',
  role: '',
  works: 0,
  followers: 0,
  following: 0
});

// 个人资料表单数据
const profileData = ref({
  name: '',
  email: '',
  phone: '',
  school: '',
  bio: ''
});

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' }
  ]
};

// 作品列表
const works = ref([]);

// 学习统计数据
const learningStats = ref([
  {
    id: 1,
    title: '完成课程',
    value: '12门',
    percentage: 80,
    color: '#409EFF'
  },
  {
    id: 2,
    title: '创作作品',
    value: '28个',
    percentage: 70,
    color: '#67C23A'
  },
  {
    id: 3,
    title: '获得成就',
    value: '15个',
    percentage: 60,
    color: '#E6A23C'
  }
]);

// 方法实现
const handleAvatarSuccess = (response) => {
  user.value.avatar = response.url;
  ElMessage.success('头像更新成功');
};

const getRoleText = (role) => {
  const roleMap = {
    student: '学生',
    teacher: '教师',
    parent: '家长',
    admin: '管理员'
  };
  return roleMap[role] || role;
};

const updateProfile = async () => {
  try {
    // TODO: 实现个人资料更新逻辑
    ElMessage.success('个人资料更新成功');
  } catch (error) {
    ElMessage.error('更新失败: ' + error.message);
  }
};

const viewWork = (work) => {
  // TODO: 实现作品查看逻辑
};

onMounted(async () => {
  // TODO: 获取用户数据和作品列表
});
</script>

<style scoped>
.profile {
  padding: 20px;
}

.profile-card {
  text-align: center;
}

.avatar-container {
  position: relative;
  display: inline-block;
  margin: 20px 0;
}

.upload-avatar {
  position: absolute;
  bottom: 0;
  right: 0;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.stat-item {
  text-align: center;
}

.number {
  font-size: 20px;
  font-weight: bold;
  display: block;
}

.label {
  color: #666;
  font-size: 14px;
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.work-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.work-card:hover {
  transform: translateY(-5px);
}

.work-info {
  padding: 10px;
}

.work-stats {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 14px;
}

.learning-stats {
  margin-top: 20px;
}

.stat-card {
  text-align: center;
  padding: 20px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0;
}
</style>
