import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useResultStore } from '@/stores/result'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/intro',
    name: 'Intro',
    component: () => import('@/views/IntroView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/info-collect-intro',
    name: 'InfoCollectIntro',
    component: () => import('@/views/InfoCollectIntroView.vue'),
    meta: { requiresAuth: true, allowDemo: true }
  },
  {
    path: '/info-collect',
    name: 'InfoCollect',
    component: () => import('@/views/InfoCollectView.vue'),
    meta: { requiresAuth: true, allowDemo: true }
  },
  {
    path: '/mbti-intro',
    name: 'MbtiIntro',
    component: () => import('@/views/MbtiIntroView.vue'),
    meta: { requiresAuth: true, allowDemo: true }
  },
  {
    path: '/mbti-test',
    name: 'MbtiTest',
    component: () => import('@/views/MbtiTestView.vue'),
    meta: { requiresAuth: true, allowDemo: true }
  },
  {
    path: '/analyzing',
    name: 'Analyzing',
    component: () => import('@/views/AnalysisLoadingView.vue'),
    meta: { requiresAuth: true, allowDemo: true }
  },
  {
    path: '/result',
    name: 'Result',
    component: () => import('@/views/ResultView.vue'),
    meta: { requiresAuth: true, allowDemo: true }
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: () => import('@/views/FeedbackView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/compliance',
    name: 'Compliance',
    component: () => import('@/views/ComplianceView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/compliance/:scenarioId',
    name: 'ScenarioDetail',
    component: () => import('@/views/ScenarioDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/ai-team',
    name: 'AiTeam',
    component: () => import('@/views/AiTeamView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/review',
    name: 'Review',
    component: () => import('@/views/ReviewView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const resultStore = useResultStore()

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
  }

  if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Home' })
    return
  }

  next()
})

export default router
