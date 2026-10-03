import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export const useAppStore = defineStore('app', () => {
  const isOnline = ref(navigator.onLine)
  const isLoading = ref(false)
  const toastVisible = ref(false)
  const toastMessage = ref('')
  const toastType = ref<ToastType>('info')
  const isDarkMode = ref(localStorage.getItem('theme') === 'dark')
  let toastTimer: ReturnType<typeof setTimeout> | null = null
  let networkListenersInitialized = false

  const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    if (toastTimer !== null) {
      clearTimeout(toastTimer)
      toastTimer = null
    }

    toastMessage.value = message
    toastType.value = type
    toastVisible.value = true

    toastTimer = setTimeout(() => {
      toastVisible.value = false
      toastTimer = null
    }, duration)
  }

  const hideToast = () => {
    if (toastTimer !== null) {
      clearTimeout(toastTimer)
      toastTimer = null
    }
    toastVisible.value = false
  }

  const setOnline = (online: boolean) => {
    isOnline.value = online
    if (!online) {
      showToast('网络连接已断开，请检查网络', 'warning')
    }
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
    applyTheme()
  }

  const applyTheme = () => {
    if (isDarkMode.value) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    isDarkMode.value = savedTheme === 'dark'
    applyTheme()
  }

  const initNetworkListener = () => {
    if (networkListenersInitialized) return
    networkListenersInitialized = true

    window.addEventListener('online', () => setOnline(true))
    window.addEventListener('offline', () => setOnline(false))
  }

  return {
    isOnline,
    isLoading,
    toastVisible,
    toastMessage,
    toastType,
    isDarkMode,
    showToast,
    hideToast,
    setOnline,
    setLoading,
    toggleTheme,
    applyTheme,
    initTheme,
    initNetworkListener
  }
})
