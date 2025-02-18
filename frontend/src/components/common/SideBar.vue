<template>
  <div class="side-bar" :class="{ collapsed: isCollapsed }">
    <div class="ai-tools">
      <el-tooltip
        v-for="tool in aiTools"
        :key="tool.id"
        :content="tool.name"
        placement="right"
      >
        <div
          class="tool-button"
          :class="{ active: currentTool === tool.id }"
          @click="selectTool(tool)"
        >
          <el-icon>
            <component :is="tool.icon" />
          </el-icon>
          <span v-show="!isCollapsed">{{ tool.name }}</span>
        </div>
      </el-tooltip>
    </div>

    <div class="tool-content" v-if="currentTool && !isCollapsed">
      <div class="grid-layout">
        <template v-for="item in currentToolItems" :key="item.id">
          <el-card class="tool-card" @click="openTool(item)">
            <img :src="item.thumbnail" :alt="item.name">
            <div class="tool-info">
              <h4>{{ item.name }}</h4>
              <p>{{ item.description }}</p>
            </div>
          </el-card>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();
const currentTool = ref(null);

const isCollapsed = computed(() => !appStore.sidebar.opened);

const aiTools = [
  { id: 'interaction', name: 'AI交互', icon: 'Chat' },
  { id: 'image', name: 'AI生图', icon: 'Picture' },
  { id: 'video', name: 'AI视频', icon: 'VideoPlay' },
  { id: 'music', name: 'AI音乐', icon: 'Headset' },
  { id: 'coding', name: 'AI编程', icon: 'Terminal' },
  { id: 'comprehensive', name: 'AI综合', icon: 'Grid' }
];

const currentToolItems = computed(() => {
  // 根据当前选中的工具获取对应的九宫格内容
  return toolItemsMap[currentTool.value] || [];
});

const selectTool = (tool) => {
  currentTool.value = tool.id;
};

const openTool = (item) => {
  window.open(item.url, '_blank');
};
</script>

<style scoped>
.side-bar {
  width: 240px;
  height: 100%;
  background: #f5f7fa;
  transition: width 0.3s;
}

.collapsed {
  width: 64px;
}

.tool-button {
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.tool-button:hover {
  background: #e6f7ff;
}

.grid-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 16px;
}

.tool-card {
  cursor: pointer;
  transition: all 0.3s;
}

.tool-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
