<template>
  <div class="app-shell">
    <AppHeader />
    <main class="app-shell__main">
      <router-view v-slot="{ Component, route }">
        <component :is="Component" :key="route.path" />
      </router-view>
    </main>
    <AppTabBar />
    <SpToast
      :visible="toastVisible"
      :message="toastMessage"
      :type="toastType"
      @close="closeToast"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppHeader from './AppHeader.vue'
import AppTabBar from './AppTabBar.vue'
import SpToast from '@/components/ui/SpToast.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const toastVisible = computed(() => appStore.toastVisible)
const toastMessage = computed(() => appStore.toastMessage)
const toastType = computed(() => appStore.toastType)

const closeToast = () => {
  appStore.hideToast()
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/responsive';

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__main {
    flex: 1;
    padding-bottom: 0;

    @include mobile {
      padding-bottom: calc(64px + env(safe-area-inset-bottom, 0px));
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
