<template>
  <div class="ai-courses">
    <div class="course-path">
      <el-steps :active="currentStep" finish-status="success">
        <el-step title="AI入门" description="了解AI基础概念" />
        <el-step title="AI应用" description="实践AI工具" />
        <el-step title="AI创新" description="创建AI项目" />
      </el-steps>
    </div>

    <div class="course-container">
      <el-tabs v-model="activeTrack">
        <el-tab-pane 
          v-for="track in tracks" 
          :key="track.id" 
          :label="track.name" 
          :name="track.id"
        >
          <div class="track-courses">
            <el-timeline>
              <el-timeline-item
                v-for="course in track.courses"
                :key="course.id"
                :type="getCourseStatus(course)"
                :hollow="course.status === 'locked'"
              >
                <el-card class="course-card">
                  <template #header>
                    <div class="card-header">
                      <h4>{{ course.title }}</h4>
                      <el-tag :type="getTagType(course.status)">
                        {{ getCourseStatusText(course.status) }}
                      </el-tag>
                    </div>
                  </template>
                  <div class="course-content">
                    <p>{{ course.description }}</p>
                    <div class="course-actions">
                      <span class="duration">
                        <el-icon><Timer /></el-icon>
                        {{ course.duration }}分钟
                      </span>
                      <el-button 
                        :type="course.status === 'completed' ? 'success' : 'primary'"
                        :disabled="course.status === 'locked'"
                        @click="startCourse(course)"
                      >
                        {{ getCourseButtonText(course.status) }}
                      </el-button>
                    </div>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Timer } from '@element-plus/icons-vue'

const currentStep = ref(1)
const activeTrack = ref('ai_basics')

const tracks = ref([
  {
    id: 'ai_basics',
    name: 'AI基础知识',
    courses: [
      {
        id: 1,
        title: 'AI发展简史',
        description: '了解AI的发展历程和关键里程碑',
        duration: 45,
        status: 'completed'
      },
      {
        id: 2,
        title: '机器学习基础',
        description: '理解机器学习的核心概念和应用场景',
        duration: 60,
        status: 'in_progress'
      },
      {
        id: 3,
        title: '深度学习入门',
        description: '探索神经网络和深度学习模型',
        duration: 90,
        status: 'locked'
      }
    ]
  },
  // ... 其他学习路径
])

const getCourseStatus = (course) => {
  const statusMap = {
    completed: 'success',
    in_progress: 'warning',
    locked: 'info'
  }
  return statusMap[course.status]
}

const getTagType = (status) => {
  const typeMap = {
    completed: 'success',
    in_progress: 'warning',
    locked: 'info'
  }
  return typeMap[status]
}

const getCourseStatusText = (status) => {
  const textMap = {
    completed: '已完成',
    in_progress: '学习中',
    locked: '未解锁'
  }
  return textMap[status]
}

const getCourseButtonText = (status) => {
  const textMap = {
    completed: '复习',
    in_progress: '继续学习',
    locked: '未解锁'
  }
  return textMap[status]
}

const startCourse = (course) => {
  // TODO: 实现课程学习逻辑
  console.log(`开始学习课程: ${course.title}`)
}
</script>

<style scoped>
.ai-courses {
  padding: 20px;
}

.course-path {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.track-courses {
  margin-top: 20px;
}

.course-card {
  margin-bottom: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.course-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.duration {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
}
</style>
