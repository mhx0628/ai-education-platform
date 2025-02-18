<template>
  <div class="learning-community">
    <!-- 学习项目列表 -->
    <div class="projects-section">
      <div class="section-header">
        <h2>学习项目</h2>
        <el-radio-group v-model="projectFilter" size="small">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="programming">编程</el-radio-button>
          <el-radio-button label="art">艺术</el-radio-button>
          <el-radio-button label="language">语言</el-radio-button>
        </el-radio-group>
      </div>

      <div class="project-grid">
        <div v-for="project in filteredProjects" 
             :key="project.id"
             class="project-card"
             @click="viewProject(project)">
          <div class="project-cover">
            <img :src="project.coverImage" :alt="project.title">
            <div class="project-stats">
              <span>{{ project.participants }}人参与</span>
              <span>{{ project.rating }}分</span>
            </div>
          </div>
          <div class="project-info">
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
            <div class="project-tags">
              <el-tag v-for="tag in project.tags" 
                     :key="tag"
                     size="small">
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习挑战区 -->
    <div class="challenges-section">
      <h2>学科挑战</h2>
      <el-tabs v-model="activeSubject">
        <el-tab-pane v-for="subject in subjects"
                     :key="subject.id"
                     :label="subject.name"
                     :name="subject.id">
          <div class="challenge-levels">
            <div v-for="level in subject.levels"
                 :key="level.id"
                 class="level-card"
                 :class="{ 'locked': !level.unlocked }">
              <div class="level-header">
                <span class="level-number">Level {{ level.number }}</span>
                <el-progress :percentage="level.progress" />
              </div>
              <div class="level-content">
                <p>{{ level.description }}</p>
                <el-button 
                  :disabled="!level.unlocked"
                  @click="startChallenge(level)">
                  开始挑战
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
// ... 组件实现代码 ...
</script>

<style scoped>
.learning-community {
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.project-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
  cursor: pointer;
}

.project-card:hover {
  transform: translateY(-4px);
}

// ... 其他样式 ...
</style>
