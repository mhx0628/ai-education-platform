export const branchConfig = {
  core: {
    branch: 'feature/core-module',
    status: 'in-progress',
    dependencies: []
  },
  activity: {
    branch: 'feature/activity-platform',
    status: 'pending',
    dependencies: ['core']
  },
  learning: {
    branch: 'feature/learning-center',
    status: 'pending',
    dependencies: ['core']
  },
  ailab: {
    branch: 'feature/ai-integration',
    status: 'pending',
    dependencies: ['core']
  },
  campus: {
    branch: 'feature/campus-brain',
    status: 'pending',
    dependencies: ['core', 'ailab']
  }
};
