import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { infoCollectService } from '@/services/api'

export interface InfoCollectAnswers {
  city?: string
  gender?: string
  intensity?: string
  skill?: string
  direction?: string
  purpose?: string
  schedule?: string
  skill_other?: string
}

export interface StepConfig {
  id: number
  field: keyof InfoCollectAnswers
  question: string[]
  type: 'single' | 'text'
  options?: string[]
  skippable: boolean
  quickTags?: string[]
}

export const INFO_COLLECT_STEPS: StepConfig[] = [
  {
    id: 1,
    field: 'city',
    question: ['你现在所在的城市属于哪个等级？'],
    type: 'single',
    options: ['一线城市', '新一线城市', '二线城市', '三线及以下'],
    skippable: false
  },
  {
    id: 2,
    field: 'gender',
    question: ['你的性别是？（这个是可选的）'],
    type: 'single',
    options: ['男', '女'],
    skippable: true
  },
  {
    id: 3,
    field: 'intensity',
    question: ['你比较偏好怎样的工作节奏？'],
    type: 'single',
    options: ['007', '996', '965', '越少工作越好'],
    skippable: false
  },
  {
    id: 4,
    field: 'skill',
    question: ['在你目前的工作或生活中，你最擅长什么？', '不需要很专业，哪怕是"很会整理东西"也可以。'],
    type: 'single',
    options: ['写作内容', '编程技术', '设计美术', '销售商务', '教学培训', '行业专业', '暂不确定', '其他'],
    skippable: false
  },
  {
    id: 5,
    field: 'direction',
    question: ['以下哪个方向最让你心动？'],
    type: 'single',
    options: [
      '知识付费与内容创作',
      '独立开发与微型SaaS',
      '专业技能咨询与服务',
      '跨境与利基电商',
      'AI驱动的服务业务',
      '实体轻服务',
      '信息中介与资源对接'
    ],
    skippable: false
  },
  {
    id: 6,
    field: 'purpose',
    question: ['你想成立一人公司，最主要是为了什么？'],
    type: 'text',
    skippable: false,
    quickTags: ['增加收入', '时间自由', '实现想法', '不再打工']
  },
  {
    id: 7,
    field: 'schedule',
    question: ['你更适合哪种工作时间安排？'],
    type: 'single',
    options: ['固定时间坐班型-长白班', '固定时间坐班型-夜猫子', '零碎工作时间类型-碎片化响应', '零碎工作时间类型-大块专注时段', '都可以'],
    skippable: false
  }
]

export const useInfoCollectStore = defineStore('infoCollect', () => {
  const currentStep = ref(1)
  const answers = ref<InfoCollectAnswers>({})
  const isCompleted = ref(false)

  const totalSteps = computed(() => INFO_COLLECT_STEPS.length)

  const progress = computed(() => {
    return Math.round((Object.keys(answers.value).length / totalSteps.value) * 100)
  })

  const currentStepConfig = computed(() => {
    return INFO_COLLECT_STEPS.find(step => step.id === currentStep.value)
  })

  const setAnswer = async (field: keyof InfoCollectAnswers, value: string) => {
    answers.value[field] = value
    
    const stepConfig = currentStepConfig.value
    if (stepConfig) {
      try {
        await infoCollectService.saveStep(stepConfig.id, value)
      } catch (error) {
        console.error('Failed to save step to server:', error)
      }
    }
    
    saveToStorage()
  }

  const next = async () => {
    if (currentStep.value < totalSteps.value) {
      currentStep.value++
      saveToStorage()
    } else {
      try {
        await infoCollectService.complete()
        isCompleted.value = true
        saveToStorage()
      } catch (error) {
        console.error('Failed to complete info collection:', error)
      }
    }
  }

  const prev = () => {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  const skip = async () => {
    const stepConfig = currentStepConfig.value
    if (stepConfig && stepConfig.skippable) {
      answers.value[stepConfig.field] = null as any
      try {
        await infoCollectService.saveStep(stepConfig.id, '')
      } catch (error) {
        console.error('Failed to save skipped step:', error)
      }
      next()
    }
  }

  const isFirst = computed(() => currentStep.value === 1)
  const isLast = computed(() => currentStep.value === totalSteps.value)

  const saveToStorage = () => {
    localStorage.setItem('info_collect', JSON.stringify({
      currentStep: currentStep.value,
      answers: answers.value,
      isCompleted: isCompleted.value
    }))
  }

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('info_collect')
      if (stored) {
        const data = JSON.parse(stored)
        currentStep.value = typeof data.currentStep === 'number' ? data.currentStep : 1
        answers.value = typeof data.answers === 'object' && data.answers !== null ? data.answers : {}
        isCompleted.value = typeof data.isCompleted === 'boolean' ? data.isCompleted : false
      }
    } catch {
      localStorage.removeItem('info_collect')
    }
  }

  const reset = () => {
    currentStep.value = 1
    answers.value = {}
    isCompleted.value = false
    localStorage.removeItem('info_collect')
  }

  return {
    currentStep,
    answers,
    isCompleted,
    totalSteps,
    progress,
    currentStepConfig,
    isFirst,
    isLast,
    setAnswer,
    next,
    prev,
    skip,
    saveToStorage,
    loadFromStorage,
    reset
  }
})
