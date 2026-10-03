<template>
  <div class="info-collect">
    <div class="info-collect__header">
      <button v-if="!isFirst" class="info-collect__back" @click="goBack">
        <Icon icon="mdi:arrow-left" />
      </button>
      <span class="info-collect__step">Step {{ currentStep }} / {{ totalSteps }}</span>
    </div>

    <SpProgressBar :current="currentStep" :total="totalSteps" :show-text="true" class="info-collect__progress" />

    <div class="info-collect__content">
      <ChatBubble
        v-for="(line, index) in currentQuestion"
        :key="index"
        role="ai"
        :content="line"
      />

      <div v-if="showUserAnswer" class="info-collect__user-answer">
        <ChatBubble role="user" :content="`我选择的是：${selectedAnswer}`" />
      </div>

      <div v-if="stepConfig?.type === 'single' && !showUserAnswer" class="info-collect__options">
        <OptionCard
          v-for="option in stepConfig.options"
          :key="option"
          :label="option"
          :selected="selectedAnswer === option"
          @select="selectOption(option)"
        />
      </div>

      <div v-if="stepConfig?.type === 'text' && !showUserAnswer" class="info-collect__text-input">
        <div v-if="quickTags?.length" class="info-collect__quick-tags">
          <button
            v-for="tag in quickTags"
            :key="tag"
            :class="['info-collect__quick-tag', { 'info-collect__quick-tag--selected': selectedAnswer === tag }]"
            @click="selectOption(tag)"
          >
            {{ tag }}
          </button>
        </div>
        <textarea
          v-model="textAnswer"
          :placeholder="placeholderText"
          class="info-collect__textarea"
          rows="3"
        ></textarea>
        <SpButton :disabled="!textAnswer.trim()" @click="submitText">确认</SpButton>
        <SpButton v-if="selectedAnswer && stepConfig?.type === 'text'" @click="confirmSelection">确定</SpButton>
      </div>

      <div v-if="stepConfig?.type === 'single' && selectedAnswer && !showUserAnswer" class="info-collect__confirm">
        <SpButton @click="confirmSelection">确定</SpButton>
      </div>
    </div>

    <div v-if="stepConfig?.skippable && !showUserAnswer" class="info-collect__skip">
      <button class="info-collect__skip-btn" @click="skip">跳过这一步</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import SpButton from '@/components/ui/SpButton.vue'
import SpProgressBar from '@/components/ui/SpProgressBar.vue'
import ChatBubble from '@/components/business/ChatBubble.vue'
import OptionCard from '@/components/business/OptionCard.vue'
import { useInfoCollectStore, INFO_COLLECT_STEPS } from '@/stores/infoCollect'

const router = useRouter()
const store = useInfoCollectStore()

const textAnswer = ref('')

onMounted(() => {
  store.loadFromStorage()
})

const currentStep = computed(() => store.currentStep)
const totalSteps = computed(() => store.totalSteps)
const isFirst = computed(() => store.isFirst)
const stepConfig = computed(() => store.currentStepConfig)
const showUserAnswer = ref(false)
const selectedAnswer = ref('')

const currentQuestion = computed(() => stepConfig.value?.question || [])
const quickTags = computed(() => stepConfig.value?.quickTags)
const placeholderText = '简单说说你的想法...'

watch(currentStep, () => {
  showUserAnswer.value = false
  selectedAnswer.value = ''
  textAnswer.value = ''
})

const selectOption = (option: string) => {
  selectedAnswer.value = option
  if (stepConfig.value) {
    store.setAnswer(stepConfig.value.field, option)
  }
}

const confirmSelection = async () => {
  if (!selectedAnswer.value) return
  showUserAnswer.value = true

  setTimeout(async () => {
    if (store.isLast) {
      await store.next()
      router.push('/mbti-intro')
    } else {
      store.next()
    }
  }, 500)
}

const submitText = () => {
  if (!textAnswer.value.trim()) return
  selectOption(textAnswer.value.trim())
}

const goBack = () => {
  store.prev()
  showUserAnswer.value = false
  selectedAnswer.value = ''
}

const skip = () => {
  store.skip()
  showUserAnswer.value = false
  selectedAnswer.value = ''
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/responsive';

.info-collect {
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
    gap: $space-md;
    margin-bottom: $space-md;
  }

  &__back {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: $space-sm;
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

  &__step {
    font-size: $text-sm;
    font-weight: 600;
    color: $color-gray-500;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &__progress {
    margin-bottom: $space-2xl;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: $space-xl;
  }

  &__user-answer {
    margin-top: $space-sm;
  }

  &__options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $space-md;

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__text-input {
    display: flex;
    flex-direction: column;
    gap: $space-lg;
  }

  &__quick-tags {
    display: flex;
    flex-wrap: wrap;
    gap: $space-sm;
  }

  &__quick-tag {
    padding: $space-sm $space-lg;
    background-color: white;
    border: 1.5px solid $color-gray-200;
    border-radius: $radius-full;
    font-size: $text-sm;
    font-weight: 500;
    color: $color-gray-700;
    cursor: pointer;
    transition: all $transition-fast;

    [data-theme="dark"] & {
      background-color: #1E293B;
      border-color: #334155;
      color: #E2E8F0;
    }

    &:hover {
      border-color: $color-brand-primary;
      color: $color-brand-primary;
      background: $color-brand-primary-light;

      [data-theme="dark"] & {
        border-color: #818CF8;
        color: #818CF8;
        background: rgba(99, 102, 241, 0.2);
      }
    }

    &--selected {
      border-color: $color-brand-primary;
      background: $color-brand-primary;
      color: white;

      [data-theme="dark"] & {
        background: #6366F1;
        border-color: #6366F1;
        color: white;
      }
    }
  }

  &__confirm {
    margin-top: $space-lg;

    @include mobile {
      :deep(button) {
        width: 100%;
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

  &__skip {
    text-align: center;
    margin-top: $space-2xl;
  }

  &__skip-btn {
    font-size: $text-sm;
    font-weight: 500;
    color: $color-gray-500;
    cursor: pointer;
    padding: $space-sm $space-lg;
    border-radius: $radius-lg;
    transition: all $transition-fast;

    [data-theme="dark"] & {
      color: #94A3B8;
    }

    &:hover {
      color: $color-brand-primary;
      background: $color-brand-primary-light;

      [data-theme="dark"] & {
        color: #818CF8;
        background: rgba(99, 102, 241, 0.2);
      }
    }
  }
}
</style>
