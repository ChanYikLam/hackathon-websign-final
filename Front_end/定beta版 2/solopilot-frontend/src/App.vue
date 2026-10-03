<template>
  <AppShell />
</template>

<script setup lang="ts">
import AppShell from '@/components/layout/AppShell.vue'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

const authStore = useAuthStore()
const appStore = useAppStore()

onMounted(() => {
  authStore.initFromStorage()
  appStore.initTheme()
  appStore.initNetworkListener()
})
</script>
