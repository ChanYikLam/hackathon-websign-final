<template>
  <div class="analysis-loading">
    <div class="analysis-loading__content">
      <svg viewBox="0 0 300 200" class="analysis-loading__illustration" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Background shapes -->
        <circle cx="150" cy="100" r="80" fill="#EEF2FF" />
        <circle cx="150" cy="100" r="60" fill="#E0E7FF" />

        <!-- Person analyzing data -->
        <circle cx="130" cy="80" r="20" fill="#C7D2FE" />
        <circle cx="130" cy="72" r="12" fill="#FCD34D" />
        <path d="M118 88 Q130 98 142 88" stroke="#6366F1" stroke-width="2" stroke-linecap="round" fill="none" />

        <!-- Charts and graphs -->
        <rect x="170" y="60" width="60" height="50" rx="6" fill="white" />
        <rect x="175" y="85" width="10" height="20" rx="2" fill="#6366F1" />
        <rect x="190" y="75" width="10" height="30" rx="2" fill="#818CF8" />
        <rect x="205" y="65" width="10" height="40" rx="2" fill="#10B981" />

        <!-- AI brain processing -->
        <g class="analysis-loading__pulse">
          <circle cx="80" cy="120" r="30" fill="none" stroke="#6366F1" stroke-width="2" opacity="0.3" />
          <circle cx="80" cy="120" r="20" fill="none" stroke="#6366F1" stroke-width="2" opacity="0.5" />
          <circle cx="80" cy="120" r="10" fill="#6366F1" opacity="0.8" />
        </g>

        <!-- Connection lines -->
        <path d="M110 90 Q130 110 160 100" stroke="#C7D2FE" stroke-width="2" stroke-dasharray="4 4" />
        <path d="M100 120 Q120 115 130 100" stroke="#E0E7FF" stroke-width="2" stroke-dasharray="4 4" />

        <!-- Floating elements -->
        <g class="analysis-loading__float analysis-loading__float--1">
          <rect x="220" y="40" width="40" height="30" rx="6" fill="white" />
          <text x="240" y="60" font-size="8" fill="#6366F1" text-anchor="middle" font-weight="700">AI</text>
        </g>

        <g class="analysis-loading__float analysis-loading__float--2">
          <rect x="40" y="150" width="50" height="35" rx="6" fill="white" />
          <text x="65" y="170" font-size="8" fill="#10B981" text-anchor="middle" font-weight="600">分析中</text>
        </g>
      </svg>

      <SpProgressBar :current="progress" :total="100" :show-text="true" class="analysis-loading__progress" />

      <p class="analysis-loading__message">{{ loadingMessage }}</p>

      <p class="analysis-loading__sub-message">请稍等，我们正在为你量身分析</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SpProgressBar from '@/components/ui/SpProgressBar.vue'
import { useMbtiStore } from '@/stores/mbti'
import { useInfoCollectStore } from '@/stores/infoCollect'
import { useResultStore } from '@/stores/result'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { analysisService } from '@/services/api'
import { MOCK_ANALYSIS_RESULT } from '@/services/mockData'

const router = useRouter()
const mbtiStore = useMbtiStore()
const infoCollectStore = useInfoCollectStore()
const resultStore = useResultStore()
const authStore = useAuthStore()
const appStore = useAppStore()

const progress = ref(0)
const loadingMessage = ref('正在分析你的性格特征...')

const messages = [
  { threshold: 0, message: '正在分析你的性格特征...' },
  { threshold: 30, message: '正在匹配适合你的行业方向...' },
  { threshold: 60, message: '正在生成个性化创业方案...' },
  { threshold: 90, message: '马上就好...' }
]

onMounted(async () => {
  const interval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += Math.random() * 5
      if (progress.value > 100) progress.value = 100

      const currentMsg = messages.filter(m => progress.value >= m.threshold).pop()
      if (currentMsg) {
        loadingMessage.value = currentMsg.message
      }
    }
  }, 100)

  // 如果用户跳过测试直接输入了 MBTI 类型，则使用已设置的结果
  // 只有在需要计算时才调用 calculateResult()
  if (!mbtiStore.result) {
    const mbtiResult = mbtiStore.calculateResult()
    mbtiStore.setResult(mbtiResult)
  }

  if (authStore.isDemoMode) {
    // Demo 模式：使用本地 mock 数据
    await new Promise(resolve => setTimeout(resolve, 2000))
    resultStore.setResult(MOCK_ANALYSIS_RESULT)
  } else {
    // 正式模式：调用后端 API 触发分析并获取结果
    try {
      // 1. 触发分析任务
      const triggerRes = await analysisService.trigger()
      const taskId = (triggerRes as any)?.data?.task_id

      // 2. 轮询等待分析完成
      if (taskId) {
        let isCompleted = false
        while (!isCompleted) {
          const statusRes = await analysisService.getStatus(taskId)
          const statusData = (statusRes as any)?.data
          if (statusData?.status === 'completed') {
            isCompleted = true
            // 根据实际进度更新进度条
            progress.value = 90
          } else if (statusData?.status === 'failed') {
            // 处理失败情况，避免无限循环
            appStore.showToast('分析任务执行失败，请重试', 'error')
            setTimeout(() => {
              router.push('/mbti-intro')
            }, 2000)
            isCompleted = true
          } else if (statusData?.progress) {
            progress.value = Math.max(progress.value, statusData.progress * 0.9)
          }
          if (!isCompleted) {
            await new Promise(resolve => setTimeout(resolve, 3000))
          }
        }
      }

      // 3. 获取分析结果
      const resultRes = await analysisService.getResult()
      if ((resultRes as any)?.data) {
        const raw = (resultRes as any).data
        // 将后端扁平数据转换为前端嵌套格式
        const formattedResult = {
          profile: {
            tags: raw.profile_tags || [],
            description: raw.profile_desc || ''
          },
          directions: raw.directions || [],
          user_type: {
            type: raw.user_type || '',
            label: raw.user_type_label || '',
            description: raw.user_type_desc || '',
            strategy: raw.user_type_strategy || ''
          },
          summary: {
            your_profile: raw.summary_profile || '',
            recommended_directions: raw.summary_directions || '',
            strategy_advice: raw.summary_strategy || '',
            city_advice: raw.summary_city_advice || '',
            first_month_checklist: (raw.summary_checklist || []).map((item: string, idx: number) => ({
              id: idx + 1,
              content: item,
              completed: false
            })),
            expected_timeline: raw.summary_timeline || ''
          },
          generated_at: raw.generated_at || new Date().toISOString()
        }
        resultStore.setResult(formattedResult)
      } else {
        // API 返回异常时使用 mock 数据兜底
        resultStore.setResult(MOCK_ANALYSIS_RESULT)
      }
    } catch {
      resultStore.setResult(MOCK_ANALYSIS_RESULT)
    }
  }

  progress.value = 100
  loadingMessage.value = '分析完成！'

  setTimeout(() => {
    clearInterval(interval)
    router.push('/result')
  }, 500)
})
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/responsive';

.analysis-loading {
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
  }

  &__content {
    text-align: center;
    max-width: 480px;
    width: 100%;
    padding: $space-2xl;
    background: white;
    border-radius: $radius-2xl;
    box-shadow: $shadow-xl;

    [data-theme="dark"] & {
      background: #1E293B;
    }

    @include mobile {
      padding: $space-xl $space-lg;
      border-radius: $radius-xl;
    }
  }

  &__illustration {
    width: 100%;
    max-width: 320px;
    height: auto;
    margin-bottom: $space-2xl;
  }

  &__pulse {
    animation: pulse-ring 1.5s ease-out infinite;
  }

  &__float {
    animation: float 2s ease-in-out infinite;

    &--1 { animation-delay: 0s; }
    &--2 { animation-delay: 1s; }
  }

  &__progress {
    margin-bottom: $space-2xl;
  }

  &__message {
    font-size: $text-lg;
    font-weight: 600;
    color: $color-gray-900;
    margin-bottom: $space-sm;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__sub-message {
    font-size: $text-sm;
    color: $color-gray-500;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}
</style>
