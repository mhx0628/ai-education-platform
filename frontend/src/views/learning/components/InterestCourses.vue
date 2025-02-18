<template>
  <div class="interest-courses">
    <div class="course-filters">
      <el-select v-model="category" placeholder="选择课程分类">
        <el-option label="编程与技术" value="programming" />
        <el-option label="艺术创作" value="art" />
        <el-option label="语言能力" value="language" />
        <el-option label="兴趣培养" value="interest" />
      </el-select>
      <el-select v-model="level" placeholder="难度等级">
        <el-option label="入门" value="beginner" />
        <el-option label="进阶" value="intermediate" />
        <el-option label="高级" value="advanced" />
      </el-select>
    </div>

    <div class="course-grid">
      <el-card v-for="course in filteredCourses" 
               :key="course.id" 
               class="course-card"
               :body-style="{ padding: '0px' }">
        <img :src="course.cover" class="course-image">
        <div class="course-info">
          <h3>{{ course.title }}</h3>
          <p>{{ course.description }}</p>
          <div class="course-meta">
            <el-tag size="small">{{ course.category }}</el-tag>
            <el-tag size="small" type="success">{{ course.level }}</el-tag>
            <span class="students-count">{{ course.studentsCount }}人学习</span>
          </div>
          <el-button type="primary" @click="startLearning(course.id)">开始学习</el-button>
        </div>
      </el-card>
    </div>

    <div class="course-pagination">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="handlePageChange"
        layout="prev, pager, next"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 状态管理
const category = ref('')
const level = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(100)

// 模拟课程数据
const courses = ref([
  {
    id: 1,
    title: 'Python游戏开发入门',
    description: '通过制作游戏学习Python编程基础',
    category: 'programming',
    level: 'beginner',
    studentsCount: 1234,
    cover: '/images/python-game.jpg'
  },
  // ... 更多课程数据
])

// 计算属性：过滤后的课程列表
const filteredCourses = computed(() => {
  let result = courses.value
  if (category.value) {
    result = result.filter(course => course.category === category.value)
  }
  if (level.value) {
    result = result.filter(course => course.level === level.value)
  }
  return result
})

// 事件处理
const handlePageChange = (page) => {
  currentPage.value = page
  // TODO: 加载新页面数据
}

const startLearning = (courseId) => {
  // TODO: 实现课程学习逻辑
  console.log(`开始学习课程${courseId}`)
}
</script>

<style scoped>
.interest-courses {
  padding: 20px;
}

.course-filters {
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.course-card {
  transition: transform 0.3s;
}

.course-card:hover {
  transform: translateY(-5px);
}

.course-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.course-info {
  padding: 15px;
}

.course-meta {
  margin: 10px 0;
  display: flex;
  gap: 10px;
  align-items: center;
}

.students-count {
  color: #666;
  font-size: 14px;
}

.course-pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
