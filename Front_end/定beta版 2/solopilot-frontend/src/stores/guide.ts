import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGuideStore = defineStore('guide', () => {
  const STORAGE_KEY = 'solo_guide_shown'

  // ---- AI Tab 引导（TabBar 红点 + Tooltip） ----
  const aiTabGuideShown = ref<boolean>(
    localStorage.getItem(STORAGE_KEY + '_ai_tab') === 'true'
  )

  const markAiTabGuideShown = () => {
    aiTabGuideShown.value = true
    localStorage.setItem(STORAGE_KEY + '_ai_tab', 'true')
  }

  // ---- AI Chat 悬浮窗引导（红点 + Tooltip + 蒙层） ----
  const aiChatFabGuideShown = ref<boolean>(
    localStorage.getItem(STORAGE_KEY + '_ai_chat_fab') === 'true'
  )

  const markAiChatFabGuideShown = () => {
    aiChatFabGuideShown.value = true
    localStorage.setItem(STORAGE_KEY + '_ai_chat_fab', 'true')
  }

  const aiChatPanelGuideShown = ref<boolean>(
    localStorage.getItem(STORAGE_KEY + '_ai_chat_panel') === 'true'
  )

  const markAiChatPanelGuideShown = () => {
    aiChatPanelGuideShown.value = true
    localStorage.setItem(STORAGE_KEY + '_ai_chat_panel', 'true')
  }

  // AiTeamView 蒙层引导
  const overlayGuideVisible = ref(false)
  const currentStep = ref(0)

  const showOverlayGuide = () => {
    if (!aiTabGuideShown.value) {
      overlayGuideVisible.value = true
      currentStep.value = 0
    }
  }

  const nextStep = () => {
    currentStep.value++
    if (currentStep.value >= 2) {
      closeOverlayGuide()
    }
  }

  const closeOverlayGuide = () => {
    overlayGuideVisible.value = false
    currentStep.value = 0
    markAiTabGuideShown()
  }

  // ---- AiChat 面板蒙层引导 ----
  const chatOverlayVisible = ref(false)
  const chatGuideStep = ref(0) // 0: 快捷提问 / 1: 输入框

  const showChatOverlayGuide = () => {
    if (!aiChatPanelGuideShown.value) {
      chatOverlayVisible.value = true
      chatGuideStep.value = 0
    }
  }

  const nextChatGuideStep = () => {
    chatGuideStep.value++
    if (chatGuideStep.value >= 2) {
      closeChatOverlayGuide()
    }
  }

  const closeChatOverlayGuide = () => {
    chatOverlayVisible.value = false
    chatGuideStep.value = 0
    markAiChatPanelGuideShown()
  }

  return {
    // AI Tab
    aiTabGuideShown,
    markAiTabGuideShown,
    // AI Chat
    aiChatFabGuideShown,
    markAiChatFabGuideShown,
    aiChatPanelGuideShown,
    markAiChatPanelGuideShown,
    // AiTeamView 蒙层
    overlayGuideVisible,
    currentStep,
    showOverlayGuide,
    nextStep,
    closeOverlayGuide,
    // AiChat 面板蒙层
    chatOverlayVisible,
    chatGuideStep,
    showChatOverlayGuide,
    nextChatGuideStep,
    closeChatOverlayGuide
  }
})
