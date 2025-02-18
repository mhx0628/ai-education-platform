import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue')
      },
      {
        path: 'activities',
        name: 'Activities',
        component: () => import('../views/Activities.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        meta: { requiresAuth: true },
        component: () => import('../views/Profile.vue')
      },
      {
        path: 'learning',
        name: 'Learning',
        meta: { requiresAuth: true },
        component: () => import('../views/learning/LearningCenter.vue')
      },
      {
        path: 'teacher',
        meta: { roles: ['teacher', 'admin'] },
        component: () => import('../views/teacher/TeacherDashboard.vue'),
        children: [
          {
            path: 'lessons',
            name: 'TeacherLessons',
            component: () => import('../views/teacher/Lessons.vue')
          },
          {
            path: 'ai-assistant',
            name: 'TeacherAIAssistant',
            component: () => import('../views/teacher/AIAssistant.vue')
          }
        ]
      },
      {
        path: 'student',
        meta: { roles: ['student'] },
        component: () => import('../views/student/StudentDashboard.vue'),
        children: [
          {
            path: 'challenges',
            name: 'StudentChallenges',
            component: () => import('../views/student/Challenges.vue')
          },
          {
            path: 'portfolio',
            name: 'StudentPortfolio',
            component: () => import('../views/student/Portfolio.vue')
          }
        ]
      },
      {
        path: 'community',
        name: 'Community',
        component: () => import('../views/community/CommunityHome.vue')
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('../layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('../views/auth/Login.vue')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('../views/auth/Register.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth/login');
  } else {
    next();
  }
});

export default router;
