<template>
  <div class="register">
    <div class="register__bg-decoration">
      <div class="register__bg-circle register__bg-circle--1"></div>
      <div class="register__bg-circle register__bg-circle--2"></div>
      <svg class="register__bg-pattern" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="regGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#6366F1;stop-opacity:0.15" />
            <stop offset="100%" style="stop-color:#10B981;stop-opacity:0.1" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="150" fill="url(#regGrad1)" />
        <circle cx="50" cy="50" r="100" fill="none" stroke="#6366F1" stroke-opacity="0.1" stroke-width="2" />
      </svg>
    </div>

    <div class="register__inner">
      <div class="register__brand animate-fade-in-down">
        <span class="register__brand-icon">S</span>
        <span class="register__brand-name">SoloPilot</span>
      </div>

      <div class="register__card animate-fade-in-up">
        <div class="register__card-header">
          <h1 class="register__title">创建你的账号</h1>
          <p class="register__desc">
            开始规划你的一人公司之旅，3分钟完成注册。
          </p>
        </div>

        <form class="register__form" @submit.prevent="handleRegister">
          <div class="register__field">
            <label class="register__label" for="username">用户名</label>
            <input
              id="username"
              v-model="username"
              type="text"
              class="register__input"
              placeholder="4-20位字母、数字、下划线"
              autocomplete="username"
              required
            />
            <span class="register__hint">仅支持字母、数字、下划线</span>
          </div>

          <div class="register__field">
            <label class="register__label" for="nickname">昵称</label>
            <input
              id="nickname"
              v-model="nickname"
              type="text"
              class="register__input"
              placeholder="2-20个字符（选填）"
              autocomplete="nickname"
            />
          </div>

          <div class="register__field">
            <label class="register__label" for="password">密码</label>
            <div class="register__password-wrapper">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="register__input register__input--password"
                placeholder="6-20位，必须包含字母和数字"
                autocomplete="new-password"
                required
              />
              <button
                type="button"
                class="register__toggle-password"
                @click="showPassword = !showPassword"
              >
                <Icon :icon="showPassword ? 'mdi:eye-off' : 'mdi:eye'" />
              </button>
            </div>
            <span class="register__hint">必须包含字母和数字</span>
          </div>

          <div class="register__field">
            <label class="register__label" for="confirmPassword">确认密码</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              class="register__input"
              placeholder="再次输入密码"
              autocomplete="new-password"
              required
            />
          </div>

          <p v-if="error" class="register__error">{{ error }}</p>

          <button type="submit" class="register__submit" :disabled="isLoading">
            {{ isLoading ? '注册中...' : '立即注册' }}
            <svg v-if="!isLoading" class="register__submit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>

          <div class="register__switch">
            已有账号？
            <button type="button" class="register__switch-btn" @click="handleLogin">立即登录</button>
          </div>
        </form>

        <button class="register__hint-box" @click="handleDemoMode">
          <Icon icon="mdi:information-outline" />
          <span>演示模式：点击这里直接体验</span>
        </button>
      </div>
    </div>

    <div class="register__illustration animate-fade-in-left">
      <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" class="register__illustration-svg">
        <!-- Background shapes -->
        <circle cx="200" cy="250" r="150" fill="#EEF2FF" />
        <circle cx="200" cy="250" r="120" fill="#E0E7FF" />

        <!-- Person with rocket/rocket -->
        <circle cx="200" cy="180" r="40" fill="#C7D2FE" />
        <circle cx="200" cy="165" r="20" fill="#FCD34D" />
        <path d="M175 185 Q200 205 225 185" stroke="#6366F1" stroke-width="4" stroke-linecap="round" fill="none" />

        <!-- Rocket -->
        <g transform="translate(230, 220)">
          <path d="M30 0 Q45 20 40 50 L30 70 L20 50 Q15 20 30 0" fill="#6366F1" />
          <path d="M30 50 L30 70 L25 75 M30 70 L35 75" stroke="#FCD34D" stroke-width="2" />
          <circle cx="30" cy="25" r="8" fill="white" />
          <circle cx="30" cy="25" r="4" fill="#6366F1" />
        </g>

        <!-- Sparkles around rocket -->
        <g class="register__sparkle register__sparkle--1">
          <circle cx="280" cy="180" r="4" fill="#FCD34D" />
        </g>
        <g class="register__sparkle register__sparkle--2">
          <circle cx="300" cy="220" r="3" fill="#10B981" />
        </g>
        <g class="register__sparkle register__sparkle--3">
          <circle cx="290" cy="260" r="4" fill="#6366F1" />
        </g>

        <!-- Floating elements -->
        <g class="register__float register__float--1">
          <rect x="60" y="280" width="70" height="45" rx="8" fill="white" />
          <text x="95" y="300" font-size="8" fill="#10B981" text-anchor="middle" font-weight="600">一人公司</text>
          <text x="95" y="315" font-size="6" fill="#6366F1" text-anchor="middle">规划助手</text>
        </g>

        <g class="register__float register__float--2">
          <rect x="270" y="320" width="60" height="40" rx="8" fill="white" />
          <text x="300" y="345" font-size="10" fill="#6366F1" text-anchor="middle" font-weight="700">AI</text>
        </g>

        <!-- Connection dots -->
        <circle cx="130" cy="220" r="4" fill="#10B981" opacity="0.3" />
        <circle cx="270" cy="300" r="4" fill="#6366F1" opacity="0.3" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const nickname = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

const validateUsername = (username: string): boolean => {
  return /^[a-zA-Z0-9_]{4,20}$/.test(username)
}

const validatePassword = (password: string): boolean => {
  return password.length >= 6 && password.length <= 20 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password)
}

const handleRegister = async () => {
  error.value = ''

  if (!validateUsername(username.value)) {
    error.value = '用户名需4-20位字母、数字、下划线'
    return
  }

  if (!validatePassword(password.value)) {
    error.value = '密码需6-20位且包含字母和数字'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致'
    return
  }

  isLoading.value = true

  try {
    const res = await authService.register(username.value, password.value, nickname.value || undefined)
    if (res.code === 0 && res.data) {
      authStore.login(res.data.token, res.data.user)
      router.push('/intro')
    } else {
      error.value = res.message || '注册失败，请检查输入信息'
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || '网络异常，请检查网络连接'
  } finally {
    isLoading.value = false
  }
}

const handleLogin = () => {
  router.push('/login')
}

const handleDemoMode = () => {
  authStore.activateDemo('8888')
  router.push('/intro')
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/responsive';

.register {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-xl $space-lg;
  background: linear-gradient(135deg, $color-gray-50 0%, white 40%, $color-brand-accent-light 100%);
  position: relative;
  overflow: hidden;

  @include mobile {
    padding: $space-md $space-md;
    align-items: flex-start;
    padding-top: $space-3xl;
  }

  [data-theme="dark"] & {
    background: linear-gradient(135deg, #0F172A 0%, #1E293B 40%, #064E3B 100%);
  }

  &__bg-decoration {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  &__bg-circle {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.6;

    [data-theme="dark"] & {
      opacity: 0.3;
    }

    &--1 {
      width: 500px;
      height: 500px;
      background: linear-gradient(135deg, $color-brand-accent 0%, $color-brand-accent-light 100%);
      top: -200px;
      left: -150px;
    }

    &--2 {
      width: 400px;
      height: 400px;
      background: linear-gradient(135deg, $color-brand-primary 0%, $color-brand-primary-light 100%);
      bottom: -150px;
      right: -100px;
    }
  }

  &__inner {
    width: 100%;
    max-width: 460px;
    position: relative;
    z-index: 1;
  }

  &__illustration {
    display: none;
    position: fixed;
    left: 5%;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;

    @media (min-width: 1024px) {
      display: block;
    }
  }

  &__illustration-svg {
    width: 400px;
    max-width: 40vw;
    height: auto;
  }

  &__float {
    animation: float 3s ease-in-out infinite;

    &--1 { animation-delay: 0s; }
    &--2 { animation-delay: 1s; }
  }

  &__sparkle {
    animation: sparkle 2s ease-in-out infinite;

    &--1 { animation-delay: 0s; }
    &--2 { animation-delay: 0.5s; }
    &--3 { animation-delay: 1s; }
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: $space-md;
    margin-bottom: $space-2xl;
  }

  &__brand-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, $color-brand-primary 0%, $color-brand-accent 100%);
    color: white;
    font-size: $text-xl;
    font-weight: 800;
    border-radius: $radius-xl;
    box-shadow: 0 8px 24px rgba($color-brand-primary, 0.35);
  }

  &__brand-name {
    font-size: $text-2xl;
    font-weight: 800;
    color: $color-gray-900;
    letter-spacing: -0.5px;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__card {
    background: white;
    padding: $space-2xl;
    border-radius: $radius-2xl;
    box-shadow: $shadow-xl;
    border: 1px solid rgba($color-brand-primary, 0.08);

    [data-theme="dark"] & {
      background: #1E293B;
      border-color: rgba(255, 255, 255, 0.1);
    }

    @include mobile {
      padding: $space-xl $space-lg;
      border-radius: $radius-xl;
    }
  }

  &__card-header {
    margin-bottom: $space-xl;
  }

  &__title {
    font-size: $text-xl;
    font-weight: 700;
    color: $color-gray-900;
    margin-bottom: $space-sm;
    letter-spacing: -0.3px;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__desc {
    font-size: $text-sm;
    color: $color-gray-500;
    line-height: 1.6;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: $space-lg;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: $space-xs;
  }

  &__label {
    font-size: $text-sm;
    font-weight: 600;
    color: $color-gray-700;

    [data-theme="dark"] & {
      color: #E2E8F0;
    }
  }

  &__input {
    width: 100%;
    height: 52px;
    padding: 0 $space-lg;
    font-size: $text-base;
    font-family: inherit;
    border: 1.5px solid $color-gray-200;
    border-radius: $radius-lg;
    background: $color-gray-50;
    color: $color-gray-900;
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
      background: white;

      [data-theme="dark"] & {
        background: #1E293B;
        border-color: $color-brand-primary;
      }
    }

    &::placeholder {
      color: $color-gray-400;

      [data-theme="dark"] & {
        color: #64748B;
      }
    }
  }

  &__hint {
    font-size: $text-xs;
    color: $color-gray-400;

    [data-theme="dark"] & {
      color: #64748B;
    }
  }

  &__password-wrapper {
    position: relative;
  }

  &__toggle-password {
    position: absolute;
    right: $space-lg;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: $color-gray-400;
    padding: $space-sm;
    transition: color $transition-fast;

    &:hover {
      color: $color-brand-primary;
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }

  &__input--password {
    padding-right: 52px;
  }

  &__error {
    font-size: $text-sm;
    color: $color-error;
    margin: 0;
    padding: $space-md;
    background: $color-error-light;
    border-radius: $radius-lg;
    font-weight: 500;
  }

  &__submit {
    width: 100%;
    height: 52px;
    font-size: $text-base;
    font-weight: 600;
    font-family: inherit;
    color: white;
    background: linear-gradient(135deg, $color-brand-accent 0%, #059669 100%);
    border: none;
    border-radius: $radius-xl;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-sm;
    box-shadow: 0 4px 14px rgba($color-brand-accent, 0.4);
    transition: all $transition-fast;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    &:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba($color-brand-accent, 0.5);
    }

    &:not(:disabled):active {
      transform: translateY(0);
    }
  }

  &__submit-icon {
    width: 18px;
    height: 18px;
  }

  &__switch {
    text-align: center;
    margin-top: $space-lg;
    font-size: $text-sm;
    color: $color-gray-500;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &__switch-btn {
    background: none;
    border: none;
    color: $color-brand-accent;
    font-weight: 600;
    cursor: pointer;
    margin-left: $space-sm;
    transition: color $transition-fast;

    &:hover {
      color: $color-brand-accent-hover;
      text-decoration: underline;
    }
  }

  &__hint-box {
    display: flex;
    align-items: flex-start;
    gap: $space-sm;
    margin-top: $space-xl;
    padding: $space-lg;
    background: $color-brand-accent-light;
    border-radius: $radius-xl;
    font-size: $text-xs;
    color: $color-gray-700;
    line-height: 1.6;
    cursor: pointer;
    border: none;
    width: 100%;
    text-align: left;
    transition: all $transition-fast;

    [data-theme="dark"] & {
      background: rgba(16, 185, 129, 0.15);
      color: #A7F3D0;
    }

    &:hover {
      background: rgba($color-brand-accent, 0.25);
      transform: translateY(-1px);

      [data-theme="dark"] & {
        background: rgba(16, 185, 129, 0.3);
      }
    }

    svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      margin-top: 1px;
      color: $color-brand-accent;

      [data-theme="dark"] & {
        color: #34D399;
      }
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}
</style>
