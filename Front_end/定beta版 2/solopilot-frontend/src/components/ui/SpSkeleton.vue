<template>
  <div class="sp-skeleton" :class="{ 'sp-skeleton--circle': circle }" :style="skeletonStyle">
    <div class="sp-skeleton__shimmer"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  width?: string
  height?: string
  circle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '20px',
  circle: false
})

const skeletonStyle = computed(() => ({
  width: props.circle ? props.height : props.width,
  height: props.height
}))
</script>

<style lang="scss" scoped>
.sp-skeleton {
  position: relative;
  overflow: hidden;
  background: $color-gray-100;
  border-radius: $radius-lg;

  [data-theme="dark"] & {
    background: #334155;
  }

  &--circle {
    border-radius: 50%;
  }

  &__shimmer {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.6),
      transparent
    );
    animation: shimmer 1.5s infinite;

    [data-theme="dark"] & {
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.1),
        transparent
      );
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
