<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="visible" class="sp-toast" role="alert" aria-live="polite">
        <div :class="['sp-toast__icon', `sp-toast__icon--${type}`]">
          <Icon v-if="type === 'success'" icon="mdi:check-circle" />
          <Icon v-else-if="type === 'error'" icon="mdi:close-circle" />
          <Icon v-else-if="type === 'warning'" icon="mdi:alert" />
          <Icon v-else icon="mdi:information" />
        </div>
        <div class="sp-toast__content">
          <p class="sp-toast__message">{{ message }}</p>
        </div>
        <button class="sp-toast__close" @click="close" aria-label="关闭">
          <Icon icon="mdi:close" />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  visible: boolean
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 3000
})

const emit = defineEmits<{
  close: []
}>()

const close = () => {
  emit('close')
}
</script>

<style lang="scss" scoped>
.sp-toast {
  position: fixed;
  top: $space-xl;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: $space-md;
  padding: $space-md $space-lg;
  background: white;
  border-radius: $radius-xl;
  box-shadow: $shadow-xl, 0 0 40px rgba(0, 0, 0, 0.08);
  z-index: $z-toast;
  max-width: calc(100vw - #{$space-xl * 2});
  border: 1px solid rgba($color-brand-primary, 0.08);

  [data-theme="dark"] & {
    background: #1E293B;
    border-color: rgba(255, 255, 255, 0.1);
  }

  &__icon {
    font-size: 22px;

    &--success {
      color: $color-brand-accent;
    }

    &--error {
      color: $color-error;
    }

    &--warning {
      color: $color-warning;
    }

    &--info {
      color: $color-brand-primary;
    }
  }

  &__content {
    flex: 1;
  }

  &__message {
    font-size: $text-sm;
    font-weight: 500;
    color: $color-gray-700;

    [data-theme="dark"] & {
      color: #E2E8F0;
    }
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: $space-xs;
    color: $color-gray-400;
    border-radius: $radius-md;
    transition: all $transition-fast;

    &:hover {
      background: $color-gray-100;
      color: $color-gray-600;

      [data-theme="dark"] & {
        background: rgba(255, 255, 255, 0.1);
        color: #E2E8F0;
      }
    }
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px) scale(0.9);
}
</style>
