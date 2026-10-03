import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Profile {
  tags: string[]
  description: string
}

export interface Direction {
  rank: number
  name: string
  match_rate: number
  reason: string
  income_range: string
  case_brief: string
  startup_tips: string[]
}

export interface UserType {
  type: '保守型' | '平衡型' | '激进型'
  label: string
  description: string
  strategy: string
}

export interface Summary {
  your_profile: string
  recommended_directions: string
  strategy_advice: string
  city_advice: string
  first_month_checklist: { id: number; content: string; completed: boolean }[]
  expected_timeline: string
}

export interface AnalysisResult {
  profile: Profile
  directions: Direction[]
  user_type: UserType
  summary: Summary
  generated_at: string
}

export const useResultStore = defineStore('result', () => {
  const profile = ref<Profile | null>(null)
  const directions = ref<Direction[]>([])
  const userType = ref<UserType | null>(null)
  const summary = ref<Summary | null>(null)
  const generatedAt = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const hasResult = computed(() => !!profile.value && !!directions.value.length)

  const saveToStorage = () => {
    if (!profile.value) return
    localStorage.setItem('result', JSON.stringify({
      profile: profile.value,
      directions: directions.value,
      userType: userType.value,
      summary: summary.value,
      generatedAt: generatedAt.value
    }))
  }

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('result')
      if (stored) {
        const data = JSON.parse(stored)
        profile.value = data.profile || null
        directions.value = data.directions || []
        userType.value = data.userType || null
        summary.value = data.summary || null
        generatedAt.value = data.generatedAt || null
      }
    } catch {
      localStorage.removeItem('result')
    }
  }

  const setResult = (result: AnalysisResult) => {
    profile.value = result.profile
    directions.value = result.directions
    userType.value = result.user_type
    summary.value = result.summary
    generatedAt.value = result.generated_at
    saveToStorage()
  }

  const toggleChecklistItem = (itemId: number) => {
    if (summary.value) {
      const item = summary.value.first_month_checklist.find(i => i.id === itemId)
      if (item) {
        item.completed = !item.completed
      }
    }
  }

  const clearResult = () => {
    profile.value = null
    directions.value = []
    userType.value = null
    summary.value = null
    generatedAt.value = null
    error.value = null
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setError = (err: string | null) => {
    error.value = err
  }

  return {
    profile,
    directions,
    userType,
    summary,
    generatedAt,
    isLoading,
    error,
    hasResult,
    setResult,
    toggleChecklistItem,
    clearResult,
    setLoading,
    setError,
    loadFromStorage
  }
})
