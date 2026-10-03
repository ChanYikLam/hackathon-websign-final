<template>
  <header class="app-header" role="navigation" aria-label="主导航">
    <div class="app-header__container">
      <div class="app-header__left">
        <router-link to="/" class="app-header__logo">
          <span class="app-header__logo-icon">S</span>
          <span class="app-header__logo-text">SoloPilot</span>
        </router-link>
      </div>
      <nav class="app-header__nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="app-header__nav-item"
          :class="{ 'app-header__nav-item--active': isActive(item.path) }"
        >
          <Icon :icon="item.icon" />
          {{ item.name }}
        </router-link>
      </nav>
      <div class="app-header__right">
        <ThemeToggle />
        <template v-if="isLoggedIn">
          <button
            v-if="isDemoMode"
            class="app-header__demo-exit"
            @click="handleExitDemo"
          >
            退出演示
          </button>
          <span v-else class="app-header__user">{{ user?.nickname || '用户' }}</span>
        </template>
        <template v-else>
          <router-link to="/login" class="app-header__login-link">登录</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const route = useRoute()
const authStore = useAuthStore()

const navItems = [
  { name: '首页', path: '/', icon: 'mdi:home' },
  { name: '创业测评', path: '/info-collect-intro', icon: 'mdi:clipboard-check' },
  { name: '我的方案', path: '/result', icon: 'mdi:text-box' },
  { name: 'AI团队', path: '/ai-team', icon: 'mdi:robot' },
  { name: '合规复盘', path: '/compliance', icon: 'mdi:shield-check' }
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const isLoggedIn = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const isDemoMode = computed(() => authStore.isDemoMode)

const handleExitDemo = () => {
  authStore.deactivateDemo()
  window.location.href = '/'
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/responsive';

.app-header {
  position: sticky;
  top: 0;
  z-index: $z-header;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba($color-brand-primary, 0.08);

  [data-theme="dark"] & {
    background: rgba(15, 23, 42, 0.9);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    padding: 0 $space-xl;
    max-width: 1200px;
    margin: 0 auto;

    @include mobile {
      display: none;
    }
  }

  &__left {
    display: flex;
    align-items: center;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: $space-sm;
    text-decoration: none;
    transition: opacity $transition-fast;

    &:hover {
      opacity: 0.8;
    }
  }

  &__logo-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, $color-brand-primary 0%, $color-brand-accent 100%);
    color: white;
    font-size: $text-lg;
    font-weight: 800;
    border-radius: $radius-lg;
    box-shadow: 0 4px 12px rgba($color-brand-primary, 0.3);
  }

  &__logo-text {
    font-size: $text-xl;
    font-weight: 700;
    color: $color-gray-900;
    letter-spacing: -0.5px;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: $space-xs;

    @include tablet {
      gap: $space-xs;
    }
  }

  &__nav-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: $text-sm;
    color: $color-gray-600;
    text-decoration: none;
    padding: $space-sm $space-md;
    border-radius: $radius-md;
    transition: all $transition-fast;
    font-weight: 500;

    &:hover {
      background-color: $color-gray-100;
      color: $color-gray-900;

      [data-theme="dark"] & {
        background-color: rgba(255, 255, 255, 0.1);
        color: #F8FAFC;
      }
    }

    &--active {
      background-color: $color-brand-primary-light;
      color: $color-brand-primary;
      font-weight: 600;

      [data-theme="dark"] & {
        background-color: rgba(99, 102, 241, 0.2);
        color: #818CF8;
      }

      &:hover {
        background-color: $color-brand-primary-light;
        color: $color-brand-primary;

        [data-theme="dark"] & {
          background-color: rgba(99, 102, 241, 0.2);
          color: #818CF8;
        }
      }
    }

    :deep(.iconify) {
      font-size: 18px;
    }
  }

  &__right {
    display: flex;
    align-items: center;
    gap: $space-md;
  }

  &__user {
    font-size: $text-sm;
    color: $color-gray-700;
    font-weight: 500;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &__demo-exit {
    font-size: $text-xs;
    color: $color-gray-500;
    font-weight: 500;
    padding: $space-xs $space-sm;
    border: 1px solid $color-gray-200;
    border-radius: $radius-full;
    background: transparent;
    cursor: pointer;
    transition: all $transition-fast;

    [data-theme="dark"] & {
      color: #94A3B8;
      border-color: #334155;
    }

    &:hover {
      color: $color-error;
      border-color: $color-error;
      background: rgba($color-error, 0.05);

      [data-theme="dark"] & {
        background: rgba($color-error, 0.15);
      }
    }
  }

  &__login-link {
    font-size: $text-sm;
    color: white;
    text-decoration: none;
    font-weight: 600;
    padding: $space-sm $space-lg;
    background: linear-gradient(135deg, $color-brand-primary 0%, $color-brand-accent 100%);
    border-radius: $radius-full;
    transition: all $transition-fast;
    box-shadow: 0 4px 12px rgba($color-brand-primary, 0.25);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba($color-brand-primary, 0.35);
    }
  }
}
</style>
