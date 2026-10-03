<template>
  <div class="sp-input" :class="{ 'sp-input--error': error }">
    <label v-if="label" :for="inputId" class="sp-input__label">{{ label }}</label>
    <div class="sp-input__wrapper">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxlength"
        class="sp-input__field"
        @input="handleInput"
        @blur="handleBlur"
      />
      <span v-if="suffix" class="sp-input__suffix">{{ suffix }}</span>
    </div>
    <span v-if="error" class="sp-input__error">{{ error }}</span>
    <span v-else-if="hint" class="sp-input__hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

interface Props {
  modelValue: string
  type?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  error?: string
  hint?: string
  suffix?: string
  maxlength?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

const inputId = `input-${useId()}`

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = () => {
  emit('blur')
}
</script>

<style lang="scss" scoped>
.sp-input {
  &__label {
    display: block;
    font-size: $text-sm;
    color: $color-gray-700;
    margin-bottom: $space-sm;
    font-weight: 500;

    [data-theme="dark"] & {
      color: #E2E8F0;
    }
  }

  &__wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__field {
    width: 100%;
    height: 48px;
    padding: 0 $space-lg;
    font-size: $text-base;
    font-family: inherit;
    color: $color-gray-900;
    background: white;
    border: 1.5px solid $color-gray-200;
    border-radius: $radius-lg;
    transition: all $transition-fast;

    [data-theme="dark"] & {
      background: #0F172A;
      border-color: #334155;
      color: #F8FAFC;
    }

    &::placeholder {
      color: $color-gray-400;

      [data-theme="dark"] & {
        color: #64748B;
      }
    }

    &:hover {
      border-color: $color-gray-300;

      [data-theme="dark"] & {
        border-color: #475569;
      }
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

    &:disabled {
      background: $color-gray-100;
      cursor: not-allowed;

      [data-theme="dark"] & {
        background: #0F172A;
        border-color: #1E293B;
      }
    }
  }

  &__suffix {
    position: absolute;
    right: $space-lg;
    color: $color-gray-500;
    font-size: $text-sm;
    font-weight: 500;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &__error {
    display: block;
    font-size: $text-xs;
    color: $color-error;
    margin-top: $space-xs;
    font-weight: 500;
  }

  &__hint {
    display: block;
    font-size: $text-xs;
    color: $color-gray-500;
    margin-top: $space-xs;

    [data-theme="dark"] & {
      color: #64748B;
    }
  }

  &--error {
    .sp-input__field {
      border-color: $color-error;

      &:focus {
        box-shadow: 0 0 0 4px rgba($color-error, 0.1);
      }
    }
  }
}
</style>
