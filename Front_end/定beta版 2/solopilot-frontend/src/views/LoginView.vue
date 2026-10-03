<template>
  <div class="login">
    <div class="login__bg-decoration">
      <div class="login__bg-circle login__bg-circle--1"></div>
      <div class="login__bg-circle login__bg-circle--2"></div>
      <svg class="login__bg-pattern" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="loginGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#6366F1;stop-opacity:0.15" />
            <stop offset="100%" style="stop-color:#10B981;stop-opacity:0.1" />
          </linearGradient>
        </defs>
        <circle cx="350" cy="350" r="200" fill="url(#loginGrad1)" />
        <circle cx="350" cy="350" r="150" fill="none" stroke="#6366F1" stroke-opacity="0.1" stroke-width="2" />
        <circle cx="350" cy="350" r="100" fill="none" stroke="#10B981" stroke-opacity="0.1" stroke-width="2" />
      </svg>
    </div>

    <div class="login__inner">
      <div class="login__brand animate-fade-in-down">
        <span class="login__brand-icon">S</span>
        <span class="login__brand-name">SoloPilot</span>
      </div>

      <div class="login__card animate-fade-in-up">
        <div class="login__card-header">
          <h1 class="login__title">登录，继续你的创业计划</h1>
          <p class="login__desc">
            使用用户名和密码登录，开始你的一人公司规划之旅。
          </p>
        </div>

        <form class="login__form" @submit.prevent="handleLogin">
          <div class="login__field">
            <label class="login__label" for="username">用户名</label>
            <input
              id="username"
              v-model="username"
              type="text"
              class="login__input"
              placeholder="输入你的用户名"
              autocomplete="username"
              required
            />
          </div>

          <div class="login__field">
            <label class="login__label" for="password">密码</label>
            <div class="login__password-wrapper">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="login__input login__input--password"
                placeholder="输入你的密码"
                autocomplete="current-password"
                required
              />
              <button
                type="button"
                class="login__toggle-password"
                @click="showPassword = !showPassword"
              >
                <Icon :icon="showPassword ? 'mdi:eye-off' : 'mdi:eye'" />
              </button>
            </div>
          </div>

          <p v-if="error" class="login__error">{{ error }}</p>

          <button type="submit" class="login__submit" :disabled="isLoading">
            {{ isLoading ? '登录中...' : '登录' }}
            <svg v-if="!isLoading" class="login__submit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>

          <div class="login__switch">
            还没有账号？
            <button type="button" class="login__switch-btn" @click="handleRegister">立即注册</button>
          </div>
        </form>

        <button class="login__hint" @click="handleDemoMode">
          <Icon icon="mdi:information-outline" />
          <span>演示模式：点击这里直接体验</span>
        </button>
      </div>
    </div>

    <div class="login__illustration animate-fade-in-right">
      <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" class="login__illustration-svg">
        <!-- Background shapes -->
        <circle cx="200" cy="250" r="150" class="svg-fill-1" />
        <circle cx="200" cy="250" r="120" class="svg-fill-2" />

        <!-- Person with phone -->
        <circle cx="200" cy="180" r="40" class="svg-fill-3" />
        <circle cx="200" cy="165" r="20" class="svg-fill-4" />
        <path d="M175 185 Q200 205 225 185" stroke="#6366F1" stroke-width="4" stroke-linecap="round" fill="none" />

        <!-- Phone in hand -->
        <rect x="165" y="230" width="70" height="120" rx="10" fill="#1E1B4B" />
        <rect x="170" y="235" width="60" height="100" rx="6" fill="#6366F1" />
        <circle cx="200" cy="300" r="20" class="svg-fill-white" />
        <path d="M192 300 L198 306 L210 294" stroke="#6366F1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" />

        <!-- Floating elements -->
        <g class="login__float login__float--1">
          <rect x="80" y="150" width="60" height="40" rx="8" class="svg-fill-white" />
          <circle cx="95" cy="165" r="8" fill="#10B981" />
          <rect x="110" y="162" width="20" height="6" rx="3" class="svg-fill-2" />
        </g>

        <g class="login__float login__float--2">
          <rect x="280" y="120" width="50" height="35" rx="8" class="svg-fill-white" />
          <text x="305" y="140" font-size="10" fill="#6366F1" text-anchor="middle" font-weight="700">AI</text>
        </g>

        <g class="login__float login__float--3">
          <rect x="290" y="300" width="55" height="40" rx="8" class="svg-fill-white" />
          <text x="317" y="322" font-size="8" fill="#10B981" text-anchor="middle" font-weight="600">策略</text>
        </g>

        <!-- Connection dots -->
        <circle cx="140" cy="180" r="4" fill="#6366F1" opacity="0.3" />
        <circle cx="260" cy="140" r="4" fill="#10B981" opacity="0.3" />
        <circle cx="300" cy="280" r="4" fill="#6366F1" opacity="0.3" />

        <!-- Decorative lines -->
        <path d="M140 180 Q170 190 175 220" stroke="#C7D2FE" stroke-width="2" stroke-dasharray="4 4" fill="none" />
        <path d="M260 140 Q250 170 230 185" stroke="#D1FAE5" stroke-width="2" stroke-dasharray="4 4" fill="none" />
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
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = '用户名和密码都不能为空'
    return
  }

  error.value = ''
  isLoading.value = true

  try {
    const res = await authService.login(username.value, password.value)
    if (res.code === 0 && res.data) {
      authStore.login(res.data.token, res.data.user)
      router.push('/')
    } else {
      error.value = res.message || '登录失败，请检查用户名和密码'
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || '网络异常，请检查网络连接'
  } finally {
    isLoading.value = false
  }
}

const handleDemoMode = () => {
  authStore.activateDemo('8888')
  router.push('/intro')
}

const handleRegister = () => {
  router.push('/register')
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/responsive';

.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-xl $space-lg;
  background: linear-gradient(135deg, $color-gray-50 0%, white 40%, $color-brand-primary-light 100%);
  position: relative;
  overflow: hidden;

  @include mobile {
    padding: $space-md $space-md;
    align-items: flex-start;
    padding-top: $space-3xl;
  }

  --svg-fill-1: #EEF2FF;
  --svg-fill-2: #E0E7FF;
  --svg-fill-3: #C7D2FE;
  --svg-fill-4: #FCD34D;
  --svg-fill-white: white;
  --svg-stroke-1: #C7D2FE;

  [data-theme="dark"] & {
    background: linear-gradient(135deg, #0F172A 0%, #1E293B 40%, #312E81 100%);
    --svg-fill-1: #312E81;
    --svg-fill-2: #1E293B;
    --svg-fill-3: #3730A3;
    --svg-fill-4: #FBBF24;
    --svg-fill-white: #1E293B;
    --svg-stroke-1: #3730A3;
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

    &--1 {
      width: 500px;
      height: 500px;
      background: linear-gradient(135deg, $color-brand-primary 0%, $color-brand-primary-light 100%);
      top: -200px;
      right: -150px;
    }

    &--2 {
      width: 400px;
      height: 400px;
      background: linear-gradient(135deg, $color-brand-accent 0%, $color-brand-accent-light 100%);
      bottom: -150px;
      left: -100px;
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
    right: 5%;
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
    &--3 { animation-delay: 2s; }
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
    gap: $space-sm;
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

    &--code {
      flex: 1;
    }
  }

  &__code-row {
    display: flex;
    gap: $space-md;
    align-items: center;
  }

  &__send-btn {
    height: 52px;
    padding: 0 $space-lg;
    font-size: $text-sm;
    font-weight: 600;
    color: $color-brand-primary;
    background: $color-brand-primary-light;
    border: none;
    border-radius: $radius-lg;
    cursor: pointer;
    white-space: nowrap;
    transition: all $transition-fast;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: $color-gray-100;
      color: $color-gray-400;
    }

    &:not(:disabled):hover {
      background: $color-brand-primary;
      color: white;
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
    background: linear-gradient(135deg, $color-brand-primary 0%, $color-brand-primary-hover 100%);
    border: none;
    border-radius: $radius-xl;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-sm;
    box-shadow: 0 4px 14px rgba($color-brand-primary, 0.4);
    transition: all $transition-fast;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    &:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba($color-brand-primary, 0.5);
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
  }

  &__switch-btn {
    background: none;
    border: none;
    color: $color-brand-primary;
    font-weight: 600;
    cursor: pointer;
    margin-left: $space-sm;
    transition: color $transition-fast;

    &:hover {
      color: $color-brand-primary-hover;
      text-decoration: underline;
    }
  }

  &__hint {
    display: flex;
    align-items: flex-start;
    gap: $space-sm;
    margin-top: $space-xl;
    padding: $space-lg;
    background: $color-brand-primary-light;
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
      background: rgba(99, 102, 241, 0.2);
      color: #C7D2FE;
    }

    &:hover {
      background: rgba($color-brand-primary, 0.25);
      transform: translateY(-1px);

      [data-theme="dark"] & {
        background: rgba(99, 102, 241, 0.35);
      }
    }

    svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      margin-top: 1px;
      color: $color-brand-primary;

      [data-theme="dark"] & {
        color: #818CF8;
      }
    }
  }
}

:deep(.svg-fill-1) { fill: var(--svg-fill-1); }
:deep(.svg-fill-2) { fill: var(--svg-fill-2); }
:deep(.svg-fill-3) { fill: var(--svg-fill-3); }
:deep(.svg-fill-4) { fill: var(--svg-fill-4); }
:deep(.svg-fill-white) { fill: var(--svg-fill-white); }
:deep(.svg-stroke-1) { stroke: var(--svg-stroke-1); }

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba($color-brand-accent, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba($color-brand-accent, 0);
  }
}
</style>
