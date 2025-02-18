import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    sidebar: {
      opened: true,
      withoutAnimation: false
    },
    layout: {
      showNavbar: true,
      showFooter: true,
      showBreadcrumb: true
    },
    theme: {
      mode: 'light',
      primary: '#1890ff'
    }
  }),

  actions: {
    toggleSidebar() {
      this.sidebar.opened = !this.sidebar.opened;
    },
    closeSidebar() {
      this.sidebar.opened = false;
    },
    toggleTheme() {
      this.theme.mode = this.theme.mode === 'light' ? 'dark' : 'light';
      // 持久化主题设置
      localStorage.setItem('theme', this.theme.mode);
    },
    initTheme() {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.theme.mode = savedTheme;
      }
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'app',
        storage: localStorage,
        paths: ['theme', 'sidebar']
      }
    ]
  }
});
