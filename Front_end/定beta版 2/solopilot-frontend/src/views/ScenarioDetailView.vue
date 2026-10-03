<template>
  <div class="scenario-detail-page">
    <div class="scenario-detail-page__header">
      <button class="scenario-detail-page__back" @click="goBack">
        <Icon icon="mdi:arrow-left" width="20" height="20" />
        <span>返回</span>
      </button>
    </div>

    <div v-if="scenario" class="scenario-detail-page__content">
      <!-- 场景封面 -->
      <div class="scenario-hero">
        <div class="scenario-hero__icon">
          <Icon :icon="scenario.icon" width="40" height="40" />
        </div>
        <h1 class="scenario-hero__title">{{ scenario.title }}</h1>
        <p class="scenario-hero__desc">{{ scenario.description }}</p>
      </div>

      <!-- 法律条款列表 -->
      <div class="scenario-articles">
        <h2 class="scenario-articles__title">相关法律条款</h2>

        <div v-if="scenarioArticles.length > 0" class="scenario-articles__list">
          <div
            v-for="article in scenarioArticles"
            :key="article.id"
            class="article-card"
          >
            <div class="article-card__header">
              <span class="article-card__law">{{ article.lawName }}</span>
              <span class="article-card__article">{{ article.articleNumber }}</span>
              <span :class="['article-card__risk', `article-card__risk--${article.riskLevel?.toLowerCase()}`]">
                {{ article.riskLevel }}风险
              </span>
            </div>
            <h4 class="article-card__title">{{ article.title }}</h4>
            <p class="article-card__content">{{ article.content }}</p>
            <div class="article-card__guide">
              <Icon icon="mdi:lightbulb-outline" width="16" height="16" />
              <span>{{ article.practicalGuide }}</span>
            </div>
          </div>
        </div>

        <div v-else class="scenario-articles__empty">
          <Icon icon="mdi:file-document-outline" width="48" height="48" />
          <p>暂无相关法律条款</p>
        </div>
      </div>

      <!-- 快速操作 -->
      <div class="scenario-actions">
        <SpButton block @click="goToAiChat">
          <Icon icon="mdi:robot" width="18" height="18" />
          咨询AI助手
        </SpButton>
      </div>
    </div>

    <div v-else class="scenario-detail-page__not-found">
      <Icon icon="mdi:alert-circle-outline" width="64" height="64" />
      <h2>未找到该场景</h2>
      <p>抱歉，找不到对应的合规场景信息</p>
      <SpButton @click="goBack">返回上一页</SpButton>
    </div>

    <Teleport to="body">
      <AiChat />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import SpButton from '@/components/ui/SpButton.vue'
import AiChat from '@/components/ui/AiChat.vue'
import { complianceScenarios, complianceArticles, type ComplianceArticle } from '@/data/complianceData'

const route = useRoute()
const router = useRouter()

// 从路由参数获取场景ID
const scenarioId = computed(() => route.params.scenarioId as string)

// 获取场景信息
const scenario = computed(() => {
  return complianceScenarios.find(s => s.id === scenarioId.value)
})

// 获取该场景关联的法律条款
const scenarioArticles = computed(() => {
  if (!scenario.value) return []
  return scenario.value.relevantArticles
    .map(articleId => complianceArticles.find(a => a.id === articleId))
    .filter((a): a is ComplianceArticle => a !== undefined)
})

const goBack = () => {
  router.back()
}

const goToAiChat = () => {
  // AI聊天组件会自动显示
  const event = new CustomEvent('toggle-ai-chat')
  window.dispatchEvent(event)
}

onMounted(() => {
  if (!scenario.value) {
    console.warn('Scenario not found:', scenarioId.value)
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/responsive';

.scenario-detail-page {
  max-width: 800px;
  margin: 0 auto;
  padding: $space-xl;

  [data-theme="dark"] & {
    background: #0F172A;
    min-height: 100vh;
  }

  @include mobile {
    padding: $space-md;
  }

  &__header {
    margin-bottom: $space-xl;
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: $space-sm;
    padding: $space-sm $space-md;
    background: transparent;
    border: none;
    cursor: pointer;
    color: $color-brand-primary;
    font-size: $text-sm;
    font-weight: 600;
    border-radius: $radius-lg;
    transition: all $transition-fast;

    [data-theme="dark"] & {
      color: #818CF8;
    }

    &:hover {
      background: $color-brand-primary-light;

      [data-theme="dark"] & {
        background: rgba(99, 102, 241, 0.2);
      }
    }
  }

  &__content {
    animation: fadeIn 0.3s ease;
  }

  &__not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $space-4xl;
    text-align: center;
    color: $color-gray-500;

    [data-theme="dark"] & {
      color: #94A3B8;
    }

    h2 {
      font-size: $text-xl;
      font-weight: 700;
      color: $color-gray-900;
      margin: $space-lg 0 $space-sm;

      [data-theme="dark"] & {
        color: #F8FAFC;
      }
    }

    p {
      margin-bottom: $space-xl;
    }

    svg {
      color: $color-gray-400;
      margin-bottom: $space-md;

      [data-theme="dark"] & {
        color: #64748B;
      }
    }
  }
}

.scenario-hero {
  background: white;
  border-radius: $radius-2xl;
  padding: $space-2xl;
  box-shadow: $shadow-lg;
  text-align: center;
  margin-bottom: $space-xl;
  border: 1px solid rgba($color-brand-primary, 0.06);

  [data-theme="dark"] & {
    background: #1E293B;
    border-color: rgba(255, 255, 255, 0.1);
  }

  &__icon {
    width: 80px;
    height: 80px;
    border-radius: $radius-xl;
    background: linear-gradient(135deg, $color-brand-primary 0%, #818CF8 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto $space-lg;
    color: white;
    box-shadow: 0 8px 24px rgba($color-brand-primary, 0.3);
  }

  &__title {
    font-size: $text-2xl;
    font-weight: 800;
    color: $color-gray-900;
    margin-bottom: $space-sm;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__desc {
    font-size: $text-base;
    color: $color-gray-600;
    line-height: 1.6;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }
}

.scenario-articles {
  &__title {
    font-size: $text-lg;
    font-weight: 700;
    color: $color-gray-900;
    margin-bottom: $space-lg;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: $space-lg;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $space-3xl;
    background: white;
    border-radius: $radius-xl;
    text-align: center;
    color: $color-gray-500;

    [data-theme="dark"] & {
      background: #1E293B;
      color: #64748B;
    }

    svg {
      margin-bottom: $space-md;
      opacity: 0.5;
    }
  }
}

.article-card {
  padding: $space-xl;
  background: white;
  border-radius: $radius-xl;
  box-shadow: $shadow-md;
  border: 1px solid rgba($color-brand-primary, 0.06);

  [data-theme="dark"] & {
    background: #1E293B;
    border-color: rgba(255, 255, 255, 0.1);
  }

  &__header {
    display: flex;
    align-items: center;
    gap: $space-sm;
    margin-bottom: $space-md;
    flex-wrap: wrap;
  }

  &__law {
    font-size: $text-sm;
    font-weight: 700;
    color: $color-brand-primary;

    [data-theme="dark"] & {
      color: #818CF8;
    }
  }

  &__article {
    font-size: $text-sm;
    color: $color-gray-500;

    [data-theme="dark"] & {
      color: #64748B;
    }
  }

  &__risk {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: $radius-full;
    margin-left: auto;

    &--高 {
      background: rgba(#EF4444, 0.1);
      color: #EF4444;
    }

    &--中 {
      background: rgba(#F59E0B, 0.1);
      color: #F59E0B;
    }

    &--低 {
      background: rgba(#10B981, 0.1);
      color: #10B981;
    }
  }

  &__title {
    font-size: $text-base;
    font-weight: 700;
    color: $color-gray-900;
    margin-bottom: $space-sm;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__content {
    font-size: $text-sm;
    color: $color-gray-700;
    line-height: 1.7;
    margin-bottom: $space-md;

    [data-theme="dark"] & {
      color: #E2E8F0;
    }
  }

  &__guide {
    display: flex;
    align-items: flex-start;
    gap: $space-sm;
    font-size: $text-sm;
    color: $color-brand-primary;
    padding: $space-md;
    background: $color-brand-primary-light;
    border-radius: $radius-lg;

    [data-theme="dark"] & {
      background: rgba(99, 102, 241, 0.15);
      color: #818CF8;
    }

    svg {
      flex-shrink: 0;
      margin-top: 2px;
    }
  }
}

.scenario-actions {
  margin-top: $space-2xl;

  :deep(button) {
    gap: $space-sm;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
