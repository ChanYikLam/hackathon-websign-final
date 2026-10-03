<template>
  <div :class="['sp-card', { 'sp-card--clickable': clickable }]" @click="handleClick">
    <div v-if="$slots.header" class="sp-card__header">
      <slot name="header"></slot>
    </div>
    <div class="sp-card__body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="sp-card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  clickable: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>

<style lang="scss" scoped>
.sp-card {
  background: white;
  border-radius: $radius-xl;
  box-shadow: $shadow-lg;
  overflow: hidden;
  border: 1px solid rgba($color-brand-primary, 0.06);

  [data-theme="dark"] & {
    background: #1E293B;
    border-color: rgba(255, 255, 255, 0.1);
  }

  &--clickable {
    cursor: pointer;
    transition: all $transition-fast;

    &:hover {
      box-shadow: $shadow-xl;
      transform: translateY(-3px);
      border-color: rgba($color-brand-primary, 0.15);
    }
  }

  &__header {
    padding: $space-lg;
    border-bottom: 1px solid $color-gray-100;
    background: linear-gradient(180deg, $color-gray-50 0%, white 100%);

    [data-theme="dark"] & {
      background: linear-gradient(180deg, #0F172A 0%, #1E293B 100%);
      border-color: rgba(255, 255, 255, 0.1);
    }
  }

  &__body {
    padding: $space-lg;
  }

  &__footer {
    padding: $space-lg;
    border-top: 1px solid $color-gray-100;
    background: $color-gray-50;

    [data-theme="dark"] & {
      background: #0F172A;
      border-color: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
