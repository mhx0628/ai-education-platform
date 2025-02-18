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
        path: 'ai-news',
        name: 'AINews',
        component: () => import('../views/ai-news/AINews.vue')
      },
      {
        path: 'ai-courses',
        name: 'AICourses',
        component: () => import('../views/ai-courses/AICourses.vue')
      }
    ]
  },
  {
    path: '/dashboard',
    component: () => import('../layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'teacher',
        name: 'TeacherDashboard',
        component: () => import('../views/teacher/TeacherDashboard.vue'),
        meta: { roles: ['teacher', 'admin'] },
        children: [
          {
            path: 'lesson-creation',
            name: 'LessonCreation',
            component: () => import('../views/teacher/LessonCreation.vue')
          }
        ]
      },
      {
        path: 'student',
        name: 'StudentDashboard',
        component: () => import('../views/student/StudentDashboard.vue'),
        meta: { roles: ['student'] },
        children: [
          {
            path: 'learning-center',
            name: 'LearningCenter',
            component: () => import('../views/student/LearningCenter.vue')
          }
        ]
      },
      {
        path: 'parent',
        name: 'ParentDashboard',
        component: () => import('../views/parent/ParentDashboard.vue'),
        meta: { roles: ['parent'] }
      },
      {
        path: 'principal',
        name: 'PrincipalDashboard',
        component: () => import('../views/principal/PrincipalDashboard.vue'),
        meta: { roles: ['principal'] }
      },
      {
        path: 'bureau',
        name: 'BureauDashboard',
        component: () => import('../views/bureau/BureauDashboard.vue'),
        meta: { roles: ['bureau_admin'] }
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
      }
    ]
  },
  {
    path: '/community',
    component: () => import('../layouts/CommunityLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'showcase',
        name: 'Showcase',
        component: () => import('../views/community/Showcase.vue')
      },
      {
        path: 'activities',
        name: 'Activities',
        component: () => import('../views/community/Activities.vue')
      }
    ]
  }
];

export default routes;
