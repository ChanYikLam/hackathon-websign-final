<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="sp-modal__overlay" @click.self="handleOverlayClick">
        <div
          class="sp-modal"
          role="dialog"
          :aria-labelledby="titleId"
          aria-modal="true"
        >
          <div class="sp-modal__header">
            <h3 :id="titleId" class="sp-modal__title">{{ title }}</h3>
            <button class="sp-modal__close" @click="close" aria-label="关闭">
              <Icon icon="mdi:close" />
            </button>
          </div>
          <div class="sp-modal__body">
            <slot></slot>
          </div>
          <div v-if="$slots.footer" class="sp-modal__footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useId } from 'vue'

interface Props {
  visible: boolean
  title: string
  closeOnOverlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  closeOnOverlay: true
})

const emit = defineEmits<{
  close: []
}>()

const titleId = `modal-title-${useId()}`

const close = () => {
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    close()
  }
}
</script>

<style lang="scss" scoped>
.sp-modal {
  &__overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba($color-gray-900, 0.6);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: $z-modal-overlay;
    padding: $space-xl;

    [data-theme="dark"] & {
      background: rgba(15, 23, 42, 0.8);
    }
  }

  &__container {
    background: white;
    border-radius: $radius-2xl;
    box-shadow: $shadow-xl;
    max-width: 480px;
    width: 100%;
    max-height: calc(100vh - #{$space-xl * 2});
    overflow: hidden;
    display: flex;
    flex-direction: column;

    [data-theme="dark"] & {
      background: #1E293B;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $space-xl;
    border-bottom: 1px solid $color-gray-100;

    [data-theme="dark"] & {
      border-color: rgba(255, 255, 255, 0.1);
    }
  }

  &__title {
    font-size: $text-lg;
    font-weight: 700;
    color: $color-gray-900;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: $space-sm;
    color: $color-gray-500;
    border-radius: $radius-lg;
    transition: all $transition-fast;

    [data-theme="dark"] & {
      color: #94A3B8;
    }

    &:hover {
      background: $color-gray-100;
      color: $color-gray-700;

      [data-theme="dark"] & {
        background: rgba(255, 255, 255, 0.1);
        color: #F8FAFC;
      }
    }
  }

  &__body {
    padding: $space-xl;
    overflow-y: auto;
  }

  &__footer {
    padding: $space-xl;
    border-top: 1px solid $color-gray-100;
    display: flex;
    gap: $space-md;
    justify-content: flex-end;
    background: $color-gray-50;

    [data-theme="dark"] & {
      background: #0F172A;
      border-color: rgba(255, 255, 255, 0.1);
    }
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;

  .sp-modal {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .sp-modal {
    transform: scale(0.9);
  }
}
</style>
