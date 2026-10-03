<template>
  <div class="review">
    <div class="review__container">
      <h1 class="review__title">长期复盘</h1>
      <p class="review__desc">持续迭代你的创业之路</p>

      <div class="review__form">
        <div class="review__field">
          <label class="review__label">复盘周期</label>
          <div class="review__cycles">
            <button
              v-for="cycle in cycles"
              :key="cycle.value"
              :class="['review__cycle', { 'review__cycle--active': form.cycle === cycle.value }]"
              @click="form.cycle = cycle.value"
            >
              {{ cycle.label }}
            </button>
          </div>
        </div>

        <div class="review__field">
          <label class="review__label">本期收入</label>
          <SpInput v-model="form.revenue" placeholder="如：500元" />
        </div>

        <div class="review__field">
          <label class="review__label">本期流量</label>
          <SpInput v-model="form.traffic" placeholder="如：1200 UV" />
        </div>

        <div class="review__field">
          <label class="review__label">本期客户数</label>
          <SpInput v-model="form.customers" placeholder="如：3" />
        </div>

        <div class="review__field">
          <label class="review__label">效率改善</label>
          <textarea
            v-model="form.efficiency"
            class="review__textarea"
            placeholder="用AI助手后，内容产出效率提升了一倍"
          ></textarea>
        </div>

        <div class="review__field">
          <label class="review__label">下期目标</label>
          <textarea
            v-model="form.next_goal"
            class="review__textarea"
            placeholder="下周发布5篇内容，争取新增200粉丝"
          ></textarea>
        </div>

        <SpButton block :loading="isSubmitting" @click="handleSubmit">保存复盘记录</SpButton>
      </div>

      <div v-if="reviews.length" class="review__history">
        <h2 class="review__history-title">历史复盘</h2>
        <div
          v-for="item in reviews"
          :key="item.id"
          class="review__item"
        >
          <div class="review__item-header">
            <span class="review__item-period">{{ item.period_label }}</span>
            <span :class="['review__item-badge', `review__item-badge--${item.cycle}`]">
              {{ item.cycle === 'weekly' ? '周' : item.cycle === 'monthly' ? '月' : '季度' }}
            </span>
          </div>
          <div v-if="item.revenue || item.traffic || item.customers" class="review__item-stats">
            <span v-if="item.revenue">收入：{{ item.revenue }}</span>
            <span v-if="item.traffic">流量：{{ item.traffic }}</span>
            <span v-if="item.customers">客户：{{ item.customers }}</span>
          </div>
          <p v-if="item.next_goal" class="review__item-goal">目标：{{ item.next_goal }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import SpButton from '@/components/ui/SpButton.vue'
import SpInput from '@/components/ui/SpInput.vue'
import { useAppStore } from '@/stores/app'
import { reviewService } from '@/services/api'

const appStore = useAppStore()

const cycles: { label: string; value: 'weekly' | 'monthly' | 'quarterly' }[] = [
  { label: '周', value: 'weekly' },
  { label: '月', value: 'monthly' },
  { label: '季度', value: 'quarterly' }
]

const form = reactive<{
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

const reviews = ref<any[]>([])
const isSubmitting = ref(false)

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

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const periodLabel = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long'
    })
    await reviewService.create({
      ...form,
      period_label: periodLabel
    })
    appStore.showToast('复盘记录已保存', 'success')
    Object.assign(form, {
      revenue: '',
      traffic: '',
      customers: '',
      efficiency: '',
      next_goal: ''
    })
  } catch (error) {
    appStore.showToast('保存失败，请稍后重试', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/responsive';

.review {
  min-height: 100vh;
  background: linear-gradient(180deg, $color-gray-50 0%, white 100%);
  padding: $space-xl;

  @include mobile {
    padding: $space-md;
  }

  &__container {
    max-width: 600px;
    margin: 0 auto;
  }

  &__title {
    font-size: $text-2xl;
    font-weight: 800;
    color: $color-gray-900;
    text-align: center;
    margin-bottom: $space-xs;
    letter-spacing: -0.5px;
  }

  &__desc {
    font-size: $text-base;
    color: $color-gray-500;
    text-align: center;
    margin-bottom: $space-2xl;
  }

  &__form {
    background: white;
    padding: $space-xl;
    border-radius: $radius-xl;
    box-shadow: $shadow-lg;
    border: 1px solid rgba($color-brand-primary, 0.06);
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
  }

  &__cycles {
    display: flex;
    gap: $space-sm;
  }

  &__cycle {
    flex: 1;
    padding: $space-md;
    font-size: $text-sm;
    font-weight: 500;
    border: 1.5px solid $color-gray-200;
    border-radius: $radius-lg;
    cursor: pointer;
    transition: all $transition-fast;
    background: white;

    &--active {
      border-color: $color-brand-primary;
      background: $color-brand-primary-light;
      color: $color-brand-primary;
      font-weight: 600;
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

    &:focus {
      outline: none;
      border-color: $color-brand-primary;
      box-shadow: 0 0 0 4px rgba($color-brand-primary, 0.08);
    }
  }

  &__history {
    margin-top: $space-2xl;
  }

  &__history-title {
    font-size: $text-lg;
    font-weight: 700;
    color: $color-gray-900;
    margin-bottom: $space-lg;
  }

  &__item {
    background: white;
    padding: $space-lg;
    border-radius: $radius-xl;
    margin-bottom: $space-md;
    box-shadow: $shadow-sm;
    border: 1px solid rgba($color-brand-primary, 0.06);
    transition: all $transition-fast;

    &:hover {
      box-shadow: $shadow-md;
    }

    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $space-sm;
    }

    &-period {
      font-size: $text-sm;
      font-weight: 600;
      color: $color-gray-900;
    }

    &-badge {
      font-size: $text-xs;
      font-weight: 600;
      padding: $space-xs $space-sm;
      border-radius: $radius-full;

      &--weekly {
        background-color: $color-brand-primary-light;
        color: $color-brand-primary;
      }

      &--monthly {
        background-color: $color-success-light;
        color: $color-success;
      }

      &--quarterly {
        background-color: $color-warning-light;
        color: $color-warning;
      }
    }

    &-stats {
      display: flex;
      gap: $space-lg;
      font-size: $text-sm;
      color: $color-gray-600;
      margin-bottom: $space-sm;

      @include mobile {
        flex-direction: column;
        gap: $space-xs;
      }
    }

    &-goal {
      font-size: $text-sm;
      color: $color-gray-500;
    }
  }
}
</style>
