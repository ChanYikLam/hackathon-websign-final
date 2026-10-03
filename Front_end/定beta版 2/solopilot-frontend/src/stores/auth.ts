import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { encryptToken, decryptToken } from '@/utils/crypto'

interface User {
  id: number | string
  nickname: string
  avatar: string | null
  phone?: string
}

export const useAuthStore = defineStore('auth', () => {
  // 从 localStorage 读取并解密 token
  const storedToken = localStorage.getItem('token')
  const token = ref<string | null>(
    storedToken ? decryptToken(storedToken) || storedToken : null
  )
  const user = ref<User | null>(null)
  const isDemoMode = ref(localStorage.getItem('demo_mode') === 'active')

  const isAuthenticated = computed(() => !!token.value || isDemoMode.value)

  const activateDemo = (code: string): { success: boolean; error?: string } => {
    if (code === '8888') {
      isDemoMode.value = true
      user.value = { id: 'demo-user', nickname: 'Demo 用户', avatar: null }
      localStorage.setItem('demo_mode', 'active')
      // 清除旧的测试数据，确保全新的测试流程
      localStorage.removeItem('mbti')
      localStorage.removeItem('info_collect')
      localStorage.removeItem('result')
      return { success: true }
    }
    return { success: false, error: '无效的开发者码' }
  }

  const deactivateDemo = () => {
    isDemoMode.value = false
    user.value = null
    localStorage.removeItem('demo_mode')
    localStorage.removeItem('mbti')
    localStorage.removeItem('info_collect')
    localStorage.removeItem('result')
  }

  const saveToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', encryptToken(newToken))
  }

  const setToken = (newToken: string) => {
    saveToken(newToken)
  }

  const setUser = (newUser: User) => {
    user.value = newUser
  }

  const login = (newToken: string, newUser: User) => {
    saveToken(newToken)
    user.value = newUser
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  const initFromStorage = () => {
    const storedToken = localStorage.getItem('token')
    const storedDemoMode = localStorage.getItem('demo_mode')
    if (storedToken) {
      token.value = decryptToken(storedToken) || storedToken
    }
    if (storedDemoMode === 'active') {
      isDemoMode.value = true
      user.value = { id: 'demo-user', nickname: 'Demo 用户', avatar: null }
      // 清除旧的测试数据，确保全新的测试流程
      localStorage.removeItem('mbti')
      localStorage.removeItem('info_collect')
      localStorage.removeItem('result')
    }
  }

  return {
    token,
    user,
    isDemoMode,
    isAuthenticated,
    activateDemo,
    deactivateDemo,
    setToken,
    setUser,
    login,
    logout,
    initFromStorage
  }
})
