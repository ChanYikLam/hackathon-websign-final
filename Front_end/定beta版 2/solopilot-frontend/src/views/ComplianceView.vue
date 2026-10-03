<template>
  <div class="compliance">
    <div class="compliance__tabs">
      <button
        :class="['compliance__tab', { 'compliance__tab--active': activeTab === 'scenario' }]"
        @click="activeTab = 'scenario'"
      >
        场景指引
      </button>
      <button
        :class="['compliance__tab', { 'compliance__tab--active': activeTab === 'guide' }]"
        @click="activeTab = 'guide'"
      >
        合规指引
      </button>
      <button
        :class="['compliance__tab', { 'compliance__tab--active': activeTab === 'laws' }]"
        @click="activeTab = 'laws'"
      >
        法律速查
      </button>
      <button
        :class="['compliance__tab', { 'compliance__tab--active': activeTab === 'review' }]"
        @click="activeTab = 'review'"
      >
        长期复盘
      </button>
    </div>

    <!-- 场景指引 -->
    <div v-if="activeTab === 'scenario'" class="compliance__content">
      <div class="scenario-grid">
        <div
          v-for="scenario in scenarios"
          :key="scenario.id"
          class="scenario-card"
          @click="selectScenario(scenario)"
        >
          <div class="scenario-card__icon">
            <Icon :icon="scenario.icon" width="32" height="32" />
          </div>
          <h3 class="scenario-card__title">{{ scenario.title }}</h3>
          <p class="scenario-card__desc">{{ scenario.description }}</p>
        </div>
      </div>

      <!-- 场景详情 -->
      <div v-if="selectedScenario" class="scenario-detail">
        <div class="scenario-detail__header">
          <h3 class="scenario-detail__title">{{ selectedScenario.title }}</h3>
          <button class="scenario-detail__close" @click="selectedScenario = null">
            <Icon icon="mdi:close" width="20" height="20" />
          </button>
        </div>
        <p class="scenario-detail__desc">{{ selectedScenario.description }}</p>
        <div class="scenario-articles">
          <h4 class="scenario-articles__title">相关法律条款</h4>
          <div
            v-for="articleId in selectedScenario.relevantArticles"
            :key="articleId"
            class="scenario-article"
          >
            <div v-if="getArticleById(articleId)" class="article-card">
              <div class="article-card__header">
                <span class="article-card__law">{{ getArticleById(articleId)?.lawName }}</span>
                <span class="article-card__article">{{ getArticleById(articleId)?.articleNumber }}</span>
                <span :class="['article-card__risk', `article-card__risk--${getArticleById(articleId)?.riskLevel?.toLowerCase()}`]">
                  {{ getArticleById(articleId)?.riskLevel }}风险
                </span>
              </div>
              <h5 class="article-card__title">{{ getArticleById(articleId)?.title }}</h5>
              <p class="article-card__content">{{ getArticleById(articleId)?.content }}</p>
              <div class="article-card__guide">
                <Icon icon="mdi:lightbulb-outline" width="16" height="16" />
                <span>{{ getArticleById(articleId)?.practicalGuide }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 合规指引 -->
    <div v-else-if="activeTab === 'guide'" class="compliance__content">
      <div class="guide-list">
        <div
          v-for="guide in guides"
          :key="guide.category"
          class="guide-section"
        >
          <h3 class="guide-section__title">{{ guide.title }}</h3>
          <div
            v-for="section in guide.sections"
            :key="section.subtitle"
            class="guide-card"
          >
            <h4 class="guide-card__subtitle">{{ section.subtitle }}</h4>
            <p class="guide-card__content">{{ section.content }}</p>
            <span v-if="section.legalBasis" class="guide-card__basis">
              <Icon icon="mdi:book-outline" width="14" height="14" />
              {{ section.legalBasis }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 法律速查 -->
    <div v-else-if="activeTab === 'laws'" class="compliance__content">
      <div class="laws-categories">
        <button
          v-for="cat in categories"
          :key="cat"
          :class="['laws-category-btn', { 'laws-category-btn--active': selectedCategory === cat }]"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <div class="laws-list">
        <div
          v-for="article in filteredArticles"
          :key="article.id"
          class="law-card"
        >
          <div class="law-card__header">
            <span class="law-card__law">{{ article.lawName }}</span>
            <span class="law-card__article">{{ article.articleNumber }}</span>
            <span :class="['law-card__risk', `law-card__risk--${article.riskLevel?.toLowerCase()}`]">
              {{ article.riskLevel }}风险
            </span>
          </div>
          <h4 class="law-card__title">{{ article.title }}</h4>
          <p class="law-card__content">{{ article.content }}</p>
          <div class="law-card__guide">
            <Icon icon="mdi:lightbulb-outline" width="16" height="16" />
            <span>{{ article.practicalGuide }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 长期复盘 -->
    <div v-else class="review-content">
      <div class="review__form">
        <h2 class="review__form-title">创建复盘记录</h2>

        <div class="review__field">
          <label class="review__label">复盘周期</label>
          <div class="review__cycle-options">
            <button
              v-for="cycle in cycles"
              :key="cycle.value"
              :class="['review__cycle-btn', { 'review__cycle-btn--active': newReview.cycle === cycle.value }]"
              @click="newReview.cycle = cycle.value"
            >
              {{ cycle.label }}
            </button>
          </div>
        </div>

        <div class="review__field">
          <label class="review__label">本期收入</label>
          <SpInput v-model="newReview.revenue" placeholder="如：500元" />
        </div>

        <div class="review__field">
          <label class="review__label">本期流量</label>
          <SpInput v-model="newReview.traffic" placeholder="如：1200 UV" />
        </div>

        <div class="review__field">
          <label class="review__label">本期客户数</label>
          <SpInput v-model="newReview.customers" placeholder="如：3" />
        </div>

        <div class="review__field">
          <label class="review__label">效率改善</label>
          <textarea
            v-model="newReview.efficiency"
            class="review__textarea"
            placeholder="用AI助手后，内容产出效率提升了一倍"
          ></textarea>
        </div>

        <div class="review__field">
          <label class="review__label">下期目标</label>
          <textarea
            v-model="newReview.next_goal"
            class="review__textarea"
            placeholder="下周发布5篇内容，争取新增200粉丝"
          ></textarea>
        </div>

        <SpButton block @click="handleCreateReview">保存复盘记录</SpButton>
      </div>

      <div v-if="reviews.length" class="review__list">
        <h3 class="review__list-title">历史复盘</h3>
        <div
          v-for="item in reviews"
          :key="item.id"
          class="review__item"
        >
          <div class="review__item-header">
            <span class="review__item-period">{{ item.period_label }}</span>
            <span class="review__item-cycle">{{ item.cycle }}</span>
          </div>
          <p v-if="item.revenue" class="review__item-data">收入：{{ item.revenue }}</p>
          <p v-if="item.next_goal" class="review__item-data">目标：{{ item.next_goal }}</p>
        </div>
      </div>
    </div>

    <div class="compliance__nav">
      <SpButton variant="secondary" @click="goToAiTeam">配置AI团队</SpButton>
      <SpButton @click="goToHome">返回首页</SpButton>
    </div>

    <Teleport to="body">
      <AiChat />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import SpButton from '@/components/ui/SpButton.vue'
import SpInput from '@/components/ui/SpInput.vue'
import AiChat from '@/components/ui/AiChat.vue'
import { useAppStore } from '@/stores/app'
import { reviewService } from '@/services/api'
import {
  complianceArticles,
  complianceScenarios,
  complianceGuides,
  getCategories,
  getArticlesByCategory,
  type ComplianceScenario,
  type ComplianceArticle,
  type ComplianceGuide
} from '@/data/complianceData'

const router = useRouter()
const appStore = useAppStore()

const activeTab = ref<'scenario' | 'guide' | 'laws' | 'review'>('scenario')

// 数据
const scenarios: ComplianceScenario[] = complianceScenarios
const guides: ComplianceGuide[] = complianceGuides
const categories = getCategories()

// 选中状态
const selectedScenario = ref<ComplianceScenario | null>(null)
const selectedCategory = ref<string>(categories[0] || '')

// 复盘数据
const reviews = ref<any[]>([])

const cycles: { label: string; value: 'weekly' | 'monthly' | 'quarterly' }[] = [
  { label: '周', value: 'weekly' },
  { label: '月', value: 'monthly' },
  { label: '季度', value: 'quarterly' }
]

const newReview = ref<{
  cycle: 'weekly' | 'monthly' | 'quarterly'
  revenue: string
  traffic: string
  customers: string
  efficiency: string
  next_goal: string
}>({
  cycle: 'weekly',
  revenue: '',
  traffic: '',
  customers: '',
  efficiency: '',
  next_goal: ''
})

// 计算属性
const filteredArticles = computed(() => {
  if (!selectedCategory.value) return complianceArticles.slice(0, 20)
  return getArticlesByCategory(selectedCategory.value)
})

// 方法
const getArticleById = (id: string): ComplianceArticle | undefined => {
  return complianceArticles.find(a => a.id === id)
}

const selectScenario = (scenario: ComplianceScenario) => {
  // 导航到独立的场景详情页面
  router.push(scenario.routePath)
}

onMounted(async () => {
  try {
    const response = await reviewService.getList()
    if (response.code === 0 && response.data) {
      reviews.value = response.data.reviews || []
    }
  } catch (error) {
    reviews.value = []
  }
})

const handleCreateReview = async () => {
  try {
    await reviewService.create({
      ...newReview.value,
      period_label: new Date().toLocaleDateString('zh-CN')
    })
    appStore.showToast('复盘记录已保存', 'success')
    newReview.value = {
      cycle: 'weekly',
      revenue: '',
      traffic: '',
      customers: '',
      efficiency: '',
      next_goal: ''
    }
  } catch (error) {
    appStore.showToast('保存失败，请稍后重试', 'error')
  }
}

const goToAiTeam = () => {
  router.push('/ai-team')
}

const goToHome = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/responsive';

.compliance {
  max-width: 800px;
  margin: 0 auto;
  padding: $space-xl;

  [data-theme="dark"] & {
    background: #0F172A;
  }

  @include mobile {
    padding: $space-md;
  }

  &__tabs {
    display: flex;
    gap: $space-xs;
    margin-bottom: $space-xl;
    background: $color-gray-100;
    padding: $space-xs;
    border-radius: $radius-xl;
    overflow-x: auto;

    [data-theme="dark"] & {
      background: #1E293B;
    }
  }

  &__tab {
    flex: 1;
    min-width: fit-content;
    padding: $space-md $space-lg;
    font-size: $text-sm;
    font-weight: 600;
    color: $color-gray-600;
    border-radius: $radius-lg;
    transition: all $transition-fast;
    cursor: pointer;
    white-space: nowrap;

    [data-theme="dark"] & {
      color: #94A3B8;
    }

    &--active {
      background: white;
      color: $color-brand-primary;
      box-shadow: $shadow-md;

      [data-theme="dark"] & {
        background: #1E293B;
        color: #818CF8;
      }
    }

    &:hover:not(&--active) {
      color: $color-gray-900;
      background: rgba(white, 0.5);

      [data-theme="dark"] & {
        color: #E2E8F0;
        background: rgba(255, 255, 255, 0.05);
      }
    }
  }

  &__content {
    animation: fadeIn 0.3s ease;
  }

  &__nav {
    display: flex;
    gap: $space-md;
    justify-content: center;
    margin-top: $space-2xl;

    @include mobile {
      flex-direction: column;

      :deep(button) {
        width: 100%;
      }
    }
  }
}

// 场景指引
.scenario-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $space-md;
  margin-bottom: $space-xl;

  @include mobile {
    grid-template-columns: 1fr;
  }
}

.scenario-card {
  padding: $space-lg;
  background: white;
  border-radius: $radius-xl;
  box-shadow: $shadow-sm;
  border: 1px solid rgba($color-brand-primary, 0.06);
  cursor: pointer;
  transition: all $transition-fast;

  [data-theme="dark"] & {
    background: #1E293B;
    border-color: rgba(255, 255, 255, 0.1);
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-md;
  }

  &__icon {
    width: 48px;
    height: 48px;
    border-radius: $radius-lg;
    background: $color-brand-primary-light;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: $space-md;
    color: $color-brand-primary;

    [data-theme="dark"] & {
      background: rgba(99, 102, 241, 0.2);
      color: #818CF8;
    }
  }

  &__title {
    font-size: $text-sm;
    font-weight: 600;
    color: $color-gray-900;
    margin-bottom: $space-xs;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__desc {
    font-size: $text-xs;
    color: $color-gray-500;
    line-height: 1.5;

    [data-theme="dark"] & {
      color: #64748B;
    }
  }
}

.scenario-detail {
  background: white;
  border-radius: $radius-xl;
  box-shadow: $shadow-lg;
  padding: $space-xl;
  border: 1px solid rgba($color-brand-primary, 0.06);

  [data-theme="dark"] & {
    background: #1E293B;
    border-color: rgba(255, 255, 255, 0.1);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-lg;
  }

  &__title {
    font-size: $text-lg;
    font-weight: 700;
    color: $color-gray-900;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__desc {
    font-size: $text-sm;
    color: $color-gray-600;
    margin-bottom: $space-xl;
    line-height: 1.6;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &__close {
    width: 32px;
    height: 32px;
    border-radius: $radius-full;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: $color-gray-500;
    background: transparent;

    &:hover {
      background: $color-gray-100;
    }
  }
}

.scenario-articles {
  &__title {
    font-size: $text-sm;
    font-weight: 600;
    color: $color-gray-800;
    margin-bottom: $space-md;

    [data-theme="dark"] & {
      color: #E2E8F0;
    }
  }
}

.article-card {
  padding: $space-md;
  background: $color-gray-50;
  border-radius: $radius-lg;
  margin-bottom: $space-md;

  [data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.05);
  }

  &__header {
    display: flex;
    align-items: center;
    gap: $space-sm;
    margin-bottom: $space-sm;
  }

  &__law {
    font-size: $text-xs;
    font-weight: 600;
    color: $color-brand-primary;

    [data-theme="dark"] & {
      color: #818CF8;
    }
  }

  &__article {
    font-size: $text-xs;
    color: $color-gray-500;

    [data-theme="dark"] & {
      color: #64748B;
    }
  }

  &__risk {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
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
    font-size: $text-sm;
    font-weight: 600;
    color: $color-gray-800;
    margin-bottom: $space-xs;

    [data-theme="dark"] & {
      color: #E2E8F0;
    }
  }

  &__content {
    font-size: $text-sm;
    color: $color-gray-600;
    line-height: 1.6;
    margin-bottom: $space-sm;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &__guide {
    display: flex;
    align-items: flex-start;
    gap: $space-xs;
    font-size: $text-xs;
    color: $color-brand-primary;
    padding: $space-sm;
    background: $color-brand-primary-light;
    border-radius: $radius-md;

    [data-theme="dark"] & {
      background: rgba(99, 102, 241, 0.15);
      color: #818CF8;
    }
  }
}

// 合规指引
.guide-list {
  display: flex;
  flex-direction: column;
  gap: $space-xl;
}

.guide-section {
  &__title {
    font-size: $text-base;
    font-weight: 700;
    color: $color-gray-900;
    margin-bottom: $space-md;
    padding-bottom: $space-sm;
    border-bottom: 2px solid rgba($color-brand-primary, 0.1);

    [data-theme="dark"] & {
      color: #F8FAFC;
      border-color: rgba(99, 102, 241, 0.3);
    }
  }
}

.guide-card {
  padding: $space-lg;
  background: white;
  border-radius: $radius-xl;
  box-shadow: $shadow-sm;
  border: 1px solid rgba($color-brand-primary, 0.06);
  margin-bottom: $space-md;

  [data-theme="dark"] & {
    background: #1E293B;
    border-color: rgba(255, 255, 255, 0.1);
  }

  &__subtitle {
    font-size: $text-sm;
    font-weight: 600;
    color: $color-gray-800;
    margin-bottom: $space-sm;

    [data-theme="dark"] & {
      color: #E2E8F0;
    }
  }

  &__content {
    font-size: $text-sm;
    color: $color-gray-600;
    line-height: 1.7;
    margin-bottom: $space-sm;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &__basis {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: $text-xs;
    color: $color-brand-primary;
    padding: $space-xs $space-sm;
    background: $color-brand-primary-light;
    border-radius: $radius-full;

    [data-theme="dark"] & {
      background: rgba(99, 102, 241, 0.2);
      color: #818CF8;
    }
  }
}

// 法律速查
.laws-categories {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
  margin-bottom: $space-xl;
}

.laws-category-btn {
  padding: $space-sm $space-md;
  font-size: $text-sm;
  font-weight: 500;
  border: 1.5px solid $color-gray-200;
  border-radius: $radius-full;
  cursor: pointer;
  transition: all $transition-fast;
  background: white;
  color: $color-gray-700;

  [data-theme="dark"] & {
    background: #0F172A;
    border-color: #334155;
    color: #E2E8F0;
  }

  &:hover {
    border-color: $color-brand-primary;
  }

  &--active {
    border-color: $color-brand-primary;
    background: $color-brand-primary;
    color: white;

    [data-theme="dark"] & {
      background: #6366F1;
      border-color: #6366F1;
    }
  }
}

.laws-list {
  display: flex;
  flex-direction: column;
  gap: $space-md;
}

.law-card {
  padding: $space-lg;
  background: white;
  border-radius: $radius-xl;
  box-shadow: $shadow-sm;
  border: 1px solid rgba($color-brand-primary, 0.06);

  [data-theme="dark"] & {
    background: #1E293B;
    border-color: rgba(255, 255, 255, 0.1);
  }

  &__header {
    display: flex;
    align-items: center;
    gap: $space-sm;
    margin-bottom: $space-sm;
  }

  &__law {
    font-size: $text-xs;
    font-weight: 600;
    color: $color-brand-primary;

    [data-theme="dark"] & {
      color: #818CF8;
    }
  }

  &__article {
    font-size: $text-xs;
    color: $color-gray-500;

    [data-theme="dark"] & {
      color: #64748B;
    }
  }

  &__risk {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
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
    font-size: $text-sm;
    font-weight: 600;
    color: $color-gray-800;
    margin-bottom: $space-sm;

    [data-theme="dark"] & {
      color: #E2E8F0;
    }
  }

  &__content {
    font-size: $text-sm;
    color: $color-gray-600;
    line-height: 1.6;
    margin-bottom: $space-sm;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &__guide {
    display: flex;
    align-items: flex-start;
    gap: $space-xs;
    font-size: $text-sm;
    color: $color-brand-primary;
    padding: $space-sm;
    background: $color-brand-primary-light;
    border-radius: $radius-md;

    [data-theme="dark"] & {
      background: rgba(99, 102, 241, 0.15);
      color: #818CF8;
    }
  }
}

// 复盘
.review {
  &__form {
    background: white;
    padding: $space-xl;
    border-radius: $radius-xl;
    box-shadow: $shadow-lg;
    margin-bottom: $space-2xl;
    border: 1px solid rgba($color-brand-primary, 0.06);

    [data-theme="dark"] & {
      background: #1E293B;
      border-color: rgba(255, 255, 255, 0.1);
    }
  }

  &__form-title {
    font-size: $text-lg;
    font-weight: 700;
    color: $color-gray-900;
    margin-bottom: $space-xl;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__field {
    margin-bottom: $space-lg;
  }

  &__label {
    display: block;
    font-size: $text-sm;
    font-weight: 600;
    color: $color-gray-700;
    margin-bottom: $space-sm;

    [data-theme="dark"] & {
      color: #E2E8F0;
    }
  }

  &__cycle-options {
    display: flex;
    gap: $space-sm;
  }

  &__cycle-btn {
    flex: 1;
    padding: $space-md;
    font-size: $text-sm;
    font-weight: 500;
    border: 1.5px solid $color-gray-200;
    border-radius: $radius-lg;
    cursor: pointer;
    transition: all $transition-fast;
    background: white;

    [data-theme="dark"] & {
      background: #0F172A;
      border-color: #334155;
      color: #E2E8F0;
    }

    &--active {
      border-color: $color-brand-primary;
      background: $color-brand-primary-light;
      color: $color-brand-primary;
      font-weight: 600;

      [data-theme="dark"] & {
        background: rgba(99, 102, 241, 0.2);
        color: #818CF8;
        border-color: #6366F1;
      }
    }
  }

  &__textarea {
    width: 100%;
    padding: $space-lg;
    font-size: $text-base;
    font-family: inherit;
    border: 1.5px solid $color-gray-200;
    border-radius: $radius-xl;
    resize: none;
    background: white;
    transition: all $transition-fast;

    [data-theme="dark"] & {
      background: #0F172A;
      border-color: #334155;
      color: #F8FAFC;
    }

    &:focus {
      outline: none;
      border-color: $color-brand-primary;
      box-shadow: 0 0 0 4px rgba($color-brand-primary, 0.08);

      [data-theme="dark"] & {
        border-color: #6366F1;
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
      }
    }

    &::placeholder {
      color: $color-gray-400;

      [data-theme="dark"] & {
        color: #64748B;
      }
    }
  }

  &__list {
    margin-top: $space-2xl;
  }

  &__list-title {
    font-size: $text-base;
    font-weight: 700;
    color: $color-gray-900;
    margin-bottom: $space-lg;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__item {
    padding: $space-lg;
    background: white;
    border-radius: $radius-xl;
    margin-bottom: $space-md;
    box-shadow: $shadow-sm;
    border: 1px solid rgba($color-brand-primary, 0.06);

    [data-theme="dark"] & {
      background: #1E293B;
      border-color: rgba(255, 255, 255, 0.1);
    }
  }

  &__item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-sm;
  }

  &__item-period {
    font-size: $text-sm;
    font-weight: 600;
    color: $color-gray-700;

    [data-theme="dark"] & {
      color: #E2E8F0;
    }
  }

  &__item-cycle {
    font-size: $text-xs;
    font-weight: 600;
    color: $color-brand-primary;
    padding: $space-xs $space-sm;
    background: $color-brand-primary-light;
    border-radius: $radius-full;

    [data-theme="dark"] & {
      background: rgba(99, 102, 241, 0.2);
      color: #818CF8;
    }
  }

  &__item-data {
    font-size: $text-sm;
    color: $color-gray-600;
    line-height: 1.6;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
