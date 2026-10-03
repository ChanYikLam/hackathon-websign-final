<template>
  <div class="ai-chat">
    <!-- 引导 Tooltip（FAB 上方） -->
    <Transition name="ai-chat-tooltip">
      <div
        v-if="showFabTooltip"
        class="ai-chat__tooltip"
        @click.stop
      >
        <div class="ai-chat__tooltip-content">
          <div class="ai-chat__tooltip-icon">
            <Icon icon="mdi:lightbulb-on-outline" />
          </div>
          <div class="ai-chat__tooltip-text">
            <span class="ai-chat__tooltip-title">有问题？问 AI 助手</span>
            <span class="ai-chat__tooltip-desc">合规、税务、复盘建议，随时帮你</span>
          </div>
          <button class="ai-chat__tooltip-close" @click="dismissFabTooltip">
            <Icon icon="mdi:close" />
          </button>
        </div>
        <div class="ai-chat__tooltip-arrow"></div>
      </div>
    </Transition>

    <!-- 浮动按钮 -->
    <button
      ref="fabRef"
      class="ai-chat__fab"
      :class="{ 'ai-chat__fab--active': isOpen }"
      @click="toggleChat"
      aria-label="AI 助手"
    >
      <Icon v-if="!isOpen" icon="mdi:robot-happy-outline" class="ai-chat__fab-icon" />
      <Icon v-else icon="mdi:close" class="ai-chat__fab-icon" />
      <!-- 红点脉冲提示 -->
      <span v-if="showFabDot" class="ai-chat__fab-dot"></span>
      <span v-if="!isOpen && unreadCount > 0" class="ai-chat__badge">{{ unreadCount }}</span>
    </button>

    <!-- 聊天面板 -->
    <Transition name="ai-chat-panel">
      <div v-if="isOpen" class="ai-chat__panel">
        <!-- 头部 -->
        <div class="ai-chat__header">
          <div class="ai-chat__header-left">
            <div class="ai-chat__avatar">
              <Icon icon="mdi:robot-happy" />
            </div>
            <div>
              <h3 class="ai-chat__title">SoloPilot AI</h3>
              <span class="ai-chat__status">
                <span class="ai-chat__status-dot"></span>
                在线
              </span>
            </div>
          </div>
          <button class="ai-chat__clear" @click="clearMessages" aria-label="清空对话">
            <Icon icon="mdi:delete-sweep-outline" />
          </button>
        </div>

        <!-- 消息列表 -->
        <div ref="messageListRef" class="ai-chat__messages">
          <div v-if="messages.length === 0" class="ai-chat__empty">
            <div class="ai-chat__empty-icon">
              <Icon icon="mdi:lightbulb-outline" />
            </div>
            <p class="ai-chat__empty-text">有什么创业问题？直接问我就好</p>
            <div ref="quickActionsRef" class="ai-chat__quick-actions">
              <button
                v-for="action in quickActions"
                :key="action.text"
                class="ai-chat__quick-btn"
                @click="sendQuickMessage(action.text)"
              >
                {{ action.text }}
              </button>
            </div>
          </div>

          <div
            v-for="(msg, idx) in messages"
            :key="idx"
            :class="['ai-chat__message', `ai-chat__message--${msg.role}`]"
          >
            <div v-if="msg.role === 'assistant'" class="ai-chat__message-avatar">
              <Icon icon="mdi:robot-happy" />
            </div>
            <div class="ai-chat__message-bubble">
              <div class="ai-chat__message-text" v-html="renderMarkdown(msg.content)"></div>
            </div>
          </div>

          <!-- 打字指示器 -->
          <div v-if="isStreaming && streamingContent === ''" class="ai-chat__message ai-chat__message--assistant">
            <div class="ai-chat__message-avatar">
              <Icon icon="mdi:robot-happy" />
            </div>
            <div class="ai-chat__message-bubble">
              <div class="ai-chat__typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>

          <!-- 流式输出中的消息 -->
          <div v-if="isStreaming && streamingContent !== ''" class="ai-chat__message ai-chat__message--assistant">
            <div class="ai-chat__message-avatar">
              <Icon icon="mdi:robot-happy" />
            </div>
            <div class="ai-chat__message-bubble">
              <div class="ai-chat__message-text" v-html="renderMarkdown(streamingContent)"></div>
              <span class="ai-chat__cursor"></span>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div ref="inputAreaRef" class="ai-chat__input-area">
          <div class="ai-chat__input-wrapper">
            <textarea
              ref="inputRef"
              v-model="inputText"
              class="ai-chat__input"
              placeholder="问我任何创业问题..."
              rows="1"
              :disabled="isStreaming"
              @keydown.enter.exact="handleSend"
              @input="autoResize"
            ></textarea>
            <button
              :class="['ai-chat__send', { 'ai-chat__send--active': canSend }]"
              :disabled="!canSend"
              @click="handleSend"
              aria-label="发送"
            >
              <Icon icon="mdi:send" />
            </button>
          </div>
          <p class="ai-chat__disclaimer">AI 回复仅供参考，不构成法律建议</p>
        </div>

        <!-- 面板内蒙层引导 -->
        <Transition name="ai-chat-overlay">
          <div v-if="guideStore.chatOverlayVisible" class="ai-chat__guide-overlay" @click.self="closeChatGuide">
            <!-- Step 0: 快捷提问 -->
            <div v-if="guideStore.chatGuideStep === 0" class="ai-chat__guide-highlight ai-chat__guide-highlight--quick">
              <div class="ai-chat__guide-card">
                <div class="ai-chat__guide-card-icon">
                  <Icon icon="mdi:lightning-bolt" />
                </div>
                <div class="ai-chat__guide-card-content">
                  <h4 class="ai-chat__guide-card-title">快捷提问</h4>
                  <p class="ai-chat__guide-card-desc">点击预设问题，一键获取专业解答</p>
                </div>
                <button class="ai-chat__guide-card-btn" @click="nextChatStep">
                  下一步
                  <Icon icon="mdi:arrow-right" />
                </button>
              </div>
            </div>

            <!-- Step 1: 输入框 -->
            <div v-if="guideStore.chatGuideStep === 1" class="ai-chat__guide-highlight ai-chat__guide-highlight--input">
              <div class="ai-chat__guide-card">
                <div class="ai-chat__guide-card-icon">
                  <Icon icon="mdi:keyboard-outline" />
                </div>
                <div class="ai-chat__guide-card-content">
                  <h4 class="ai-chat__guide-card-title">自由提问</h4>
                  <p class="ai-chat__guide-card-desc">输入框里随便问，支持多轮对话</p>
                </div>
                <button class="ai-chat__guide-card-btn ai-chat__guide-card-btn--finish" @click="closeChatGuide">
                  开始使用
                  <Icon icon="mdi:check" />
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useGuideStore } from '@/stores/guide'
import { generateLawSummaryForAI } from '@/data/complianceData'

const guideStore = useGuideStore()

// ============ API 配置 ============
const API_CONFIG = {
  API_BASE: 'https://token.apps.gdmuna.com/v1',
  API_KEY: 'sk-hVUq7XQnBoGNuH2GAPJuXzfnsyG7lQfjVTcvPLSHqyP00k1V',
  MODEL: 'deepseek-v3.2',
  TIMEOUT: 15000
}

// ============ System Prompt ============
const SYSTEM_PROMPT = `你是 SoloPilot AI，一位专注于一人公司（Solopreneur）创业的智能助手。你的职责是：

1. 回答创业相关的合规、法律、税务问题
2. 帮助用户进行经营复盘和策略优化
3. 提供一人公司运营的实用建议
4. 解释商业法规和政策（以中国法律为主）

## 法律知识参考
${generateLawSummaryForAI()}

注意事项：
- 回答应具体、实用、有操作指导性
- 涉及法律问题时，在回答末尾提醒用户"如有疑问建议咨询专业律师"
- 使用中文回答，语气亲切但专业
- 如果用户问的问题与创业无关，礼貌地引导回创业话题
- 回复中使用 markdown 格式让内容更易读`

// ============ 类型定义 ============
interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// ============ 响应式状态 ============
const isOpen = ref(false)
const inputText = ref('')
const messages = ref<Message[]>([])
const isStreaming = ref(false)
const streamingContent = ref('')
const unreadCount = ref(0)
const messageListRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)
const quickActionsRef = ref<HTMLElement | null>(null)
const inputAreaRef = ref<HTMLElement | null>(null)
const fabRef = ref<HTMLElement | null>(null)
let abortController: AbortController | null = null

// ============ 引导状态 ============
const fabTooltipVisible = ref(!guideStore.aiChatFabGuideShown)

const showFabDot = computed(() => !guideStore.aiChatFabGuideShown)
const showFabTooltip = computed(() => fabTooltipVisible.value && !isOpen.value && !guideStore.aiChatFabGuideShown)

const dismissFabTooltip = () => {
  fabTooltipVisible.value = false
  guideStore.markAiChatFabGuideShown()
}

// ============ 快捷提问 ============
const quickActions = [
  { text: '不注册公司怎么收款' },
  { text: '个人要交哪些税' },
  { text: '怎么写复盘总结' },
  { text: '如何选个体还是公司' }
]

// ============ 计算属性 ============
const canSend = computed(() => inputText.value.trim().length > 0 && !isStreaming.value)

// ============ 方法 ============
const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    unreadCount.value = 0
    // 关闭 FAB 引导
    if (fabTooltipVisible.value) {
      fabTooltipVisible.value = false
      guideStore.markAiChatFabGuideShown()
    }
    nextTick(() => {
      inputRef.value?.focus()
      scrollToBottom()
      // 首次打开面板，延迟显示蒙层引导
      if (!guideStore.aiChatPanelGuideShown) {
        setTimeout(() => {
          guideStore.showChatOverlayGuide()
        }, 600)
      }
    })
  }
}

const nextChatStep = () => {
  guideStore.nextChatGuideStep()
}

const closeChatGuide = () => {
  guideStore.closeChatOverlayGuide()
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const clearMessages = () => {
  messages.value = []
  streamingContent.value = ''
}

const sendQuickMessage = (text: string) => {
  inputText.value = text
  handleSend()
}

const handleSend = async (e?: KeyboardEvent | MouseEvent) => {
  if (e) e.preventDefault()
  if (!canSend.value) return

  // 关闭引导蒙层
  if (guideStore.chatOverlayVisible) {
    guideStore.closeChatOverlayGuide()
  }

  const userMessage = inputText.value.trim()
  inputText.value = ''
  resetInputHeight()

  // 添加用户消息
  messages.value.push({ role: 'user', content: userMessage })

  // 构建 API 消息
  const apiMessages: Message[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.value
  ]

  // 开始流式请求
  isStreaming.value = true
  streamingContent.value = ''
  abortController = new AbortController()

  try {
    const response = await fetch(`${API_CONFIG.API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.API_KEY}`
      },
      body: JSON.stringify({
        model: API_CONFIG.MODEL,
        messages: apiMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2048
      }),
      signal: abortController.signal
    })

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('无法读取响应流')

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed === 'data: [DONE]') continue
        if (!trimmed.startsWith('data: ')) continue

        try {
          const json = JSON.parse(trimmed.slice(6))
          const delta = json.choices?.[0]?.delta?.content
          if (delta) {
            streamingContent.value += delta
            scrollToBottom()
          }
        } catch {
          // 忽略无法解析的行
        }
      }
    }

    // 流式结束，将内容存入消息列表
    if (streamingContent.value) {
      messages.value.push({ role: 'assistant', content: streamingContent.value })
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      // 用户主动取消
      if (streamingContent.value) {
        messages.value.push({ role: 'assistant', content: streamingContent.value + '\n\n*[回答已中断]*' })
      }
    } else {
      const errorMsg = '网络不太好，稍后再试一次吧'
      messages.value.push({ role: 'assistant', content: errorMsg })
      if (!isOpen.value) unreadCount.value++
    }
  } finally {
    isStreaming.value = false
    streamingContent.value = ''
    abortController = null
    scrollToBottom()
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}

const autoResize = () => {
  const el = inputRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}

const resetInputHeight = () => {
  const el = inputRef.value
  if (!el) return
  el.style.height = 'auto'
}

// ============ 简易 Markdown 渲染 ============
const renderMarkdown = (text: string): string => {
  if (!text) return ''
  return text
    // 代码块
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="ai-chat__code"><code>$2</code></pre>')
    // 行内代码
    .replace(/`([^`]+)`/g, '<code class="ai-chat__inline-code">$1</code>')
    // 粗体
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // 斜体
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // 标题
    .replace(/^### (.+)$/gm, '<h4 class="ai-chat__md-h">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="ai-chat__md-h">$1</h3>')
    // 无序列表
    .replace(/^- (.+)$/gm, '<li class="ai-chat__md-li">$1</li>')
    // 有序列表
    .replace(/^\d+\. (.+)$/gm, '<li class="ai-chat__md-li">$1</li>')
    // 换行
    .replace(/\n/g, '<br>')
}

// ============ 清理 ============
onUnmounted(() => {
  if (abortController) {
    abortController.abort()
  }
})
</script>

<style lang="scss" scoped>
.ai-chat {
  position: fixed;
  bottom: 80px;
  right: 24px;
  z-index: 9999;
  isolation: isolate;

  @media (max-width: $breakpoint-mobile) {
    bottom: 72px;
    right: 16px;
  }

  // ============ FAB 红点提示 ============
  &__fab-dot {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #EF4444;
    border: 2px solid white;
    z-index: 1;

    [data-theme="dark"] & {
      border-color: #1E293B;
    }

    &::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      background: rgba(#EF4444, 0.4);
      animation: fab-dot-pulse 2s ease-in-out infinite;
    }
  }

  // ============ 引导 Tooltip ============
  &__tooltip {
    position: absolute;
    bottom: calc(100% + 16px);
    right: 0;
    width: 260px;
    z-index: 10000;
    filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.15));

    @media (max-width: $breakpoint-mobile) {
      right: -4px;
      width: 240px;
    }

    [data-theme="dark"] & {
      filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.4));
    }
  }

  &__tooltip-content {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 14px 16px;
    background: white;
    border-radius: 14px;

    [data-theme="dark"] & {
      background: #1E293B;
    }
  }

  &__tooltip-icon {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: rgba($color-brand-primary, 0.1);
    color: $color-brand-primary;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;

    [data-theme="dark"] & {
      background: rgba(99, 102, 241, 0.15);
      color: #818CF8;
    }
  }

  &__tooltip-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
  }

  &__tooltip-title {
    font-size: 13px;
    font-weight: 700;
    color: $color-gray-900;
    white-space: nowrap;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__tooltip-desc {
    font-size: 11px;
    color: $color-gray-500;
    line-height: 1.4;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &__tooltip-close {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: $color-gray-400;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
    transition: all $transition-fast;

    &:hover {
      background: $color-gray-100;
      color: $color-gray-600;

      [data-theme="dark"] & {
        background: rgba(255, 255, 255, 0.08);
        color: #94A3B8;
      }
    }
  }

  &__tooltip-arrow {
    position: absolute;
    bottom: -6px;
    right: 24px;
    width: 12px;
    height: 12px;
    background: white;
    transform: rotate(45deg);
    border-radius: 2px;

    [data-theme="dark"] & {
      background: #1E293B;
    }
  }

  // ============ 浮动按钮 ============
  &__fab {
    position: relative;
    width: 56px;
    height: 56px;
    border-radius: $radius-full;
    border: none;
    cursor: pointer;
    background: linear-gradient(135deg, $color-brand-primary 0%, #818CF8 100%);
    color: white;
    box-shadow: 0 6px 24px rgba($color-brand-primary, 0.4);
    transition: all $transition-normal;
    display: flex;
    align-items: center;
    justify-content: center;

    [data-theme="dark"] & {
      background: linear-gradient(135deg, #4F46E5 0%, #6366F1 100%);
      box-shadow: 0 6px 24px rgba(99, 102, 241, 0.5);
    }

    &:hover {
      transform: scale(1.08);
      box-shadow: 0 8px 32px rgba($color-brand-primary, 0.5);

      [data-theme="dark"] & {
        box-shadow: 0 8px 32px rgba(99, 102, 241, 0.6);
      }
    }

    &:active {
      transform: scale(0.95);
    }

    &--active {
      background: $color-gray-700;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);

      [data-theme="dark"] & {
        background: #475569;
      }

      &:hover {
        transform: scale(1.08);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
      }
    }
  }

  &__fab-icon {
    font-size: 26px;
  }

  &__badge {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: $radius-full;
    background: $color-error;
    color: white;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  // ============ 聊天面板 ============
  &__panel {
    position: absolute;
    bottom: 68px;
    right: 0;
    width: 400px;
    height: 560px;
    border-radius: $radius-2xl;
    background: white;
    box-shadow: $shadow-xl;
    border: 1px solid rgba($color-brand-primary, 0.08);
    display: flex;
    flex-direction: column;
    overflow: hidden;

    [data-theme="dark"] & {
      background: #0F172A;
      border-color: rgba(255, 255, 255, 0.1);
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.6);
    }

    @media (max-width: $breakpoint-mobile) {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      border-radius: 0;
    }
  }

  // ============ 头部 ============
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $space-lg $space-xl;
    background: linear-gradient(135deg, $color-brand-primary 0%, #818CF8 100%);
    color: white;
    flex-shrink: 0;

    [data-theme="dark"] & {
      background: linear-gradient(135deg, #312E81 0%, #4338CA 100%);
    }
  }

  &__header-left {
    display: flex;
    align-items: center;
    gap: $space-md;
  }

  &__avatar {
    width: 36px;
    height: 36px;
    border-radius: $radius-full;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }

  &__title {
    font-size: $text-base;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.3px;
  }

  &__status {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: $text-xs;
    opacity: 0.9;
  }

  &__status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #34D399;
    animation: pulse-dot 2s ease-in-out infinite;
  }

  &__clear {
    width: 32px;
    height: 32px;
    border-radius: $radius-full;
    border: none;
    background: rgba(255, 255, 255, 0.15);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    transition: background $transition-fast;

    &:hover {
      background: rgba(255, 255, 255, 0.25);
    }
  }

  // ============ 消息列表 ============
  &__messages {
    flex: 1;
    overflow-y: auto;
    padding: $space-lg;
    display: flex;
    flex-direction: column;
    gap: $space-md;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba($color-brand-primary, 0.15);
      border-radius: $radius-full;

      [data-theme="dark"] & {
        background: rgba(255, 255, 255, 0.15);
      }
    }
  }

  // ============ 空状态 ============
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: $space-xl;
    text-align: center;
  }

  &__empty-icon {
    width: 64px;
    height: 64px;
    border-radius: $radius-full;
    background: $color-brand-primary-light;
    color: $color-brand-primary;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    margin-bottom: $space-lg;

    [data-theme="dark"] & {
      background: rgba(99, 102, 241, 0.15);
      color: #818CF8;
    }
  }

  &__empty-text {
    font-size: $text-sm;
    color: $color-gray-500;
    margin-bottom: $space-xl;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &__quick-actions {
    display: flex;
    flex-wrap: wrap;
    gap: $space-sm;
    justify-content: center;
  }

  &__quick-btn {
    padding: $space-sm $space-md;
    border-radius: $radius-full;
    border: 1.5px solid $color-gray-200;
    background: white;
    color: $color-gray-700;
    font-size: $text-xs;
    font-weight: 500;
    cursor: pointer;
    transition: all $transition-fast;

    [data-theme="dark"] & {
      background: #1E293B;
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
        background: rgba(99, 102, 241, 0.15);
      }
    }
  }

  // ============ 消息气泡 ============
  &__message {
    display: flex;
    gap: $space-sm;
    max-width: 90%;

    &--user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    &--assistant {
      align-self: flex-start;
    }
  }

  &__message-avatar {
    width: 28px;
    height: 28px;
    border-radius: $radius-full;
    background: $color-brand-primary-light;
    color: $color-brand-primary;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;

    [data-theme="dark"] & {
      background: rgba(99, 102, 241, 0.2);
      color: #818CF8;
    }
  }

  &__message-bubble {
    padding: $space-md $space-lg;
    border-radius: $radius-xl;
    line-height: 1.6;
    font-size: $text-sm;

    .ai-chat__message--user & {
      background: linear-gradient(135deg, $color-brand-primary 0%, #818CF8 100%);
      color: white;
      border-bottom-right-radius: $radius-sm;
    }

    .ai-chat__message--assistant & {
      background: $color-gray-100;
      color: $color-gray-900;
      border-bottom-left-radius: $radius-sm;

      [data-theme="dark"] & {
        background: #1E293B;
        color: #F8FAFC;
      }
    }
  }

  &__message-text {
    word-break: break-word;

    :deep(strong) {
      font-weight: 700;
    }

    :deep(em) {
      font-style: italic;
    }

    :deep(.ai-chat__md-h) {
      font-weight: 700;
      margin: $space-sm 0 $space-xs;
      font-size: $text-sm;
    }

    :deep(.ai-chat__md-li) {
      padding-left: $space-sm;
      position: relative;

      &::before {
        content: '·';
        position: absolute;
        left: 0;
        font-weight: 700;
      }
    }

    :deep(.ai-chat__code) {
      background: rgba(0, 0, 0, 0.06);
      border-radius: $radius-md;
      padding: $space-md;
      margin: $space-sm 0;
      overflow-x: auto;
      font-size: $text-xs;

      [data-theme="dark"] & {
        background: rgba(0, 0, 0, 0.3);
      }
    }

    :deep(.ai-chat__inline-code) {
      background: rgba($color-brand-primary, 0.1);
      padding: 1px 6px;
      border-radius: $radius-sm;
      font-size: $text-xs;
      font-family: 'SF Mono', 'Fira Code', monospace;

      [data-theme="dark"] & {
        background: rgba(99, 102, 241, 0.2);
      }
    }
  }

  // ============ 光标 ============
  &__cursor {
    display: inline-block;
    width: 2px;
    height: 14px;
    background: $color-brand-primary;
    margin-left: 2px;
    vertical-align: text-bottom;
    animation: blink-cursor 0.8s step-end infinite;

    [data-theme="dark"] & {
      background: #818CF8;
    }
  }

  // ============ 打字指示器 ============
  &__typing {
    display: flex;
    gap: 4px;
    padding: 4px 0;

    span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: $color-gray-400;
      animation: typing-bounce 1.4s ease-in-out infinite;

      [data-theme="dark"] & {
        background: #64748B;
      }

      &:nth-child(2) {
        animation-delay: 0.2s;
      }

      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }
  }

  // ============ 输入区域 ============
  &__input-area {
    padding: $space-md $space-lg $space-lg;
    border-top: 1px solid $color-gray-100;
    flex-shrink: 0;

    [data-theme="dark"] & {
      border-top-color: #334155;
    }
  }

  &__input-wrapper {
    display: flex;
    align-items: flex-end;
    gap: $space-sm;
    background: $color-gray-100;
    border-radius: $radius-xl;
    padding: $space-sm $space-sm $space-sm $space-lg;

    [data-theme="dark"] & {
      background: #1E293B;
    }
  }

  &__input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: $text-sm;
    color: $color-gray-900;
    resize: none;
    outline: none;
    max-height: 120px;
    line-height: 1.5;
    font-family: inherit;
    padding: $space-sm 0;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }

    &::placeholder {
      color: $color-gray-400;

      [data-theme="dark"] & {
        color: #64748B;
      }
    }

    &:disabled {
      opacity: 0.6;
    }
  }

  &__send {
    width: 36px;
    height: 36px;
    border-radius: $radius-full;
    border: none;
    background: $color-gray-200;
    color: $color-gray-500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    transition: all $transition-fast;
    flex-shrink: 0;

    [data-theme="dark"] & {
      background: #334155;
      color: #64748B;
    }

    &--active {
      background: linear-gradient(135deg, $color-brand-primary 0%, #818CF8 100%);
      color: white;
      box-shadow: 0 3px 10px rgba($color-brand-primary, 0.3);

      [data-theme="dark"] & {
        box-shadow: 0 3px 10px rgba(99, 102, 241, 0.4);
      }

      &:hover {
        transform: scale(1.05);
      }
    }

    &:disabled {
      cursor: not-allowed;
    }
  }

  &__disclaimer {
    font-size: 10px;
    color: $color-gray-400;
    text-align: center;
    margin: $space-sm 0 0;

    [data-theme="dark"] & {
      color: #475569;
    }
  }

  // ============ 面板内引导蒙层 ============
  &__guide-overlay {
    position: absolute;
    inset: 0;
    z-index: 50;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    flex-direction: column;
    border-radius: inherit;
    overflow: hidden;

    @media (max-width: $breakpoint-mobile) {
      border-radius: 0;
    }

    [data-theme="dark"] & {
      background: rgba(0, 0, 0, 0.7);
    }
  }

  &__guide-highlight {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;

    &--quick {
      // 空状态区（快捷按钮在消息列表中间位置）
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
    }

    &--input {
      // 输入区域在底部
      bottom: 0;
      left: 0;
      right: 0;
      height: 120px;
    }
  }

  &__guide-card {
    background: white;
    border-radius: 16px;
    padding: 16px 18px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 320px;
    animation: guide-card-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);

    [data-theme="dark"] & {
      background: #1E293B;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
    }
  }

  &__guide-card-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba($color-brand-primary, 0.1);
    color: $color-brand-primary;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;

    [data-theme="dark"] & {
      background: rgba(99, 102, 241, 0.15);
      color: #818CF8;
    }
  }

  &__guide-card-content {
    flex: 1;
    min-width: 0;
  }

  &__guide-card-title {
    font-size: 14px;
    font-weight: 700;
    color: $color-gray-900;
    margin: 0 0 2px;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__guide-card-desc {
    font-size: 12px;
    color: $color-gray-500;
    margin: 0;
    line-height: 1.4;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &__guide-card-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 14px;
    border: none;
    border-radius: 10px;
    background: $color-brand-primary;
    color: white;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: all $transition-fast;

    [data-theme="dark"] & {
      background: #4F46E5;
    }

    &:hover {
      transform: scale(1.03);
    }

    &--finish {
      background: linear-gradient(135deg, #10B981 0%, #34D399 100%);

      [data-theme="dark"] & {
        background: linear-gradient(135deg, #059669 0%, #10B981 100%);
      }
    }
  }
}

// ============ Tooltip 过渡 ============
.ai-chat-tooltip-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.ai-chat-tooltip-leave-active {
  transition: all 0.25s ease-in;
}

.ai-chat-tooltip-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
}

.ai-chat-tooltip-leave-to {
  opacity: 0;
  transform: translateY(4px) scale(0.98);
}

// ============ 面板过渡动画 ============
.ai-chat-panel-enter-active {
  transition: all $transition-entrance;
}

.ai-chat-panel-leave-active {
  transition: all $transition-normal;
}

.ai-chat-panel-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.ai-chat-panel-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

// ============ 蒙层过渡 ============
.ai-chat-overlay-enter-active {
  transition: opacity 0.3s ease;
}

.ai-chat-overlay-leave-active {
  transition: opacity 0.2s ease;
}

.ai-chat-overlay-enter-from,
.ai-chat-overlay-leave-to {
  opacity: 0;
}

// ============ 关键帧动画 ============
@keyframes fab-dot-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.8);
    opacity: 0;
  }
}

@keyframes guide-card-in {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

@keyframes typing-bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}

@keyframes blink-cursor {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>
