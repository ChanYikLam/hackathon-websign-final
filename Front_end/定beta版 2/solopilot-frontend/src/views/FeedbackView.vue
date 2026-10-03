<template>
  <div class="feedback">
    <div class="feedback__container">
      <h1 class="feedback__title">你的建议还满意吗？</h1>

      <div class="feedback__rating">
        <SpRating v-model="rating" />
        <p class="feedback__rating-label">{{ ratingLabels[rating - 1] || '请选择评分' }}</p>
      </div>

      <div class="feedback__comment">
        <label class="feedback__label">你目前最大的困惑是什么？</label>
        <textarea
          v-model="comment"
          class="feedback__textarea"
          placeholder="简单说说你的想法..."
          maxlength="500"
        ></textarea>
        <span class="feedback__char-count">{{ comment.length }} / 500</span>
      </div>

      <SpButton
        size="lg"
        block
        :disabled="!rating"
        :loading="isSubmitting"
        @click="handleSubmit"
      >
        提交反馈
      </SpButton>

      <div class="feedback__actions">
        <SpButton variant="ghost" @click="skip">稍后再说</SpButton>
        <SpButton variant="secondary" @click="goToCompliance">查看合规指引</SpButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SpButton from '@/components/ui/SpButton.vue'
import SpRating from '@/components/ui/SpRating.vue'
import { useAppStore } from '@/stores/app'
import { feedbackService } from '@/services/api'

const router = useRouter()
const appStore = useAppStore()

const rating = ref(0)
const comment = ref('')
const isSubmitting = ref(false)

const ratingLabels = ['很差', '较差', '一般', '不错', '很好']

const handleSubmit = async () => {
  if (!rating.value) return
  isSubmitting.value = true

  try {
    await feedbackService.submit({
      rating: rating.value,
      comment: comment.value
    })
    appStore.showToast('感谢你的反馈！', 'success')
    setTimeout(() => {
      router.push('/compliance')
    }, 1500)
  } catch (error) {
    appStore.showToast('提交失败，请稍后重试', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const skip = () => {
  router.push('/')
}

const goToCompliance = () => {
  router.push('/compliance')
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/responsive';

.feedback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-xl;
  background: linear-gradient(135deg, $color-brand-primary-light 0%, white 50%, $color-brand-accent-light 100%);

  [data-theme="dark"] & {
    background: linear-gradient(135deg, #312E81 0%, #1E293B 50%, #064E3B 100%);
  }

  @include mobile {
    padding: $space-md;
    align-items: flex-start;
    padding-top: $space-xl;
  }

  &__container {
    width: 100%;
    max-width: 520px;
    background: white;
    border-radius: $radius-2xl;
    padding: $space-2xl;
    box-shadow: $shadow-xl;
    border: 1px solid rgba($color-brand-primary, 0.08);

    [data-theme="dark"] & {
      background: #1E293B;
      border-color: rgba(255, 255, 255, 0.1);
    }

    @include mobile {
      padding: $space-lg;
      border-radius: $radius-xl;
    }
  }

  &__title {
    font-size: $text-xl;
    font-weight: 700;
    color: $color-gray-900;
    text-align: center;
    margin-bottom: $space-xl;
    letter-spacing: -0.3px;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__rating {
    text-align: center;
    margin-bottom: $space-xl;
  }

  &__rating-label {
    font-size: $text-sm;
    color: $color-gray-500;
    margin-top: $space-md;
    font-weight: 500;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &__comment {
    margin-bottom: $space-xl;
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

  &__char-count {
    display: block;
    text-align: right;
    font-size: $text-xs;
    color: $color-gray-400;
    margin-top: $space-sm;

    [data-theme="dark"] & {
      color: #64748B;
    }
  }

  &__actions {
    display: flex;
    gap: $space-md;
    justify-content: center;
    margin-top: $space-xl;

    @include mobile {
      flex-direction: column;

      :deep(button) {
        width: 100%;
      }
    }
  }
}
</style>
