<template>
  <div
    class="sp-progress-bar"
    role="progressbar"
    :aria-valuenow="current"
    :aria-valuemin="0"
    :aria-valuemax="total"
  >
    <div class="sp-progress-bar__track">
      <div
        class="sp-progress-bar__fill"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
    <span v-if="showText" class="sp-progress-bar__text">{{ percentage }}%</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  current: number
  total: number
  animated?: boolean
  showText?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  animated: true,
  showText: false
})

const percentage = computed(() => {
  if (props.total === 0) return 0
  return Math.min(Math.round((props.current / props.total) * 100), 100)
})
</script>

<style lang="scss" scoped>
.sp-progress-bar {
  display: flex;
  align-items: center;
  gap: $space-md;

  &__track {
    flex: 1;
    height: 8px;
    background: $color-gray-100;
    border-radius: $radius-full;
    overflow: hidden;

    [data-theme="dark"] & {
      background: #334155;
    }
  }

  &__fill {
    height: 100%;
    background: linear-gradient(90deg, $color-brand-primary 0%, $color-brand-accent 100%);
    border-radius: $radius-full;
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.3) 50%,
        transparent 100%
      );
      animation: shimmer 2s infinite;
    }
  }

  &__text {
    font-size: $text-sm;
    font-weight: 600;
    color: $color-brand-primary;
    min-width: 48px;
    text-align: right;

    [data-theme="dark"] & {
      color: #818CF8;
    }
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
