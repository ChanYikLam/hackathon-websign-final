<template>
  <div class="info-intro">
    <div class="info-intro__content">
      <div class="info-intro__icon">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#EEF2FF" />
          <rect x="35" y="40" width="50" height="40" rx="4" fill="#C7D2FE" />
          <rect x="40" y="45" width="40" height="30" rx="2" fill="#6366F1" opacity="0.3" />
          <path d="M45 55 L55 55 L55 58 L45 58 Z" fill="#6366F1" />
          <path d="M45 62 L70 62 L70 65 L45 65 Z" fill="#6366F1" opacity="0.5" />
          <path d="M45 68 L65 68 L65 71 L45 71 Z" fill="#6366F1" opacity="0.3" />
          <circle cx="85" cy="45" r="12" fill="#10B981" opacity="0.8" />
          <path d="M80 45 L84 49 L90 41" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>

      <h1 class="info-intro__title">了解你的基本情况</h1>
      <p class="info-intro__desc">
        为了给你更精准的创业方向建议，我们需要先了解你的一些基本信息
      </p>

      <div class="info-intro__features">
        <div class="info-intro__feature">
          <div class="info-intro__feature-icon">
            <Icon icon="mdi:account-circle-outline" />
          </div>
          <div class="info-intro__feature-text">
            <h3>{{ stepCount }} 道选择题</h3>
            <p>快速选择，几分钟完成</p>
          </div>
        </div>

        <div class="info-intro__feature">
          <div class="info-intro__feature-icon">
            <Icon icon="mdi:shield-check-outline" />
          </div>
          <div class="info-intro__feature-text">
            <h3>完全私密</h3>
            <p>数据仅保存在本地，不会上传到服务器</p>
          </div>
        </div>

        <div class="info-intro__feature">
          <div class="info-intro__feature-icon">
            <Icon icon="mdi:lightbulb-outline" />
          </div>
          <div class="info-intro__feature-text">
            <h3>精准匹配</h3>
            <p>根据你的情况，匹配最适合的创业方向</p>
          </div>
        </div>
      </div>

      <div class="info-intro__topics">
        <h3>涵盖内容</h3>
        <div class="info-intro__topics-grid">
          <span v-for="topic in topics" :key="topic" class="info-intro__topic">
            <Icon icon="mdi:check-circle" />
            {{ topic }}
          </span>
        </div>
      </div>

      <div class="info-intro__actions">
        <SpButton size="lg" @click="startCollect">开始填写</SpButton>
        <button class="info-intro__back" @click="goBack">先看看一人公司是什么</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import SpButton from '@/components/ui/SpButton.vue'
import { INFO_COLLECT_STEPS } from '@/stores/infoCollect'

const router = useRouter()

const stepCount = INFO_COLLECT_STEPS.length

const topics = [
  '所在城市',
  '工作节奏偏好',
  '擅长技能',
  '心动方向',
  '创业动机'
]

const startCollect = () => {
  router.push('/info-collect')
}

const goBack = () => {
  router.push('/intro')
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/responsive';

.info-intro {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-lg;
  background: linear-gradient(135deg, $color-brand-primary-light 0%, white 50%, $color-brand-accent-light 100%);

  [data-theme="dark"] & {
    background: linear-gradient(135deg, #312E81 0%, #1E293B 50%, #064E3B 100%);
  }

  @include mobile {
    padding: $space-md;
    align-items: flex-start;
    padding-top: $space-xl;
  }

  &__content {
    background: white;
    border-radius: $radius-2xl;
    padding: $space-xl;
    box-shadow: $shadow-xl;
    max-width: 520px;
    width: 100%;
    text-align: center;

    [data-theme="dark"] & {
      background: #1E293B;
    }

    @include mobile {
      padding: $space-lg;
      border-radius: $radius-xl;
    }
  }

  &__icon {
    width: 80px;
    height: 80px;
    margin: 0 auto $space-lg;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  &__title {
    font-size: $text-xl;
    font-weight: 800;
    color: $color-gray-900;
    margin-bottom: $space-sm;
    letter-spacing: -0.5px;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__desc {
    font-size: $text-base;
    color: $color-gray-600;
    line-height: 1.6;
    margin-bottom: $space-xl;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &__features {
    display: flex;
    flex-direction: column;
    gap: $space-sm;
    margin-bottom: $space-lg;
    text-align: left;
  }

  &__feature {
    display: flex;
    align-items: center;
    gap: $space-md;
    padding: $space-md;
    background: $color-gray-50;
    border-radius: $radius-xl;

    [data-theme="dark"] & {
      background: rgba(99, 102, 241, 0.1);
    }
  }

  &__feature-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-brand-primary-light;
    border-radius: $radius-lg;

    [data-theme="dark"] & {
      background: rgba(99, 102, 241, 0.2);
    }

    svg {
      font-size: 20px;
      color: $color-brand-primary;

      [data-theme="dark"] & {
        color: #818CF8;
      }
    }
  }

  &__feature-text {
    flex: 1;

    h3 {
      font-size: $text-sm;
      font-weight: 700;
      color: $color-gray-900;
      margin-bottom: 2px;

      [data-theme="dark"] & {
        color: #F8FAFC;
      }
    }

    p {
      font-size: $text-xs;
      color: $color-gray-500;
      margin: 0;

      [data-theme="dark"] & {
        color: #94A3B8;
      }
    }
  }

  &__topics {
    padding: $space-md;
    background: $color-brand-primary-light;
    border-radius: $radius-xl;
    margin-bottom: $space-lg;
    text-align: left;

    [data-theme="dark"] & {
      background: rgba(99, 102, 241, 0.15);
    }

    h3 {
      font-size: $text-sm;
      font-weight: 700;
      color: $color-brand-primary;
      margin-bottom: $space-md;

      [data-theme="dark"] & {
        color: #818CF8;
      }
    }
  }

  &__topics-grid {
    display: flex;
    flex-wrap: wrap;
    gap: $space-sm;
  }

  &__topic {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: $text-sm;
    color: $color-gray-700;
    padding: 4px $space-sm;
    background: white;
    border-radius: $radius-full;

    [data-theme="dark"] & {
      background: #1E293B;
      color: #C7D2FE;
    }

    svg {
      font-size: 14px;
      color: $color-brand-accent;

      [data-theme="dark"] & {
        color: #34D399;
      }
    }
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: $space-md;
    align-items: center;
  }

  &__back {
    font-size: $text-sm;
    color: $color-gray-500;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: $space-sm $space-md;
    transition: color $transition-fast;

    [data-theme="dark"] & {
      color: #94A3B8;
    }

    &:hover {
      color: $color-brand-primary;

      [data-theme="dark"] & {
        color: #818CF8;
      }
    }
  }
}
</style>
