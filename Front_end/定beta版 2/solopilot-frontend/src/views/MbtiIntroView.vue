<template>
  <div class="mbti-intro">
    <div class="mbti-intro__content">
      <div class="mbti-intro__icon">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#EEF2FF" />
          <circle cx="60" cy="45" r="18" fill="#C7D2FE" />
          <path d="M42 68 Q60 82 78 68" stroke="#6366F1" stroke-width="4" stroke-linecap="round" fill="none" />
          <rect x="38" y="78" width="44" height="28" rx="6" fill="#6366F1" opacity="0.2" />

          <!-- MBTI letters decoration -->
          <text x="25" y="30" font-size="12" fill="#818CF8" font-weight="bold">M</text>
          <text x="85" y="30" font-size="12" fill="#818CF8" font-weight="bold">B</text>
          <text x="25" y="100" font-size="12" fill="#818CF8" font-weight="bold">T</text>
          <text x="85" y="100" font-size="12" fill="#818CF8" font-weight="bold">I</text>
        </svg>
      </div>

      <h1 class="mbti-intro__title">性格测评</h1>
      <p class="mbti-intro__desc">
        通过专业的 MBTI 性格测试，了解你的创业特质，找到最适合你的一人公司方向
      </p>

      <div class="mbti-intro__features">
        <div class="mbti-intro__feature">
          <div class="mbti-intro__feature-icon">
            <Icon icon="mdi:clock-outline" />
          </div>
          <div class="mbti-intro__feature-text">
            <h3>约 10-15 分钟</h3>
            <p>快速完成，不占用太多时间</p>
          </div>
        </div>

        <div class="mbti-intro__feature">
          <div class="mbti-intro__feature-icon">
            <Icon icon="mdi:format-list-numbered" />
          </div>
          <div class="mbti-intro__feature-text">
            <h3>93 道精选题</h3>
            <p>从情境行为到词语偏好，全面分析</p>
          </div>
        </div>

        <div class="mbti-intro__feature">
          <div class="mbti-intro__feature-icon">
            <Icon icon="mdi:brain" />
          </div>
          <div class="mbti-intro__feature-text">
            <h3>基于 MBTI 模型</h3>
            <p>国际通用的性格分析框架</p>
          </div>
        </div>
      </div>

      <div class="mbti-intro__tips">
        <h3>答题小贴士</h3>
        <ul>
          <li>
            <Icon icon="mdi:check-circle" />
            没有"正确答案"，按第一反应选择即可
          </li>
          <li>
            <Icon icon="mdi:check-circle" />
            尽量选择你"更可能"做的，而不是"应该"做的
          </li>
          <li>
            <Icon icon="mdi:check-circle" />
            可以随时保存退出，下次继续答题
          </li>
        </ul>
      </div>

      <div class="mbti-intro__skip">
        <p class="mbti-intro__skip-label">或如果已知你的 MBTI 类型：</p>
        <div class="mbti-intro__skip-input">
          <input
            v-model="mbtiInput"
            type="text"
            placeholder="输入如 ENFP"
            maxlength="4"
            class="mbti-intro__input"
            @keyup.enter="skipTest"
          />
          <SpButton @click="skipTest">跳过测试</SpButton>
        </div>
      </div>

      <div class="mbti-intro__actions">
        <SpButton size="lg" @click="startTest">开始测试</SpButton>
        <button class="mbti-intro__back" @click="goBack">返回上一步</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import SpButton from '@/components/ui/SpButton.vue'
import { useMbtiStore } from '@/stores/mbti'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const store = useMbtiStore()
const appStore = useAppStore()

const mbtiInput = ref('')

const isValidMbti = computed(() => {
  const pattern = /^[EI][NS][FT][JP]$/i
  return pattern.test(mbtiInput.value)
})

const startTest = () => {
  // 开始测试，重置答题进度
  store.reset()
  router.push('/mbti-test')
}

const skipTest = async () => {
  if (!isValidMbti.value) {
    appStore.showToast('请输入有效的 MBTI 类型（如 ENFP、INTJ）', 'error')
    return
  }
  const upperMbti = mbtiInput.value.toUpperCase()
  const result = await store.skipWithMbtiType(upperMbti)
  if (result.success) {
    router.push('/analyzing')
  } else {
    appStore.showToast(result.error || '跳过测试失败', 'error')
  }
}

const goBack = () => {
  router.push('/info-collect-intro')
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/responsive';

.mbti-intro {
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
    font-size: $text-sm;
    color: $color-gray-600;
    line-height: 1.6;
    margin-bottom: $space-lg;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &__features {
    display: flex;
    flex-direction: column;
    gap: $space-md;
    margin-bottom: $space-xl;
    text-align: left;
  }

  &__feature {
    display: flex;
    align-items: center;
    gap: $space-md;
    padding: $space-lg;
    background: $color-gray-50;
    border-radius: $radius-xl;

    [data-theme="dark"] & {
      background: rgba(99, 102, 241, 0.1);
    }
  }

  &__feature-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-brand-primary-light;
    border-radius: $radius-lg;

    [data-theme="dark"] & {
      background: rgba(99, 102, 241, 0.2);
    }

    svg {
      font-size: 24px;
      color: $color-brand-primary;

      [data-theme="dark"] & {
        color: #818CF8;
      }
    }
  }

  &__feature-text {
    flex: 1;

    h3 {
      font-size: $text-base;
      font-weight: 700;
      color: $color-gray-900;
      margin-bottom: 2px;

      [data-theme="dark"] & {
        color: #F8FAFC;
      }
    }

    p {
      font-size: $text-sm;
      color: $color-gray-500;
      margin: 0;

      [data-theme="dark"] & {
        color: #94A3B8;
      }
    }
  }

  &__tips {
    padding: $space-lg;
    background: $color-brand-primary-light;
    border-radius: $radius-xl;
    margin-bottom: $space-xl;
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

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        display: flex;
        align-items: center;
        gap: $space-sm;
        font-size: $text-sm;
        color: $color-gray-700;
        line-height: 1.8;

        [data-theme="dark"] & {
          color: #C7D2FE;
        }

        svg {
          font-size: 16px;
          color: $color-brand-accent;
          flex-shrink: 0;

          [data-theme="dark"] & {
            color: #34D399;
          }
        }
      }
    }
  }

  &__skip {
    margin-bottom: $space-xl;
    text-align: center;
  }

  &__skip-label {
    font-size: $text-sm;
    color: $color-gray-500;
    margin-bottom: $space-md;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &__skip-input {
    display: flex;
    gap: $space-sm;
    justify-content: center;
    align-items: center;

    @include mobile {
      flex-direction: column;
    }
  }

  &__input {
    padding: $space-sm $space-lg;
    font-size: $text-base;
    border: 1.5px solid $color-gray-200;
    border-radius: $radius-lg;
    background: white;
    color: $color-gray-900;
    width: 120px;
    text-align: center;
    font-weight: 600;
    text-transform: uppercase;
    transition: all $transition-fast;

    [data-theme="dark"] & {
      background: #1E293B;
      border-color: #334155;
      color: #F8FAFC;
    }

    &:focus {
      outline: none;
      border-color: $color-brand-primary;
      box-shadow: 0 0 0 4px rgba($color-brand-primary, 0.1);

      [data-theme="dark"] & {
        border-color: #6366F1;
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
      }
    }

    &::placeholder {
      color: $color-gray-400;
      text-transform: none;
      font-weight: 400;

      [data-theme="dark"] & {
        color: #64748B;
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
