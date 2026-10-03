<template>
  <div class="mbti-test">
    <div class="mbti-test__header">
      <button v-if="!isFirstQuestion" class="mbti-test__back" @click="goBack">
        <Icon icon="mdi:arrow-left" />
      </button>
      <span class="mbti-test__progress-text">第 {{ currentQuestion }} / {{ totalQuestions }} 题</span>
      <button class="mbti-test__save" @click="saveAndExit">保存退出</button>
    </div>

    <SpProgressBar :current="currentQuestion" :total="totalQuestions" :show-text="true" class="mbti-test__progress" />

    <div v-if="currentQuestion <= 26" class="mbti-test__part-label">第一部分：情境行为题</div>
    <div v-else class="mbti-test__part-label">第二部分：词语偏好题</div>

    <div class="mbti-test__content">
      <div class="mbti-test__question-card">
        <h2 class="mbti-test__question-text">{{ currentQuestionData?.question }}</h2>
      </div>

      <div class="mbti-test__options">
        <button
          :class="['mbti-test__option', { 'mbti-test__option--selected': selectedAnswer === 'A' }]"
          @click="selectAnswer('A')"
        >
          <span class="mbti-test__option-label">A</span>
          <span class="mbti-test__option-text">{{ currentQuestionData?.option_a }}</span>
        </button>

        <button
          :class="['mbti-test__option', { 'mbti-test__option--selected': selectedAnswer === 'B' }]"
          @click="selectAnswer('B')"
        >
          <span class="mbti-test__option-label">B</span>
          <span class="mbti-test__option-text">{{ currentQuestionData?.option_b }}</span>
        </button>
      </div>
    </div>

    <SpModal
      :visible="showExitModal"
      title="保存进度"
      @close="showExitModal = false"
    >
      <p>你的进度已保存，下次可以继续答题。</p>
      <template #footer>
        <SpButton @click="handleExitConfirm">确定</SpButton>
      </template>
    </SpModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import SpButton from '@/components/ui/SpButton.vue'
import SpProgressBar from '@/components/ui/SpProgressBar.vue'
import SpModal from '@/components/ui/SpModal.vue'
import { useMbtiStore, MBTI_QUESTIONS } from '@/stores/mbti'

const router = useRouter()
const store = useMbtiStore()

const showExitModal = ref(false)

onMounted(() => {
  store.loadFromStorage()
  if (store.isCompleted) {
    router.push('/analyzing')
  }
})

const currentQuestion = computed(() => store.currentQuestion)
const totalQuestions = computed(() => store.totalQuestions)
const currentQuestionData = computed(() => store.currentQuestionData)
const selectedAnswer = computed(() => store.answers[currentQuestion.value])
const isFirstQuestion = computed(() => currentQuestion.value === 1)

watch(currentQuestion, () => {
  if (store.isCompleted) {
    router.push('/analyzing')
  }
})

const selectAnswer = async (answer: 'A' | 'B') => {
  store.setAnswer(currentQuestion.value, answer)

  setTimeout(async () => {
    if (store.isLast) {
      await store.submitResult()
      router.push('/analyzing')
    } else {
      store.next()
    }
  }, 500)
}

const goBack = () => {
  router.push('/mbti-intro')
}

const saveAndExit = () => {
  showExitModal.value = true
}

const handleExitConfirm = () => {
  showExitModal.value = false
  router.push('/')
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/responsive';

.mbti-test {
  max-width: 640px;
  margin: 0 auto;
  padding: $space-lg $space-xl;
  min-height: 100vh;

  [data-theme="dark"] & {
    background: #0F172A;
  }

  @include mobile {
    padding: $space-md $space-md;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $space-md;
  }

  &__back {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    color: $color-gray-600;
    border-radius: $radius-lg;
    transition: all $transition-fast;

    [data-theme="dark"] & {
      color: #94A3B8;
    }

    &:hover {
      background: $color-gray-100;
      color: $color-brand-primary;

      [data-theme="dark"] & {
        background: rgba(255, 255, 255, 0.1);
        color: #818CF8;
      }
    }
  }

  &__progress-text {
    font-size: $text-sm;
    font-weight: 600;
    color: $color-gray-500;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &__save {
    font-size: $text-sm;
    font-weight: 600;
    color: $color-brand-primary;
    cursor: pointer;
    padding: $space-sm $space-md;
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

  &__progress {
    margin-bottom: $space-xl;
  }

  &__part-label {
    text-align: center;
    font-size: $text-sm;
    font-weight: 600;
    color: $color-brand-primary;
    margin-bottom: $space-xl;
    padding: $space-sm $space-lg;
    background: $color-brand-primary-light;
    border-radius: $radius-full;
    display: inline-block;
    width: 100%;

    [data-theme="dark"] & {
      background: rgba(99, 102, 241, 0.2);
      color: #818CF8;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: $space-xl;
  }

  &__question-card {
    text-align: center;
    padding: $space-lg;
    background: white;
    border-radius: $radius-xl;
    box-shadow: $shadow-md;

    [data-theme="dark"] & {
      background: #1E293B;
    }
  }

  &__question-text {
    font-size: $text-lg;
    font-weight: 600;
    color: $color-gray-900;
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
    display: flex;
    align-items: center;
    gap: $space-md;
    padding: $space-md $space-lg;
    background: white;
    border: 2px solid $color-gray-200;
    border-radius: $radius-xl;
    cursor: pointer;
    transition: all $transition-fast;
    min-height: 56px;

    [data-theme="dark"] & {
      background: #1E293B;
      border-color: #334155;
    }

    &:hover {
      border-color: $color-brand-primary;
      background: $color-brand-primary-light;

      [data-theme="dark"] & {
        border-color: #6366F1;
        background: rgba(99, 102, 241, 0.2);
      }
    }

    @include mobile {
      padding: $space-md;
      min-height: 60px;
    }

    &--selected {
      border-color: $color-brand-primary;
      background: linear-gradient(135deg, $color-brand-primary-light 0%, white 100%);
      border-left-width: 4px;

      [data-theme="dark"] & {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, #1E293B 100%);
      }
    }
  }

  &__option-label {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-gray-100;
    border-radius: 50%;
    font-weight: 700;
    font-size: $text-sm;
    color: $color-gray-700;
    flex-shrink: 0;
    transition: all $transition-fast;

    [data-theme="dark"] & {
      background: #334155;
      color: #E2E8F0;
    }

    .mbti-test__option--selected & {
      background: linear-gradient(135deg, $color-brand-primary 0%, #818CF8 100%);
      color: white;
    }
  }

  &__option-text {
    font-size: $text-base;
    color: $color-gray-700;
    text-align: left;
    line-height: 1.5;

    [data-theme="dark"] & {
      color: #E2E8F0;
    }
  }
}
</style>
