import { createPinia } from 'pinia';
import { useUserStore } from './user';
import { useLearningStore } from './learning';
import { useAIStore } from './ai';

const pinia = createPinia();

// 数据持久化插件
pinia.use(({ store }) => {
  const initialState = localStorage.getItem(store.$id);
  if (initialState) {
    store.$patch(JSON.parse(initialState));
  }

  store.$subscribe((mutation, state) => {
    localStorage.setItem(store.$id, JSON.stringify(state));
  });
});

export { useUserStore, useLearningStore, useAIStore };
export default pinia;
