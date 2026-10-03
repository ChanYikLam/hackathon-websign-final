<template>
  <button
    class="theme-toggle"
    @click="handleToggle"
    :aria-label="isDarkMode ? '切换到浅色模式' : '切换到深色模式'"
  >
    <svg
      class="theme-toggle__icon theme-toggle__icon--sun"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
    <svg
      class="theme-toggle__icon theme-toggle__icon--moon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const isDarkMode = computed(() => appStore.isDarkMode)

const handleToggle = () => {
  appStore.toggleTheme()
}
</script>

<style lang="scss" scoped>
.theme-toggle {
  position: relative;
  width: 40px;
  height: 40px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: $radius-lg;
  cursor: pointer;
  transition: background-color $transition-fast;

  &:hover {
    background: var(--color-bg-secondary);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--color-brand-primary);
  }
}

.theme-toggle__icon {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 22px;
  height: 22px;
  transform: translate(-50%, -50%);
  transition: opacity $transition-normal, transform $transition-normal;

  &--sun {
    color: var(--color-text-secondary);

    [data-theme="dark"] & {
      opacity: 0;
      transform: translate(-50%, -50%) rotate(90deg);
    }
  }

  &--moon {
    color: var(--color-text-secondary);
    opacity: 0;
    transform: translate(-50%, -50%) rotate(-90deg);

    [data-theme="dark"] & {
      opacity: 1;
      transform: translate(-50%, -50%) rotate(0);
      color: #F8FAFC;
    }
  }
}

.theme-toggle:hover .theme-toggle__icon--sun {
  color: var(--color-warning);
}

.theme-toggle:hover .theme-toggle__icon--moon {
  color: var(--color-warning);

  [data-theme="dark"] & {
    color: #FBBF24;
  }
}
</style>
