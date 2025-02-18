<template>
  <div class="project-detail">
    <div class="detail-header">
      <div class="project-info">
        <h2>{{ project.name }}</h2>
        <div class="tags">
          <el-tag 
            v-for="tag in project.tags" 
            :key="tag" 
            size="small"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
      
      <div class="status-info">
        <el-button-group>
          <el-button 
            :type="project.isStarred ? 'warning' : 'default'"
            @click="toggleStar"
          >
            <el-icon><Star /></el-icon>
            {{ project.starCount }}
          </el-button>
          <el-button @click="shareProject">
            <el-icon><Share /></el-icon>
            分享
          </el-button>
        </el-button-group>
      </div>
    </div>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="项目概述" name="overview">
        <div class="overview">
          <h3>项目简介</h3>
          <p>{{ project.description }}</p>
          
          <h3>项目目标</h3>
          <ul>
            <li v-for="(goal, index) in project.goals" :key="index">
              {{ goal }}
            </li>
          </ul>

          <h3>成员信息</h3>
          <div class="member-list">
            <div v-for="member in project.members" 
                 :key="member.id"
                 class="member-item"
            >
              <el-avatar :src="member.avatar" :size="40" />
              <div class="member-info">
                <span class="name">{{ member.name }}</span>
                <span class="role">{{ member.role }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="任务看板" name="tasks">
        <div class="task-board">
          <el-row :gutter="20">
            <el-col :span="8" v-for="status in taskStatus" :key="status.value">
              <div class="task-column">
                <div class="column-header">
                  <h4>{{ status.label }}</h4>
                  <el-button 
                    v-if="canEdit" 
                    size="small"
                    @click="addTask(status.value)"
                  >
                    添加任务
                  </el-button>
                </div>
                <draggable
                  v-model="taskGroups[status.value]"
                  group="tasks"
                  :animation="200"
                  @end="handleTaskMove"
                >
                  <template #item="{ element }">
                    <div class="task-card">
                      <h5>{{ element.title }}</h5>
                      <p>{{ element.description }}</p>
                      <div class="task-meta">
                        <el-avatar :size="24" :src="element.assignee.avatar" />
                        <el-tag size="small">{{ element.priority }}</el-tag>
                      </div>
                    </div>
                  </template>
                </draggable>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>

      <el-tab-pane label="进度报告" name="reports">
        <div class="reports">
          <el-timeline>
            <el-timeline-item
              v-for="report in project.reports"
              :key="report.id"
              :timestamp="formatTime(report.createTime)"
              :type="report.type"
            >
              <h4>{{ report.title }}</h4>
              <p>{{ report.content }}</p>
              <div class="report-attachments" v-if="report.attachments?.length">
                <el-link 
                  v-for="file in report.attachments"
                  :key="file.id"
                  :href="file.url"
                  target="_blank"
                >
                  {{ file.name }}
                </el-link>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
// ... script implementation will be added in the next message ...
</script>

<style scoped>
.project-detail {
  padding: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.project-info h2 {
  margin: 0 0 10px 0;
}

.tags {
  display: flex;
  gap: 5px;
}

.member-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 10px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.member-info {
  display: flex;
  flex-direction: column;
}

.member-info .role {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.task-column {
  background: var(--el-bg-color-page);
  border-radius: 4px;
  padding: 15px;
  min-height: 400px;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.task-card {
  background: white;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: move;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.reports {
  padding: 20px 0;
}

.report-attachments {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
</style>
