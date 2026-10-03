<template>
  <div class="sp-rating" role="radiogroup" :aria-label="label">
    <button
      v-for="star in max"
      :key="star"
      type="button"
      :class="['sp-rating__star', { 'sp-rating__star--active': star <= modelValue }]"
      :aria-label="`${star}星`"
      :aria-checked="star === modelValue"
      role="radio"
      @click="selectStar(star)"
    >
      <Icon :icon="star <= modelValue ? 'mdi:star' : 'mdi:star-outline'" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  modelValue: number
  max?: number
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  max: 5,
  label: '评分'
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const selectStar = (star: number) => {
  emit('update:modelValue', star)
}
</script>

<style lang="scss" scoped>
.sp-rating {
  display: inline-flex;
  gap: $space-sm;

  &__star {
    font-size: 36px;
    color: $color-gray-200;
    transition: all $transition-fast;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;

    [data-theme="dark"] & {
      color: #475569;
    }

    &:hover {
      transform: scale(1.15);
    }

    &--active {
      color: $color-warning;
      filter: drop-shadow(0 2px 4px rgba($color-warning, 0.3));

      [data-theme="dark"] & {
        color: #FBBF24;
        filter: drop-shadow(0 2px 4px rgba(251, 191, 36, 0.4));
      }
    }
  }
}
</style>
