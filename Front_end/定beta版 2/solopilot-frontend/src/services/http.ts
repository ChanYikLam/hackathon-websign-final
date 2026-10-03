import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

http.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    if (authStore.isDemoMode) {
      config.headers['X-Demo-Mode'] = 'true'
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const appStore = useAppStore()

    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          const authStore = useAuthStore()
          authStore.logout()
          appStore.showToast('登录已过期，请重新登录', 'error')
          window.location.href = '/login'
          break
        case 429:
          appStore.showToast('请求过于频繁，请稍后再试', 'warning')
          break
        case 500:
          appStore.showToast('服务异常，请稍后重试', 'error')
          break
        default:
          appStore.showToast(data?.message || '请求失败', 'error')
      }
    } else if (error.request) {
      appStore.setOnline(false)
      appStore.showToast('网络连接已断开，请检查网络', 'error')
    } else {
      appStore.showToast('请求配置错误', 'error')
    }

    return Promise.reject(error)
  }
)

export default http
