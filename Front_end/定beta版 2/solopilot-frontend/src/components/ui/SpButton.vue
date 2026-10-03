<template>
  <button
    :class="[
      'sp-button',
      `sp-button--${variant}`,
      `sp-button--${size}`,
      { 'sp-button--disabled': disabled || loading }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="sp-button__spinner"></span>
    <span class="sp-button__content" :class="{ 'sp-button__content--hidden': loading }">
      <slot></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>

<style lang="scss" scoped>
.sp-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border-radius: $radius-lg;
  transition: all $transition-fast;
  cursor: pointer;
  border: none;
  outline: none;
  white-space: nowrap;
  letter-spacing: -0.01em;

  &--primary {
    background: linear-gradient(135deg, $color-brand-primary 0%, #818CF8 100%);
    color: white;
    box-shadow: 0 4px 14px rgba($color-brand-primary, 0.35);

    &:hover:not(.sp-button--disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba($color-brand-primary, 0.45);
    }

    &:active:not(.sp-button--disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba($color-brand-primary, 0.3);
    }

    &:focus-visible {
      box-shadow: 0 0 0 3px $color-brand-primary-light, 0 0 0 5px $color-brand-primary;
    }
  }

  &--secondary {
    background: white;
    color: $color-gray-700;
    border: 1.5px solid $color-gray-200;
    box-shadow: $shadow-sm;

    [data-theme="dark"] & {
      background: #1E293B;
      color: #E2E8F0;
      border-color: #334155;
    }

    &:hover:not(.sp-button--disabled) {
      border-color: $color-brand-primary;
      color: $color-brand-primary;
      background: $color-brand-primary-light;

      [data-theme="dark"] & {
        border-color: #818CF8;
        color: #818CF8;
        background: rgba(99, 102, 241, 0.2);
      }
    }
  }

  &--ghost {
    background-color: transparent;
    color: $color-brand-primary;

    [data-theme="dark"] & {
      color: #818CF8;
    }

    &:hover:not(.sp-button--disabled) {
      background-color: $color-brand-primary-light;

      [data-theme="dark"] & {
        background-color: rgba(99, 102, 241, 0.2);
      }
    }
  }

  &--danger {
    background: linear-gradient(135deg, $color-error 0%, #F87171 100%);
    color: white;
    box-shadow: 0 4px 14px rgba($color-error, 0.35);

    &:hover:not(.sp-button--disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba($color-error, 0.45);
    }
  }

  &--sm {
    height: 32px;
    padding: 0 14px;
    font-size: $text-sm;
    border-radius: $radius-md;
  }

  &--md {
    height: 42px;
    padding: 0 18px;
    font-size: $text-sm;
    border-radius: $radius-lg;
  }

  &--lg {
    height: 50px;
    padding: 0 28px;
    font-size: $text-base;
    border-radius: $radius-xl;
  }

  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;
    transform: none !important;
  }

  &--block {
    width: 100%;
  }

  &__spinner {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  &__content {
    display: inline-flex;
    align-items: center;
    gap: $space-sm;

    &--hidden {
      visibility: hidden;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
