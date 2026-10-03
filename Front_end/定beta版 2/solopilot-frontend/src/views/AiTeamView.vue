<template>
  <div class="ai-team">
    <!-- 蒙层引导 -->
    <Transition name="guide-fade">
      <div v-if="guideStore.overlayGuideVisible" class="ai-team__guide-overlay">
        <!-- Step 0: 高亮「开始测评」按钮 -->
        <div v-if="guideStore.currentStep === 0" class="ai-team__guide-spotlight ai-team__guide-spotlight--btn">
          <div class="ai-team__guide-card ai-team__guide-card--top">
            <p class="ai-team__guide-title">第一步</p>
            <p class="ai-team__guide-desc">点击「开始测评」，回答10个简单问题</p>
            <button class="ai-team__guide-next" @click="guideStore.nextStep()">下一步</button>
          </div>
        </div>

        <!-- Step 1: 高亮右侧方案列表 -->
        <div v-else-if="guideStore.currentStep === 1" class="ai-team__guide-spotlight ai-team__guide-spotlight--plans">
          <div class="ai-team__guide-card ai-team__guide-card--bottom">
            <p class="ai-team__guide-title">第二步</p>
            <p class="ai-team__guide-desc">或直接浏览6种 AI 团队方案，找到最适合你的</p>
            <button class="ai-team__guide-next" @click="guideStore.closeOverlayGuide()">开始探索</button>
          </div>
        </div>
      </div>
    </Transition>

    <div class="ai-team__header">
      <h1 class="ai-team__title">AI团队配置</h1>
      <p class="ai-team__desc">完成10个问题，获取个性化AI团队推荐</p>
    </div>

    <div v-if="!started && !store.result" class="ai-team__start">
      <SpButton size="lg" @click="startTest">开始测评</SpButton>
      <p class="ai-team__or">或查看所有方案</p>
      <div class="ai-team__plans">
        <div
          v-for="plan in allPlans"
          :key="plan.type"
          class="ai-team__plan-card"
        >
          <h3 class="ai-team__plan-name">{{ plan.name }}</h3>
          <p class="ai-team__plan-desc">{{ plan.description }}</p>
        </div>
      </div>
    </div>

    <div v-else-if="started && !store.result" class="ai-team__test">
      <SpProgressBar :current="store.currentQuestion" :total="store.totalQuestions" :show-text="true" />

      <div class="ai-team__question">
        <p class="ai-team__question-text">{{ currentQuestionData?.question }}</p>
        <div class="ai-team__options">
          <button
            :class="['ai-team__option', { 'ai-team__option--selected': store.answers[store.currentQuestion] === 'A' }]"
            @click="selectAnswer('A')"
          >
            {{ currentQuestionData?.option_a }}
          </button>
          <button
            :class="['ai-team__option', { 'ai-team__option--selected': store.answers[store.currentQuestion] === 'B' }]"
            @click="selectAnswer('B')"
          >
            {{ currentQuestionData?.option_b }}
          </button>
        </div>
      </div>

      <div class="ai-team__nav">
        <SpButton v-if="store.currentQuestion > 1" variant="secondary" @click="prev">上一题</SpButton>
        <SpButton v-if="store.currentQuestion < store.totalQuestions" variant="secondary" @click="next">下一题</SpButton>
        <SpButton v-if="store.currentQuestion === store.totalQuestions" @click="submit">查看结果</SpButton>
      </div>
    </div>

    <div v-else class="ai-team__result">
      <div class="ai-team__result-header">
        <h2 class="ai-team__result-title">你的AI团队方案：{{ store.result?.plan_name }}</h2>
        <p class="ai-team__result-desc">{{ store.result?.plan_description }}</p>
        <p class="ai-team__result-budget">预估月费：{{ store.result?.monthly_budget }}</p>
      </div>

      <div class="ai-team__roles">
        <div
          v-for="role in store.result?.roles"
          :key="role.id"
          class="ai-team__role-card"
        >
          <div class="ai-team__role-header">
            <span class="ai-team__role-priority">{{ role.priority }}</span>
            <h3 class="ai-team__role-name">{{ role.name }}</h3>
          </div>
          <p class="ai-team__role-solves">{{ role.solves }}</p>
          <p class="ai-team__role-effect">{{ role.expected_effect }}</p>

          <div class="ai-team__role-section">
            <h4>它能做什么</h4>
            <ul>
              <li v-for="(item, index) in role.can_do" :key="index">{{ item }}</li>
            </ul>
          </div>

          <div class="ai-team__role-section">
            <h4>它做不了什么</h4>
            <ul>
              <li v-for="(item, index) in role.cannot_do" :key="index">{{ item }}</li>
            </ul>
          </div>

          <div class="ai-team__role-section">
            <h4>你需要提供</h4>
            <ul>
              <li v-for="(item, index) in role.you_provide" :key="index">{{ item }}</li>
            </ul>
          </div>

          <div class="ai-team__role-section">
            <h4>推荐工具</h4>
            <div class="ai-team__tools">
              <span v-for="tool in role.recommended_tools" :key="tool" class="ai-team__tool">{{ tool }}</span>
            </div>
          </div>

          <p class="ai-team__role-cost">预估月费：{{ role.monthly_cost }}</p>
        </div>
      </div>

      <div class="ai-team__tips">
        <h3>搭建建议</h3>
        <ul>
          <li v-for="(tip, index) in store.result?.startup_tips" :key="index">{{ tip }}</li>
        </ul>
      </div>

      <div class="ai-team__nav">
        <SpButton @click="reset">重新测评</SpButton>
        <SpButton variant="secondary" @click="goToCompliance">查看合规指引</SpButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SpButton from '@/components/ui/SpButton.vue'
import SpProgressBar from '@/components/ui/SpProgressBar.vue'
import { useAiTeamStore, AI_TEAM_QUESTIONS } from '@/stores/aiTeam'
import { useGuideStore } from '@/stores/guide'
import { MOCK_AI_TEAM_RESULT } from '@/services/mockData'

const router = useRouter()
const store = useAiTeamStore()
const guideStore = useGuideStore()

const started = ref(false)

// 首次进入 AI 页面时展示蒙层引导
onMounted(() => {
  guideStore.showOverlayGuide()
})

const allPlans = [
  { type: 'A', name: '内容创作者型', description: '适合靠内容吸引客户，卖知识、课程或个人品牌的用户' },
  { type: 'B', name: '产品/服务运营型', description: '适合有明确产品在卖，需要提高运营效率的用户' },
  { type: 'C', name: '技术创业者型', description: '适合技术背景，做独立开发的用户' },
  { type: 'D', name: '咨询/教练型', description: '适合专业咨询服务的用户' },
  { type: 'E', name: '电商卖家型', description: '适合电商（含跨境）用户' },
  { type: 'F', name: '起步探索型', description: '适合筹备期、零基础的用户' }
]

const currentQuestionData = computed(() => {
  return AI_TEAM_QUESTIONS.find(q => q.id === store.currentQuestion)
})

const startTest = () => {
  started.value = true
  store.reset()
}

const selectAnswer = (answer: 'A' | 'B') => {
  store.setAnswer(store.currentQuestion, answer)
}

const next = () => {
  if (store.currentQuestion < store.totalQuestions) {
    store.next()
  }
}

const prev = () => {
  store.prev()
}

const submit = () => {
  const result = store.calculateResult()
  store.setResult(result)
}

const reset = () => {
  started.value = false
  store.reset()
}

const goToCompliance = () => {
  router.push('/compliance')
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/responsive';

.ai-team {
  max-width: 800px;
  margin: 0 auto;
  padding: $space-xl;

  [data-theme="dark"] & {
    background: #0F172A;
  }

  @include mobile {
    padding: $space-md;
  }

  &__header {
    text-align: center;
    margin-bottom: $space-2xl;
  }

  &__title {
    font-size: $text-2xl;
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

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &__start {
    text-align: center;
  }

  &__or {
    font-size: $text-sm;
    color: $color-gray-500;
    margin: $space-xl 0;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &__plans {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: $space-lg;
    text-align: left;

    @include mobile {
      grid-template-columns: 1fr;
    }
  }

  &__plan-card {
    padding: $space-lg;
    background: white;
    border-radius: $radius-xl;
    box-shadow: $shadow-md;
    border: 1px solid rgba($color-brand-primary, 0.06);
    transition: all $transition-fast;

    [data-theme="dark"] & {
      background: #1E293B;
      border-color: rgba(255, 255, 255, 0.1);
    }

    &:hover {
      box-shadow: $shadow-lg;
      transform: translateY(-2px);
    }
  }

  &__plan-name {
    font-size: $text-base;
    font-weight: 700;
    color: $color-gray-900;
    margin-bottom: $space-sm;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__plan-desc {
    font-size: $text-sm;
    color: $color-gray-600;
    line-height: 1.6;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &__test {
    max-width: 560px;
    margin: 0 auto;
  }

  &__question {
    margin: $space-2xl 0;
    text-align: center;
  }

  &__question-text {
    font-size: $text-xl;
    font-weight: 600;
    color: $color-gray-900;
    margin-bottom: $space-2xl;
    line-height: 1.5;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__options {
    display: flex;
    flex-direction: column;
    gap: $space-md;
  }

  &__option {
    padding: $space-lg $space-xl;
    background: white;
    border: 2px solid $color-gray-200;
    border-radius: $radius-xl;
    font-size: $text-base;
    color: $color-gray-700;
    cursor: pointer;
    transition: all $transition-fast;
    text-align: left;
    box-shadow: $shadow-sm;

    [data-theme="dark"] & {
      background: #1E293B;
      border-color: #334155;
      color: #E2E8F0;
    }

    &:hover {
      border-color: $color-brand-primary;
      background: $color-brand-primary-light;
      transform: translateX(4px);

      [data-theme="dark"] & {
        border-color: #6366F1;
        background: rgba(99, 102, 241, 0.2);
      }
    }

    &--selected {
      border-color: $color-brand-primary;
      background: linear-gradient(135deg, $color-brand-primary-light 0%, white 100%);
      box-shadow: 0 0 0 3px rgba($color-brand-primary, 0.1);

      [data-theme="dark"] & {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, #1E293B 100%);
      }
    }
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

  &__result {
    &-header {
      text-align: center;
      margin-bottom: $space-2xl;
      padding: $space-2xl;
      background: linear-gradient(135deg, $color-brand-primary-light 0%, white 100%);
      border-radius: $radius-xl;
      border: 1px solid rgba($color-brand-primary, 0.1);

      [data-theme="dark"] & {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, #1E293B 100%);
        border-color: rgba(99, 102, 241, 0.3);
      }
    }

    &-title {
      font-size: $text-xl;
      font-weight: 700;
      color: $color-gray-900;
      margin-bottom: $space-sm;

      [data-theme="dark"] & {
        color: #F8FAFC;
      }
    }

    &-desc {
      font-size: $text-base;
      color: $color-gray-700;
      margin-bottom: $space-md;
      line-height: 1.6;

      [data-theme="dark"] & {
        color: #E2E8F0;
      }
    }

    &-budget {
      font-size: $text-base;
      font-weight: 700;
      color: $color-brand-accent;
    }
  }

  &__roles {
    display: flex;
    flex-direction: column;
    gap: $space-lg;
    margin-bottom: $space-2xl;
  }

  &__role-card {
    background: white;
    border-radius: $radius-xl;
    padding: $space-xl;
    box-shadow: $shadow-lg;
    border: 1px solid rgba($color-brand-primary, 0.06);

    [data-theme="dark"] & {
      background: #1E293B;
      border-color: rgba(255, 255, 255, 0.1);
    }
  }

  &__role-header {
    display: flex;
    align-items: center;
    gap: $space-md;
    margin-bottom: $space-lg;
  }

  &__role-priority {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, $color-brand-primary 0%, #818CF8 100%);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $text-sm;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba($color-brand-primary, 0.3);
  }

  &__role-name {
    font-size: $text-lg;
    font-weight: 700;
    color: $color-gray-900;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__role-solves {
    font-size: $text-base;
    color: $color-gray-700;
    margin-bottom: $space-sm;
    line-height: 1.6;

    [data-theme="dark"] & {
      color: #E2E8F0;
    }
  }

  &__role-effect {
    font-size: $text-sm;
    color: $color-brand-accent;
    font-weight: 600;
    margin-bottom: $space-lg;
  }

  &__role-section {
    margin-bottom: $space-lg;

    h4 {
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

    ul {
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

  &__tools {
    display: flex;
    flex-wrap: wrap;
    gap: $space-sm;
  }

  &__tool {
    padding: $space-sm $space-md;
    background: $color-brand-primary-light;
    border-radius: $radius-full;
    font-size: $text-xs;
    font-weight: 600;
    color: $color-brand-primary;

    [data-theme="dark"] & {
      background: rgba(99, 102, 241, 0.2);
      color: #818CF8;
    }
  }

  &__role-cost {
    font-size: $text-sm;
    font-weight: 700;
    color: $color-brand-accent;
    margin-top: $space-lg;
    padding-top: $space-lg;
    border-top: 1px solid $color-gray-100;

    [data-theme="dark"] & {
      border-color: rgba(255, 255, 255, 0.1);
    }
  }

  &__tips {
    background: linear-gradient(135deg, $color-brand-accent-light 0%, white 100%);
    padding: $space-xl;
    border-radius: $radius-xl;
    margin-bottom: $space-2xl;
    border: 1px solid rgba($color-brand-accent, 0.1);

    [data-theme="dark"] & {
      background: rgba(16, 185, 129, 0.15);
      border-color: rgba(16, 185, 129, 0.3);
    }

    h3 {
      font-size: $text-base;
      font-weight: 700;
      color: $color-gray-900;
      margin-bottom: $space-md;

      [data-theme="dark"] & {
        color: #F8FAFC;
      }
    }

    li {
      font-size: $text-sm;
      color: $color-gray-700;
      line-height: 1.8;
      padding-left: $space-lg;
      position: relative;

      [data-theme="dark"] & {
        color: #E2E8F0;
      }

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 10px;
        width: 6px;
        height: 6px;
        background: $color-brand-accent;
        border-radius: 50%;
      }
    }
  }

  // ---------- 蒙层引导 ----------
  &__guide-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__guide-spotlight {
    position: absolute;
    border-radius: $radius-xl;
    box-shadow: 0 0 0 3px rgba($color-brand-primary, 0.6), 0 0 0 9999px rgba(0, 0, 0, 0.55);

    // 高亮「开始测评」按钮（屏幕中央偏上）
    &--btn {
      top: 42%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 200px;
      height: 60px;
    }

    // 高亮方案列表（屏幕下半部分）
    &--plans {
      top: 58%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 600px;
      height: 220px;
    }
  }

  &__guide-card {
    background: white;
    border-radius: $radius-xl;
    padding: $space-lg $space-xl;
    box-shadow: $shadow-xl;
    text-align: center;
    max-width: 240px;

    [data-theme="dark"] & {
      background: #1E293B;
    }

    &--top {
      position: absolute;
      bottom: calc(100% + 16px);
      left: 50%;
      transform: translateX(-50%);
    }

    &--bottom {
      position: absolute;
      top: calc(100% + 16px);
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &__guide-title {
    font-size: $text-xs;
    font-weight: 700;
    color: $color-brand-primary;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: $space-xs;
  }

  &__guide-desc {
    font-size: $text-sm;
    color: $color-gray-700;
    line-height: 1.6;
    margin-bottom: $space-md;

    [data-theme="dark"] & {
      color: #E2E8F0;
    }
  }

  &__guide-next {
    font-size: $text-sm;
    font-weight: 700;
    color: white;
    background: $color-brand-primary;
    border: none;
    border-radius: $radius-full;
    padding: $space-sm $space-lg;
    cursor: pointer;
    transition: all $transition-fast;
    box-shadow: 0 4px 12px rgba($color-brand-primary, 0.35);

    &:hover {
      transform: scale(1.04);
      box-shadow: 0 6px 16px rgba($color-brand-primary, 0.45);
    }
  }
}

// ---------- 引导过渡动画 ----------
.guide-fade-enter-active,
.guide-fade-leave-active {
  transition: opacity 0.3s ease;
}

.guide-fade-enter-from,
.guide-fade-leave-to {
  opacity: 0;
}
</style>
