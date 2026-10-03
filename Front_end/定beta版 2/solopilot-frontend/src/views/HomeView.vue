<template>
  <div class="home">
    <section class="hero">
      <div class="hero__bg-decoration">
        <!-- Stars background -->
        <div class="hero__stars">
          <div class="hero__star hero__star--1"></div>
          <div class="hero__star hero__star--2"></div>
          <div class="hero__star hero__star--3"></div>
          <div class="hero__star hero__star--4"></div>
          <div class="hero__star hero__star--5"></div>
          <div class="hero__star hero__star--6"></div>
          <div class="hero__star hero__star--7"></div>
          <div class="hero__star hero__star--8"></div>
          <div class="hero__star hero__star--9"></div>
          <div class="hero__star hero__star--10"></div>
        </div>

        <!-- Meteor shower -->
        <div class="hero__meteor-shower">
          <div class="hero__meteor hero__meteor--1"></div>
          <div class="hero__meteor hero__meteor--2"></div>
          <div class="hero__meteor hero__meteor--3"></div>
          <div class="hero__meteor hero__meteor--4"></div>
          <div class="hero__meteor hero__meteor--5"></div>
          <div class="hero__meteor hero__meteor--6"></div>
          <div class="hero__meteor hero__meteor--7"></div>
          <div class="hero__meteor hero__meteor--8"></div>
        </div>

        <div class="hero__bg-circle hero__bg-circle--1"></div>
        <div class="hero__bg-circle hero__bg-circle--2"></div>
        <div class="hero__bg-circle hero__bg-circle--3"></div>
        <svg class="hero__bg-pattern" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#6366F1;stop-opacity:0.1" />
              <stop offset="100%" style="stop-color:#10B981;stop-opacity:0.1" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="80" fill="url(#grad1)" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="#6366F1" stroke-opacity="0.1" stroke-width="1" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="#10B981" stroke-opacity="0.1" stroke-width="1" />
        </svg>
      </div>

      <div class="hero__inner">
        <div class="hero__text">
          <div class="hero__badge animate-fade-in-down">
            <span class="hero__badge-dot"></span>
            AI 驱动的一人公司创业规划助手
          </div>

          <h1 class="hero__title animate-fade-in-up">
            你不需要一个团队<br>
            <span class="gradient-text">你只需要一个对的开始</span>
          </h1>

          <p class="hero__lead animate-fade-in-up stagger-1">
            很多人想过自己干，但不知道从哪开始。<br>
            SoloPilot 帮你理清思路，找到方向，搭配好AI工具，<br>
            让你一个人也能干得像有一个团队。
          </p>

          <div class="hero__actions animate-fade-in-up stagger-2">
            <button class="btn btn--primary btn--lg" @click="startTest">
              <span>开始测评，找到你的方向</span>
              <svg class="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button class="btn btn--ghost btn--lg" @click="goToIntro">
              先了解一下一人公司是什么
            </button>
          </div>
        </div>

        <div class="hero__visual animate-fade-in-right stagger-3">
          <div class="hero__illustration">
            <svg viewBox="0 0 300 280" fill="none" xmlns="http://www.w3.org/2000/svg" class="hero__illustration-svg">
              <!-- Background shapes -->
              <circle cx="150" cy="140" r="100" class="svg-fill-1" />
              <circle cx="150" cy="140" r="70" class="svg-fill-2" />

              <!-- Person with laptop -->
              <rect x="115" y="160" width="70" height="50" rx="8" fill="#6366F1" />
              <rect x="120" y="165" width="60" height="35" rx="4" fill="#1E1B4B" />
              <circle cx="150" cy="140" r="25" class="svg-fill-3" />
              <circle cx="150" cy="135" r="15" class="svg-fill-4" />
              <path d="M135 145 Q150 155 165 145" stroke="#6366F1" stroke-width="3" stroke-linecap="round" fill="none" />

              <!-- AI sparkles -->
              <g class="hero__sparkle hero__sparkle--1">
                <path d="M80 80 L85 95 L100 100 L85 105 L80 120 L75 105 L60 100 L75 95 Z" fill="#6366F1" />
              </g>
              <g class="hero__sparkle hero__sparkle--2">
                <path d="M220 90 L223 98 L231 100 L223 102 L220 110 L217 102 L209 100 L217 98 Z" fill="#10B981" />
              </g>
              <g class="hero__sparkle hero__sparkle--3">
                <path d="M240 160 L243 168 L251 170 L243 172 L240 180 L237 172 L229 170 L237 168 Z" fill="#6366F1" />
              </g>

              <!-- Floating elements -->
              <rect x="60" y="200" width="45" height="30" rx="6" class="svg-fill-white svg-stroke-1" stroke-width="2" />
              <text x="82" y="220" font-size="10" fill="#6366F1" text-anchor="middle" font-weight="600">AI</text>

              <rect x="195" y="195" width="50" height="35" rx="6" class="svg-fill-white" stroke="#10B981" stroke-width="2" />
              <text x="220" y="217" font-size="8" fill="#10B981" text-anchor="middle" font-weight="600">策略</text>

              <!-- Connection lines -->
              <path d="M105 200 Q130 180 140 160" class="svg-stroke-2" stroke-width="2" stroke-dasharray="4 4" fill="none" />
              <path d="M195 195 Q180 175 160 155" class="svg-stroke-3" stroke-width="2" stroke-dasharray="4 4" fill="none" />
            </svg>
          </div>

          <div class="hero__card hero__card--1 hover-lift">
            <div class="hero__card-icon">
              <Icon icon="mdi:brain" />
            </div>
            <div class="hero__card-content">
              <span class="hero__card-title">MBTI 性格分析</span>
              <span class="hero__card-desc">了解你的创业特质</span>
            </div>
          </div>

          <div class="hero__card hero__card--2 hero__card--highlight hover-lift">
            <div class="hero__card-icon">
              <Icon icon="mdi:chart-bell-curve-cumulative" />
            </div>
            <div class="hero__card-content">
              <span class="hero__card-title">7 大方向匹配</span>
              <span class="hero__card-desc">找到最适合你的赛道</span>
            </div>
          </div>

          <div class="hero__card hero__card--3 hover-lift">
            <div class="hero__card-icon">
              <Icon icon="mdi:robot-happy" />
            </div>
            <div class="hero__card-content">
              <span class="hero__card-title">AI 团队配置</span>
              <span class="hero__card-desc">一个人也能顶一个团队</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="stats">
      <div class="stats__inner animate-fade-in-up">
        <div class="stats__item">
          <span class="stats__number">10,000+</span>
          <span class="stats__label">用户已测评</span>
        </div>
        <div class="stats__divider"></div>
        <div class="stats__item">
          <span class="stats__number">7</span>
          <span class="stats__label">大创业方向</span>
        </div>
        <div class="stats__divider"></div>
        <div class="stats__item">
          <span class="stats__number">15分钟</span>
          <span class="stats__label">获得专属方案</span>
        </div>
      </div>
    </section>

    <section class="why">
      <div class="why__header animate-fade-in-up">
        <span class="section-label">为什么需要 SoloPilot？</span>
        <h2 class="why__title">一个人创业，最难的不是"做什么"</h2>
        <p class="why__subtitle">而是"我怎么知道适不适合我"</p>
      </div>

      <div class="why__grid">
        <div class="why__card why__card--large animate-fade-in-up stagger-1">
          <div class="why__card-icon">
            <Icon icon="mdi:puzzle-outline" />
          </div>
          <h3>不用猜了，直接算</h3>
          <p>通过 7 个简单问题 + MBTI 性格测试，系统会自动分析你的创业画像，推荐最匹配的方向。不是随机推荐，是真的在算。</p>
        </div>

        <div class="why__card animate-fade-in-up stagger-2">
          <div class="why__card-icon">
            <Icon icon="mdi:clock-fast" />
          </div>
          <h3>15 分钟搞定</h3>
          <p>从开始测评到拿到方案，最快 15 分钟。不用填一堆没用的表格，每个问题都是对话式的。</p>
        </div>

        <div class="why__card animate-fade-in-up stagger-3">
          <div class="why__card-icon">
            <Icon icon="mdi:tools" />
          </div>
          <h3>拿到就能用</h3>
          <p>不仅有方向，还有具体的行动清单、工具推荐和案例参考。不是空话，是真能动手做的东西。</p>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="cta__inner animate-fade-in-up">
        <h2 class="cta__title">你已经看完了，接下来该你了</h2>
        <p class="cta__subtitle">花 15 分钟，拿到你的专属创业方案</p>
        <button class="btn btn--primary btn--lg" @click="startTest">
          开始测评
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const startTest = () => {
  router.push('/info-collect-intro')
}

const goToIntro = () => {
  router.push('/intro')
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/responsive';

.home {
  min-height: 100vh;
  background: linear-gradient(180deg, $color-gray-50 0%, white 50%, $color-brand-primary-light 100%);
  overflow-x: hidden;

  --svg-fill-1: #EEF2FF;
  --svg-fill-2: #E0E7FF;
  --svg-fill-3: #C7D2FE;
  --svg-fill-4: #FCD34D;
  --svg-fill-white: white;
  --svg-stroke-1: #E0E7FF;
  --svg-stroke-2: #C7D2FE;
  --svg-stroke-3: #D1FAE5;

  [data-theme="dark"] & {
    background: linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #312E81 100%);
    --svg-fill-1: #312E81;
    --svg-fill-2: #1E293B;
    --svg-fill-3: #3730A3;
    --svg-fill-4: #FBBF24;
    --svg-fill-white: #1E293B;
    --svg-stroke-1: #3730A3;
    --svg-stroke-2: #3730A3;
    --svg-stroke-3: #065F46;
  }
}

:deep(.svg-fill-1) { fill: var(--svg-fill-1); }
:deep(.svg-fill-2) { fill: var(--svg-fill-2); }
:deep(.svg-fill-3) { fill: var(--svg-fill-3); }
:deep(.svg-fill-4) { fill: var(--svg-fill-4); }
:deep(.svg-fill-white) { fill: var(--svg-fill-white); }
:deep(.svg-stroke-1) { stroke: var(--svg-stroke-1); }
:deep(.svg-stroke-2) { stroke: var(--svg-stroke-2); }
:deep(.svg-stroke-3) { stroke: var(--svg-stroke-3); }

.section-label {
  display: inline-flex;
  align-items: center;
  gap: $space-sm;
  font-size: $text-xs;
  font-weight: 600;
  color: $color-brand-primary;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: $space-lg;
  padding: $space-sm $space-md;
  background: $color-brand-primary-light;
  border-radius: $radius-full;

  [data-theme="dark"] & {
    background: rgba(99, 102, 241, 0.2);
    color: $color-brand-primary-hover;
  }
}

.gradient-text {
  background: linear-gradient(135deg, $color-brand-primary 0%, $color-brand-accent 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  [data-theme="dark"] & {
    background: linear-gradient(135deg, $color-brand-primary-hover 0%, $color-brand-accent 100%);
    -webkit-background-clip: text;
    background-clip: text;
  }
}

.hero {
  position: relative;
  width: 100%;
  padding: $space-2xl $space-xl;
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  overflow: hidden;

  @include mobile {
    padding: $space-lg $space-md;
    min-height: auto;
    padding-top: $space-2xl;
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
      top: -150px;
      right: -150px;
    }

    &--2 {
      width: 400px;
      height: 400px;
      background: linear-gradient(135deg, $color-brand-accent 0%, $color-brand-accent-light 100%);
      bottom: -100px;
      left: -100px;
    }

    &--3 {
      width: 200px;
      height: 200px;
      background: $color-brand-primary-light;
      top: 40%;
      left: 20%;
      opacity: 0.4;
    }

    [data-theme="dark"] & {
      opacity: 0.3;
      filter: blur(120px);

      &--1 {
        background: linear-gradient(135deg, #4F46E5 0%, #6366F1 100%);
      }

      &--2 {
        background: linear-gradient(135deg, #059669 0%, #10B981 100%);
      }

      &--3 {
        background: rgba(99, 102, 241, 0.3);
      }
    }
  }

  &__meteor-shower {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;

    @media (max-width: 768px) {
      display: none;
    }
  }

  &__stars {
    position: absolute;
    inset: 0;
    pointer-events: none;

    @media (prefers-reduced-motion: reduce) {
      display: none;
    }
  }

  &__star {
    position: absolute;
    width: 4px;
    height: 4px;
    background: $color-brand-primary;
    border-radius: 50%;
    opacity: 0.6;
    animation: twinkle 3s ease-in-out infinite;

    [data-theme="dark"] & {
      background: white;
    }

    &--1 { left: 8%; top: 15%; animation-delay: 0s; }
    &--2 { left: 22%; top: 8%; animation-delay: 0.5s; }
    &--3 { left: 35%; top: 20%; animation-delay: 1s; }
    &--4 { left: 50%; top: 5%; animation-delay: 1.5s; }
    &--5 { left: 65%; top: 12%; animation-delay: 0.3s; }
    &--6 { left: 78%; top: 18%; animation-delay: 0.8s; }
    &--7 { left: 92%; top: 8%; animation-delay: 1.2s; }
    &--8 { left: 15%; top: 35%; animation-delay: 0.6s; }
    &--9 { left: 45%; top: 28%; animation-delay: 1.8s; }
    &--10 { left: 85%; top: 30%; animation-delay: 2s; }

    @media (prefers-reduced-motion: reduce) {
      animation: none;
      opacity: 0.4;
    }
  }

  &__meteor {
    position: absolute;
    width: 3px;
    height: 100px;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(99, 102, 241, 0.3) 10%,
      rgba(99, 102, 241, 0.9) 30%,
      rgba(99, 102, 241, 0.6) 50%,
      transparent 100%
    );
    border-radius: 50%;
    opacity: 0;
    animation: meteor-fall linear infinite;
    box-shadow: 0 0 10px 2px rgba(99, 102, 241, 0.3);

    [data-theme="dark"] & {
      background: linear-gradient(
        to bottom,
        transparent 0%,
        rgba(255, 255, 255, 0.3) 10%,
        rgba(255, 255, 255, 0.9) 30%,
        rgba(255, 255, 255, 0.6) 50%,
        transparent 100%
      );
      box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.3);
    }

    &--1 {
      left: 10%;
      top: -120px;
      animation-duration: 2s;
      animation-delay: 0s;
    }

    &--2 {
      left: 25%;
      top: -120px;
      animation-duration: 2.5s;
      animation-delay: 0.7s;
    }

    &--3 {
      left: 42%;
      top: -120px;
      animation-duration: 1.8s;
      animation-delay: 1.2s;
    }

    &--4 {
      left: 58%;
      top: -120px;
      animation-duration: 2.2s;
      animation-delay: 0.4s;
    }

    &--5 {
      left: 72%;
      top: -120px;
      animation-duration: 2.1s;
      animation-delay: 1.8s;
    }

    &--6 {
      left: 88%;
      top: -120px;
      animation-duration: 1.9s;
      animation-delay: 0.9s;
    }

    &--7 {
      left: 5%;
      top: -120px;
      animation-duration: 2.3s;
      animation-delay: 2.5s;
    }

    &--8 {
      left: 35%;
      top: -120px;
      animation-duration: 2.4s;
      animation-delay: 3s;
    }

    @media (prefers-reduced-motion: reduce) {
      display: none;
    }
  }

  &__inner {
    position: relative;
    z-index: 1;
    display: grid;
    gap: $space-3xl;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    margin-top: -12vh;

    @include desktop {
      grid-template-columns: 1.1fr 1fr;
    }

    @include mobile {
      gap: $space-2xl;
      margin-top: 0;
      padding: 0 $space-sm;
    }
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: $space-sm;
    padding: $space-sm $space-lg;
    background: white;
    border: 1px solid rgba($color-brand-primary, 0.1);
    border-radius: $radius-full;
    font-size: 32px;
    font-weight: 600;
    color: $color-gray-700;
    margin-bottom: $space-xl;
    box-shadow: $shadow-md;

    @include mobile {
      font-size: $text-sm;
      padding: $space-xs $space-md;
      margin-bottom: $space-lg;
    }

    [data-theme="dark"] & {
      background: #1E293B;
      border-color: rgba(99, 102, 241, 0.3);
      color: #E2E8F0;
    }
  }

  &__badge-dot {
    width: 8px;
    height: 8px;
    background: $color-brand-accent;
    border-radius: 50%;
    animation: pulse-glow 2s ease-in-out infinite;

    [data-theme="dark"] & {
      background: #34D399;
    }
  }

  &__title {
    font-size: clamp(36px, 6vw, 56px);
    font-weight: 800;
    color: $color-gray-900;
    line-height: 1.1;
    margin-bottom: $space-xl;
    letter-spacing: -1.5px;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__lead {
    font-size: $text-md;
    color: $color-gray-600;
    line-height: 1.8;
    margin-bottom: $space-2xl;
    max-width: 520px;

    @include mobile {
      font-size: $text-sm;
      line-height: 1.7;
      margin-bottom: $space-xl;
    }

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &__actions {
    display: flex;
    gap: $space-md;
    align-items: center;
    flex-wrap: wrap;

    @include mobile {
      flex-direction: column;
      width: 100%;

      .btn {
        width: 100%;
        justify-content: center;
      }
    }
  }

  &__visual {
    display: flex;
    flex-direction: column;
    gap: $space-lg;
    padding: $space-xl 0;
  }

  &__illustration {
    display: none;

    @media (min-width: 1024px) {
      display: block;
      margin-bottom: $space-xl;
    }
  }

  &__illustration-svg {
    width: 100%;
    max-width: 320px;
    height: auto;
  }

  &__sparkle {
    animation: sparkle 2s ease-in-out infinite;

    &--1 { animation-delay: 0s; }
    &--2 { animation-delay: 0.5s; }
    &--3 { animation-delay: 1s; }
  }

  &__card {
    display: flex;
    align-items: center;
    gap: $space-lg;
    padding: $space-xl;
    background: white;
    border-radius: $radius-xl;
    box-shadow: $shadow-lg;
    border: 1px solid rgba($color-brand-primary, 0.06);
    transition: all $transition-normal;

    &:hover {
      transform: translateY(-4px);
      box-shadow: $shadow-xl;
    }

    [data-theme="dark"] & {
      background: #1E293B;
      border-color: rgba(255, 255, 255, 0.1);
    }

    @include mobile {
      max-width: 100% !important;
      transform: none !important;
      padding: $space-lg;
      gap: $space-md;
    }

    &--1 {
      transform: translateX(-20px) rotate(-1deg);
      max-width: 300px;

      [data-theme="dark"] & {
        background: #1E293B;
      }
    }

    &--2 {
      transform: translateX(20px) rotate(0.5deg);
      margin-left: auto;
      max-width: 320px;
      border: 2px solid $color-brand-primary;
      background: linear-gradient(135deg, white 0%, $color-brand-primary-light 100%);

      [data-theme="dark"] & {
        background: linear-gradient(135deg, #1E293B 0%, rgba(99, 102, 241, 0.2) 100%);
        border-color: #6366F1;
      }

      .hero__card-icon {
        background: $color-brand-primary;
        color: white;

        [data-theme="dark"] & {
          background: #6366F1;
        }
      }
    }

    &--3 {
      transform: translateX(-10px) rotate(-0.5deg);
      max-width: 280px;

      [data-theme="dark"] & {
        background: #1E293B;
      }
    }
  }

  &__card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    background: $color-brand-primary-light;
    border-radius: $radius-lg;
    color: $color-brand-primary;
    font-size: 26px;
    flex-shrink: 0;
    transition: all $transition-fast;

    [data-theme="dark"] & {
      background: rgba(99, 102, 241, 0.2);
      color: #818CF8;
    }
  }

  &__card-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__card-title {
    font-size: $text-base;
    font-weight: 700;
    color: $color-gray-900;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__card-desc {
    font-size: $text-sm;
    color: $color-gray-500;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-sm;
  padding: $space-md $space-xl;
  font-size: $text-sm;
  font-weight: 600;
  border: none;
  border-radius: $radius-xl;
  cursor: pointer;
  transition: all $transition-fast;
  text-decoration: none;

  &--lg {
    padding: $space-lg $space-2xl;
    font-size: $text-base;
    border-radius: $radius-xl;

    @include mobile {
      padding: $space-md $space-xl;
      font-size: $text-sm;
    }
  }

  &--primary {
    background: linear-gradient(135deg, $color-brand-primary 0%, $color-brand-primary-hover 100%);
    color: white;
    box-shadow: 0 4px 14px rgba($color-brand-primary, 0.4);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba($color-brand-primary, 0.5);
    }

    &:active {
      transform: translateY(0);
    }
  }

  &--ghost {
    background: white;
    color: $color-gray-700;
    border: 1.5px solid $color-gray-200;

    &:hover {
      border-color: $color-brand-primary;
      color: $color-brand-primary;
      background: $color-brand-primary-light;
    }

    [data-theme="dark"] & {
      background: #1E293B;
      color: #E2E8F0;
      border-color: #334155;

      &:hover {
        border-color: #818CF8;
        color: #818CF8;
        background: rgba(99, 102, 241, 0.2);
      }
    }
  }

  &__icon {
    width: 18px;
    height: 18px;
  }
}

.stats {
  padding: $space-2xl $space-xl;
  background: linear-gradient(135deg, $color-brand-primary 0%, $color-brand-primary-hover 100%);

  [data-theme="dark"] & {
    background: linear-gradient(135deg, #312E81 0%, #4F46E5 100%);
  }

  @include mobile {
    padding: $space-xl $space-md;
  }

  &__inner {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: $space-xl;

    @include mobile {
      flex-direction: column;
      gap: $space-lg;
    }
  }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-xs;
  }

  &__number {
    font-size: $text-3xl;
    font-weight: 800;
    color: white;
    letter-spacing: -1px;

    @include mobile {
      font-size: $text-2xl;
    }
  }

  &__label {
    font-size: $text-sm;
    color: rgba(white, 0.8);
    font-weight: 500;
  }

  &__divider {
    width: 1px;
    height: 48px;
    background: rgba(white, 0.3);

    @include mobile {
      width: 48px;
      height: 1px;
    }
  }
}

.why {
  padding: $space-4xl $space-xl;
  max-width: 1200px;
  margin: 0 auto;

  @include mobile {
    padding: $space-2xl $space-md;
  }

  &__header {
    text-align: center;
    margin-bottom: $space-3xl;
  }

  &__title {
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 800;
    color: $color-gray-900;
    margin-bottom: $space-sm;
    letter-spacing: -0.5px;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__subtitle {
    font-size: $text-lg;
    color: $color-gray-500;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &__grid {
    display: grid;
    gap: $space-xl;
    grid-template-columns: 1fr;

    @include desktop {
      grid-template-columns: 1.4fr 1fr 1fr;
    }
  }

  &__card {
    background: white;
    padding: $space-2xl;
    border-radius: $radius-xl;
    box-shadow: $shadow-md;
    border: 1px solid rgba($color-brand-primary, 0.06);
    transition: all $transition-normal;

    &:hover {
      box-shadow: $shadow-xl;
      transform: translateY(-6px);
      border-color: rgba($color-brand-primary, 0.15);
    }

    [data-theme="dark"] & {
      background: #1E293B;
      border-color: rgba(255, 255, 255, 0.1);

      &:hover {
        border-color: rgba(99, 102, 241, 0.4);
      }
    }

    @include mobile {
      padding: $space-xl;

      &:hover {
        transform: none;
      }
    }

    &--large {
      @include desktop {
        grid-row: span 1;
      }

      .why__card-icon {
        width: 60px;
        height: 60px;
        font-size: 30px;
        background: linear-gradient(135deg, $color-brand-primary 0%, $color-brand-primary-hover 100%);
        color: white;
      }
    }

    h3 {
      font-size: $text-lg;
      font-weight: 700;
      color: $color-gray-900;
      margin: $space-md 0 $space-sm;

      [data-theme="dark"] & {
        color: #F8FAFC;
      }
    }

    p {
      font-size: $text-sm;
      color: $color-gray-600;
      line-height: 1.75;

      [data-theme="dark"] & {
        color: #94A3B8;
      }
    }
  }

  &__card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    background: $color-brand-primary-light;
    border-radius: $radius-lg;
    color: $color-brand-primary;
    font-size: 26px;

    [data-theme="dark"] & {
      background: rgba(99, 102, 241, 0.2);
      color: #818CF8;
    }
  }
}

.cta {
  padding: $space-4xl $space-xl;
  text-align: center;
  background: white;

  [data-theme="dark"] & {
    background: #0F172A;
  }

  @include mobile {
    padding: $space-2xl $space-md;
  }

  &__inner {
    max-width: 600px;
    margin: 0 auto;
  }

  &__title {
    font-size: clamp(26px, 4vw, 36px);
    font-weight: 800;
    color: $color-gray-900;
    margin-bottom: $space-xs;
    letter-spacing: -0.5px;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__subtitle {
    font-size: $text-md;
    color: $color-gray-500;
    margin-bottom: $space-2xl;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
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

@keyframes sparkle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.7);
  }
}

@keyframes meteor-fall {
  0% {
    transform: translateY(0) rotate(15deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(calc(100vh + 150px)) rotate(15deg);
    opacity: 0;
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}
</style>
