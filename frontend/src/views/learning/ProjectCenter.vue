<template>
  <div class="project-center">
    <el-row :gutter="20" class="project-header">
      <el-col :span="16">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="我的项目" name="my">
            <project-list :projects="myProjects" @select="handleProjectSelect" />
          </el-tab-pane>
          <el-tab-pane label="项目广场" name="public">
            <project-list :projects="publicProjects" @select="handleProjectSelect" />
          </el-tab-pane>
          <el-tab-pane label="创新竞赛" name="competition">
            <competition-list :competitions="competitions" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="8">
        <div class="action-panel">
          <el-button type="primary" @click="createProject">
            创建新项目
            <el-icon><Plus /></el-icon>
          </el-button>
          <el-button @click="joinProject">
            加入项目
            <el-icon><Link /></el-icon>
          </el-button>
        </div>
      </el-col>
    </el-row>

    <el-drawer
      v-model="projectDetailVisible"
      direction="rtl"
      size="50%"
      :title="selectedProject?.name"
    >
      <project-detail
        v-if="selectedProject"
        :project="selectedProject"
        @update="handleProjectUpdate"
      />
    </el-drawer>

    <el-dialog
      v-model="createProjectDialogVisible"
      title="创建新项目"
      width="60%"
    >
      <project-form
        ref="projectForm"
        :initial-data="newProjectData"
        @submit="handleProjectCreate"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Plus, Link } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import ProjectList from './components/ProjectList.vue';
import ProjectDetail from './components/ProjectDetail.vue';
import ProjectForm from './components/ProjectForm.vue';
import CompetitionList from './components/CompetitionList.vue';
import { useProjectStore } from '@/store/project';

const projectStore = useProjectStore();
const activeTab = ref('my');
const projectDetailVisible = ref(false);
const createProjectDialogVisible = ref(false);
const selectedProject = ref(null);
const newProjectData = ref({
  name: '',
  description: '',
  type: 'research',
  tags: [],
  visibility: 'public'
});

// 项目列表数据
const myProjects = ref([]);
const publicProjects = ref([]);
const competitions = ref([]);

// 加载数据
onMounted(async () => {
  try {
    myProjects.value = await projectStore.getMyProjects();
    publicProjects.value = await projectStore.getPublicProjects();
    competitions.value = await projectStore.getCompetitions();
  } catch (error) {
    ElMessage.error('加载项目数据失败');
    console.error(error);
  }
});

// 事件处理
const handleProjectSelect = (project) => {
  selectedProject.value = project;
  projectDetailVisible.value = true;
};

const createProject = () => {
  newProjectData.value = {
    name: '',
    description: '',
    type: 'research',
    tags: [],
    visibility: 'public'
  };
  createProjectDialogVisible.value = true;
};

const joinProject = () => {
  // TODO: 实现加入项目的逻辑
};

const handleProjectCreate = async (projectData) => {
  try {
    const newProject = await projectStore.createProject(projectData);
    myProjects.value.unshift(newProject);
    createProjectDialogVisible.value = false;
    ElMessage.success('创建项目成功');
  } catch (error) {
    ElMessage.error('创建项目失败');
    console.error(error);
  }
};

const handleProjectUpdate = async (project) => {
  try {
    await projectStore.updateProject(project);
    const index = myProjects.value.findIndex(p => p.id === project.id);
    if (index !== -1) {
      myProjects.value[index] = project;
    }
    ElMessage.success('更新项目成功');
  } catch (error) {
    ElMessage.error('更新项目失败');
    console.error(error);
  }
};
</script>

<style scoped>
.project-center {
  padding: 20px;
}

.project-header {
  margin-bottom: 20px;
}

.action-panel {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 10px;
}

:deep(.el-tabs__content) {
  padding: 20px 0;
}
</style>
