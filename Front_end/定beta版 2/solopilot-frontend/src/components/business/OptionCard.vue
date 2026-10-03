<template>
  <button
    :class="['option-card', { 'option-card--selected': selected }]"
    @click="handleClick"
  >
    <span v-if="icon" class="option-card__icon">
      <Icon :icon="icon" />
    </span>
    <span class="option-card__label">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  label: string
  selected?: boolean
  icon?: string
}

withDefaults(defineProps<Props>(), {
  selected: false
})

const emit = defineEmits<{
  select: []
}>()

const handleClick = () => {
  emit('select')
}
</script>

<style lang="scss" scoped>
.option-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $space-sm;
  padding: $space-lg;
  min-height: 90px;
  background: white;
  border: 2px solid $color-gray-200;
  border-radius: $radius-xl;
  cursor: pointer;
  transition: all $transition-fast;
  text-align: center;
  box-shadow: $shadow-sm;

  [data-theme="dark"] & {
    background: #1E293B;
    border-color: #334155;
  }

  &:hover {
    border-color: $color-brand-primary;
    background: $color-brand-primary-light;
    transform: translateY(-2px);
    box-shadow: $shadow-md;

    [data-theme="dark"] & {
      border-color: #6366F1;
      background: rgba(99, 102, 241, 0.2);
    }
  }

  &--selected {
    border-color: $color-brand-primary;
    background: linear-gradient(135deg, $color-brand-primary-light 0%, white 100%);
    animation: selectPulse 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 0 0 3px rgba($color-brand-primary, 0.1);

    [data-theme="dark"] & {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, #1E293B 100%);
    }
  }

  &__icon {
    font-size: 28px;
    color: $color-gray-500;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &--selected &__icon {
    color: $color-brand-primary;
  }

  &__label {
    font-size: $text-sm;
    color: $color-gray-700;
    font-weight: 500;
    line-height: 1.4;

    [data-theme="dark"] & {
      color: #E2E8F0;
    }
  }

  &--selected &__label {
    color: $color-brand-primary;
    font-weight: 600;
  }
}

@keyframes selectPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.97);
  }
  100% {
    transform: scale(1);
  }
}
</style>
