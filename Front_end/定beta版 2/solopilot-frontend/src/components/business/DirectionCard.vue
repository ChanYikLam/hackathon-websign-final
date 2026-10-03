<template>
  <div :class="['direction-card', { 'direction-card--expanded': expanded }]">
    <div class="direction-card__header" @click="toggle">
      <div class="direction-card__rank">推荐 {{ rank }}</div>
      <div class="direction-card__info">
        <h3 class="direction-card__title">{{ title }}</h3>
        <div class="direction-card__match">
          <MatchProgress :percentage="matchRate" />
          <span class="direction-card__match-text">匹配度 {{ matchRate }}%</span>
        </div>
      </div>
      <Icon :icon="expanded ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="direction-card__arrow" />
    </div>
    <Transition name="expand">
      <div v-if="expanded" class="direction-card__body">
        <div class="direction-card__section">
          <h4 class="direction-card__section-title">为什么适合你</h4>
          <p class="direction-card__section-content">{{ reason }}</p>
        </div>
        <div class="direction-card__section">
          <h4 class="direction-card__section-title">预期收入</h4>
          <p class="direction-card__section-content direction-card__income">{{ incomeRange }}</p>
        </div>
        <div class="direction-card__section">
          <h4 class="direction-card__section-title">参考案例</h4>
          <p class="direction-card__section-content">{{ caseBrief }}</p>
        </div>
        <div class="direction-card__section">
          <h4 class="direction-card__section-title">启动建议</h4>
          <ul class="direction-card__tips">
            <li v-for="(tip, index) in startupTips" :key="index">{{ tip }}</li>
          </ul>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import MatchProgress from './MatchProgress.vue'

interface Props {
  title: string
  rank: number
  matchRate: number
  reason: string
  incomeRange: string
  caseBrief?: string
  startupTips?: string[]
  expanded?: boolean
}

withDefaults(defineProps<Props>(), {
  caseBrief: '',
  startupTips: () => [],
  expanded: false
})

const emit = defineEmits<{
  toggle: []
}>()

const toggle = () => {
  emit('toggle')
}
</script>

<style lang="scss" scoped>
.direction-card {
  background: white;
  border-radius: $radius-xl;
  box-shadow: $shadow-md;
  overflow: hidden;
  transition: all $transition-fast;
  border: 1px solid rgba($color-brand-primary, 0.06);

  [data-theme="dark"] & {
    background: #1E293B;
    border-color: rgba(255, 255, 255, 0.1);
  }

  &:hover {
    box-shadow: $shadow-lg;
    transform: translateY(-2px);
  }

  &__header {
    display: flex;
    align-items: center;
    gap: $space-lg;
    padding: $space-lg $space-xl;
    cursor: pointer;
  }

  &__rank {
    font-size: $text-xs;
    font-weight: 700;
    color: white;
    background: linear-gradient(135deg, $color-brand-primary 0%, #818CF8 100%);
    padding: $space-sm $space-md;
    border-radius: $radius-full;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba($color-brand-primary, 0.3);
  }

  &__info {
    flex: 1;
  }

  &__title {
    font-size: $text-lg;
    font-weight: 700;
    color: $color-gray-900;
    margin-bottom: $space-sm;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__match {
    display: flex;
    align-items: center;
    gap: $space-md;
  }

  &__match-text {
    font-size: $text-sm;
    font-weight: 600;
    color: $color-brand-accent;
  }

  &__arrow {
    font-size: 22px;
    color: $color-gray-400;
    transition: transform $transition-fast;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &--expanded &__arrow {
    transform: rotate(180deg);
  }

  &__body {
    padding: 0 $space-xl $space-xl;
  }

  &__section {
    & + & {
      margin-top: $space-lg;
      padding-top: $space-lg;
      border-top: 1px solid $color-gray-100;

      [data-theme="dark"] & {
        border-color: rgba(255, 255, 255, 0.1);
      }
    }
  }

  &__section-title {
    font-size: $text-sm;
    font-weight: 700;
    color: $color-gray-700;
    margin-bottom: $space-sm;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    [data-theme="dark"] & {
      color: #E2E8F0;
    }
  }

  &__section-content {
    font-size: $text-sm;
    color: $color-gray-600;
    line-height: 1.7;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &__income {
    color: $color-brand-accent;
    font-weight: 600;
  }

  &__tips {
    li {
      font-size: $text-sm;
      color: $color-gray-600;
      line-height: 1.8;
      padding-left: $space-lg;
      position: relative;

      [data-theme="dark"] & {
        color: #94A3B8;
      }

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 10px;
        width: 6px;
        height: 6px;
        background: $color-brand-primary;
        border-radius: 50%;
      }
    }
  }
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
