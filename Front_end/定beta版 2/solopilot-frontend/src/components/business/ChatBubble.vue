<template>
  <div
    :class="['chat-bubble', role === 'ai' ? 'chat-bubble--ai' : 'chat-bubble--user']"
    :aria-label="role === 'ai' ? '系统消息' : '你的回答'"
  >
    <div class="chat-bubble__content">
      <p v-for="(line, index) in contentLines" :key="index">{{ line }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  role: 'ai' | 'user'
  content: string
}

const props = defineProps<Props>()

const contentLines = computed(() => {
  return props.content.split('\n').filter(line => line.trim())
})
</script>

<style lang="scss" scoped>
.chat-bubble {
  max-width: 85%;
  padding: $space-lg;
  border-radius: $radius-xl;
  animation: bubbleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

  &--ai {
    background: linear-gradient(135deg, $color-gray-100 0%, white 100%);
    border: 1px solid rgba($color-brand-primary, 0.1);
    border-top-left-radius: $radius-sm;
    align-self: flex-start;
    box-shadow: $shadow-sm;

    [data-theme="dark"] & {
      background: linear-gradient(135deg, #1E293B 0%, #334155 100%);
      border-color: rgba(99, 102, 241, 0.2);
    }
  }

  &--user {
    background: linear-gradient(135deg, $color-brand-primary 0%, #818CF8 100%);
    color: white;
    border-top-right-radius: $radius-sm;
    align-self: flex-end;
    box-shadow: 0 4px 14px rgba($color-brand-primary, 0.3);
  }

  &__content {
    p {
      font-size: $text-base;
      line-height: 1.7;
      margin: 0;

      & + p {
        margin-top: $space-sm;
      }

      [data-theme="dark"] & {
        color: #E2E8F0;
      }
    }
  }
}

@keyframes bubbleIn {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
