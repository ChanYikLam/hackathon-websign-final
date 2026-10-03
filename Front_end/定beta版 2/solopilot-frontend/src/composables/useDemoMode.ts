import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useDemoMode() {
  const authStore = useAuthStore()

  const isDemoMode = computed(() => authStore.isDemoMode)
  const isAuthenticated = computed(() => authStore.isAuthenticated)

  const activateDemo = (code: string) => {
    return authStore.activateDemo(code)
  }

  const deactivateDemo = () => {
    authStore.deactivateDemo()
  }

  return {
    isDemoMode,
    isAuthenticated,
    activateDemo,
    deactivateDemo
  }
}
