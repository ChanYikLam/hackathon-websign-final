<template>
  <nav class="app-tab-bar" role="tablist" aria-label="主导航">
    <!-- 引导 Tooltip：首次点击 AI Tab 时显示 -->
    <Transition name="tooltip-fade">
      <div v-if="showTooltip" class="app-tab-bar__tooltip" role="tooltip">
        <p class="app-tab-bar__tooltip-text">点击这里开始配置你的 AI 团队</p>
        <button class="app-tab-bar__tooltip-btn" @click="dismissTooltip">知道了</button>
      </div>
    </Transition>

    <div class="app-tab-bar__tabs">
      <router-link
        v-for="item in tabItems"
        :key="item.path"
        :to="item.path"
        class="app-tab-bar__item"
        :class="{
          'app-tab-bar__item--active': isActive(item.path),
          'app-tab-bar__item--ai': item.isAi
        }"
        role="tab"
        :aria-selected="isActive(item.path)"
        @click="onTabClick(item)"
      >
        <div class="app-tab-bar__icon-wrap">
          <Icon :icon="getIcon(item.path)" class="app-tab-bar__icon" />
          <!-- AI Tab 红点提示（未展示过引导时显示） -->
          <span v-if="item.isAi && !guideStore.aiTabGuideShown" class="app-tab-bar__dot" aria-label="新功能引导"></span>
        </div>
        <span class="app-tab-bar__text">{{ item.name }}</span>
      </router-link>
    </div>
    <button
      class="app-tab-bar__theme-btn"
      @click="appStore.toggleTheme()"
      :aria-label="appStore.isDarkMode ? '切换到浅色模式' : '切换到深色模式'"
    >
      <Icon :icon="appStore.isDarkMode ? 'mdi:weather-sunny' : 'mdi:weather-night'" class="app-tab-bar__theme-icon" />
    </button>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useGuideStore } from '@/stores/guide'

const route = useRoute()
const appStore = useAppStore()
const guideStore = useGuideStore()

// 气泡提示显隐
const showTooltip = ref(false)

const tabItems = [
  { name: '首页', path: '/', isAi: false },
  { name: '测评', path: '/info-collect-intro', isAi: false },
  { name: '方案', path: '/result', isAi: false },
  { name: 'AI', path: '/ai-team', isAi: true },
  { name: '更多', path: '/compliance', isAi: false }
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const getIcon = (path: string) => {
  const icons: Record<string, string> = {
    '/': 'mdi:home',
    '/info-collect-intro': 'mdi:clipboard-check',
    '/result': 'mdi:text-box',
    '/ai-team': 'mdi:robot',
    '/compliance': 'mdi:dots-horizontal'
  }
  return icons[path] || 'mdi:circle'
}

const onTabClick = (item: { isAi: boolean }) => {
  // 仅 AI Tab 且引导未展示过时显示气泡
  if (item.isAi && !guideStore.aiTabGuideShown) {
    showTooltip.value = true
  }
}

const dismissTooltip = () => {
  showTooltip.value = false
  guideStore.markAiTabGuideShown()
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/responsive';

.app-tab-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba($color-brand-primary, 0.08);
  z-index: $z-header;
  padding-bottom: env(safe-area-inset-bottom);

  [data-theme="dark"] & {
    background: rgba(15, 23, 42, 0.95);
    border-top-color: rgba(255, 255, 255, 0.1);
  }

  @include mobile {
    display: flex;
    align-items: center;
    padding: 0 8px;
  }

  &__tabs {
    flex: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    padding: $space-sm;
    text-decoration: none;
    color: $color-gray-500;
    transition: all $transition-fast;
    min-width: 48px;
    min-height: 44px;
    border-radius: $radius-md;

    &:hover {
      background: $color-gray-100;

      [data-theme="dark"] & {
        background: rgba(255, 255, 255, 0.1);
      }
    }

    &--active {
      color: $color-brand-primary;

      [data-theme="dark"] & {
        color: #818CF8;
      }

      .app-tab-bar__icon {
        transform: scale(1.1);
      }
    }
  }

  &__icon-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__dot {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 10px;
    height: 10px;
    background: #EF4444;
    border-radius: 50%;
    border: 2px solid white;
    animation: dotPulse 1.5s ease-in-out infinite;

    [data-theme="dark"] & {
      border-color: #1E293B;
    }
  }

  &__icon {
    font-size: 22px;
    transition: transform $transition-fast;
    display: block;
    width: 22px;
    height: 22px;
    overflow: visible;

    :deep(svg) {
      display: block;
      width: 22px !important;
      height: 22px !important;
    }
  }

  &__text {
    font-size: 10px;
    font-weight: 500;
  }

  &__theme-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: $radius-full;
    background: $color-gray-100;
    border: none;
    cursor: pointer;
    transition: all $transition-fast;
    flex-shrink: 0;
    margin-left: 4px;

    [data-theme="dark"] & {
      background: rgba(255, 255, 255, 0.12);
    }

    &:active {
      transform: scale(0.9);
    }
  }

  &__theme-icon {
    font-size: 20px;
    color: $color-gray-600;
    transition: color $transition-fast, transform $transition-normal;

    [data-theme="dark"] & {
      color: #FBBF24;
      transform: rotate(360deg);
    }
  }

  // ---------- 引导 Tooltip ----------
  &__tooltip {
    position: absolute;
    bottom: calc(100% + 12px);
    left: 50%;
    transform: translateX(-50%);
    background: $color-gray-900;
    border-radius: $radius-lg;
    padding: $space-md $space-lg;
    min-width: 200px;
    max-width: 260px;
    text-align: center;
    box-shadow: $shadow-lg;
    z-index: 100;

    [data-theme="dark"] & {
      background: #F8FAFC;
    }

    // 小三角箭头
    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 6px solid transparent;
      border-top-color: $color-gray-900;

      [data-theme="dark"] & {
        border-top-color: #F8FAFC;
      }
    }
  }

  &__tooltip-text {
    font-size: $text-sm;
    color: white;
    margin-bottom: $space-sm;
    line-height: 1.5;

    [data-theme="dark"] & {
      color: $color-gray-900;
    }
  }

  &__tooltip-btn {
    font-size: $text-xs;
    font-weight: 700;
    color: $color-brand-primary;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: opacity $transition-fast;

    &:hover {
      opacity: 0.7;
    }
  }
}

// ---------- Tooltip 过渡动画 ----------
.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(6px);
}

.tooltip-fade-enter-to,
.tooltip-fade-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

// ---------- 红点脉冲动画 ----------
@keyframes dotPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.7;
  }
}
</style>
