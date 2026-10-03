<template>
  <div class="intro">
    <section class="intro__hero">
      <svg class="intro__hero-decoration" viewBox="0 0 600 400" preserveAspectRatio="none">
        <defs>
          <linearGradient id="introGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#6366F1;stop-opacity:0.1" />
            <stop offset="100%" style="stop-color:#10B981;stop-opacity:0.1" />
          </linearGradient>
        </defs>
        <circle cx="500" cy="100" r="200" fill="url(#introGrad1)" />
        <circle cx="50" cy="350" r="150" class="svg-fill-1" opacity="0.5" />
      </svg>

      <div class="intro__hero-inner">
        <div class="intro__hero-text">
          <span class="intro__eyebrow">什么是一人公司</span>
          <h1 class="intro__title">一个人开公司，<br>不是做梦，是现在就能开始的事</h1>
          <p class="intro__lead">
            一人公司只有你一个人，但借助 AI 工具，一个人现在可以完成以前需要一个团队才能完成的工作。你既是老板，也是员工。
          </p>
        </div>

        <div class="intro__hero-illustration">
          <svg viewBox="0 0 300 250" fill="none" xmlns="http://www.w3.org/2000/svg" class="intro__hero-svg">
            <!-- Person as boss -->
            <circle cx="150" cy="80" r="35" class="svg-fill-2" />
            <circle cx="150" cy="65" r="18" class="svg-fill-3" />
            <path d="M135 85 Q150 100 165 85" stroke="#6366F1" stroke-width="3" stroke-linecap="round" fill="none" />

            <!-- Crown -->
            <path d="M130 45 L135 55 L145 50 L150 40 L155 50 L165 55 L170 45" stroke="#F59E0B" stroke-width="3" fill="#F59E0B" stroke-linecap="round" stroke-linejoin="round" />

            <!-- AI tools around -->
            <g class="intro__tool intro__tool--1">
              <rect x="50" y="120" width="50" height="40" rx="8" fill="white" stroke="#6366F1" stroke-width="2" />
              <text x="75" y="145" font-size="10" fill="#6366F1" text-anchor="middle" font-weight="700">AI</text>
            </g>

            <g class="intro__tool intro__tool--2">
              <rect x="200" y="110" width="55" height="40" rx="8" fill="white" stroke="#10B981" stroke-width="2" />
              <text x="227" y="135" font-size="8" fill="#10B981" text-anchor="middle" font-weight="600">策略</text>
            </g>

            <g class="intro__tool intro__tool--3">
              <rect x="220" y="170" width="50" height="40" rx="8" fill="white" stroke="#818CF8" stroke-width="2" />
              <text x="245" y="195" font-size="8" fill="#818CF8" text-anchor="middle" font-weight="600">运营</text>
            </g>

            <!-- Connection lines -->
            <path d="M100 130 Q120 140 130 120" class="svg-stroke-2" stroke-width="2" stroke-dasharray="4 4" />
            <path d="M200 130 Q190 140 170 130" stroke="#D1FAE5" stroke-width="2" stroke-dasharray="4 4" />
            <path d="M200 170 Q190 175 180 160" class="svg-stroke-2" stroke-width="2" stroke-dasharray="4 4" />

            <!-- Chart growing up -->
            <rect x="80" y="200" width="140" height="40" rx="6" class="svg-fill-1" />
            <rect x="90" y="220" width="15" height="15" rx="2" fill="#6366F1" />
            <rect x="110" y="215" width="15" height="20" rx="2" fill="#818CF8" />
            <rect x="130" y="210" width="15" height="25" rx="2" fill="#10B981" />
            <rect x="150" y="205" width="15" height="30" rx="2" fill="#10B981" />
            <rect x="170" y="200" width="15" height="35" rx="2" fill="#10B981" />
          </svg>
        </div>
      </div>
    </section>

    <section class="intro__compare">
      <div class="intro__compare-header">
        <span class="intro__label">好的一面</span>
      </div>
      <div class="intro__compare-card intro__compare-card--pro">
        <ul class="intro__compare-list">
          <li>成本低：不用发工资给别人</li>
          <li>决策快：一个人说了算，不用开会</li>
          <li>灵活性高：说改就改，不用审批</li>
          <li>隐私好：商业机密不会外泄</li>
          <li>AI 加持：一个人能拥有一个团队</li>
        </ul>
      </div>

      <div class="intro__compare-header">
        <span class="intro__label">不那么好的一面</span>
      </div>
      <div class="intro__compare-card intro__compare-card--con">
        <ul class="intro__compare-list">
          <li>精力有限：所有事情都要自己做</li>
          <li>技能要求高：得会不少东西</li>
          <li>风险集中：没人帮你分担</li>
          <li>收入不稳定：得自己找客户</li>
          <li>偶尔会孤独：没有同事聊天</li>
        </ul>
      </div>
    </section>

    <section class="intro__contradiction">
      <div class="intro__contradiction-inner">
        <span class="intro__label">核心矛盾</span>
        <h2 class="intro__section-title">时间精力有限，但事情很多</h2>
        <p class="intro__contradiction-desc">
          一人公司最大的问题就是：只有一个人，但要干所有的事。这个矛盾怎么解决？
        </p>
        <div class="intro__solutions">
          <div class="intro__solution">
            <span class="intro__solution-number">A</span>
            <h3>做减法</h3>
            <p>找到最赚钱的那件事，只做这一件。砍掉所有不赚钱的业务，集中火力。</p>
            <span class="intro__solution-example">比如：只做高利润的咨询，不做低价课程</span>
          </div>
          <div class="intro__solution">
            <span class="intro__solution-number">B</span>
            <h3>用 AI 放大</h3>
            <p>用 AI 工具帮你干活，把重复的事交给 AI。一个人顶一个团队不是说说而已。</p>
            <span class="intro__solution-example">比如：用 AI 写内容、做客服、搞运营</span>
          </div>
        </div>
      </div>
    </section>

    <section class="intro__steps">
      <div class="intro__steps-inner">
        <span class="intro__label">怎么做</span>
        <h2 class="intro__section-title">从想法到落地，分四步走</h2>
        <div class="intro__steps-grid">
          <div class="intro__step">
            <span class="intro__step-number">1</span>
            <h3>找方向</h3>
            <p>找到最适合你的创业方向，不用猜，系统帮你算</p>
          </div>
          <div class="intro__step">
            <span class="intro__step-number">2</span>
            <h3>验证</h3>
            <p>用最小成本测试市场需求，别一上来就 All in</p>
          </div>
          <div class="intro__step">
            <span class="intro__step-number">3</span>
            <h3>搭 AI 团队</h3>
            <p>选对工具，让 AI 帮你干那些重复的活</p>
          </div>
          <div class="intro__step">
            <span class="intro__step-number">4</span>
            <h3>迭代</h3>
            <p>根据反馈调整，慢慢做大，别着急</p>
          </div>
        </div>
      </div>
    </section>

    <section class="intro__cta">
      <div class="intro__cta-inner">
        <h2 class="intro__cta-title">好了，现在该你了</h2>
        <p class="intro__cta-desc">花 5 分钟做个测评，找到最适合你的创业方向</p>
        <SpButton size="lg" @click="startTest">开始测评，找到你的方向</SpButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import SpButton from '@/components/ui/SpButton.vue'

const router = useRouter()

const startTest = () => {
  router.push('/info-collect-intro')
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/responsive';

.intro {
  min-height: 100vh;
  background: linear-gradient(180deg, $color-gray-50 0%, white 50%, $color-brand-primary-light 100%);
  --svg-fill-1: #EEF2FF;
  --svg-fill-2: #C7D2FE;
  --svg-fill-3: #FCD34D;
  --svg-stroke-2: #C7D2FE;

  [data-theme="dark"] & {
    background: linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #312E81 100%);
    --svg-fill-1: #312E81;
    --svg-fill-2: #3730A3;
    --svg-fill-3: #FBBF24;
    --svg-stroke-2: #3730A3;
  }
}

:deep(.svg-fill-1) { fill: var(--svg-fill-1); }
:deep(.svg-fill-2) { fill: var(--svg-fill-2); }
:deep(.svg-fill-3) { fill: var(--svg-fill-3); }
:deep(.svg-stroke-2) { stroke: var(--svg-stroke-2); }

.intro__eyebrow,
.intro__label {
  font-size: $text-sm;
  color: $color-brand-primary;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;

  [data-theme="dark"] & {
    color: #818CF8;
  }
}

.intro__hero {
  padding: $space-3xl $space-xl $space-2xl;
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;

  @include mobile {
    padding: $space-xl $space-md $space-lg;
  }

  &-decoration {
    position: absolute;
    top: 0;
    right: 0;
    width: 60%;
    height: 100%;
    pointer-events: none;
    opacity: 0.8;
  }

  &-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-3xl;
    align-items: center;
    position: relative;
    z-index: 1;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &-illustration {
    display: none;

    @media (min-width: 768px) {
      display: block;
    }
  }

  &-svg {
    width: 100%;
    max-width: 320px;
    height: auto;
  }

  &__tool {
    animation: float 3s ease-in-out infinite;

    &--1 { animation-delay: 0s; }
    &--2 { animation-delay: 1s; }
    &--3 { animation-delay: 2s; }
  }

  &__title {
    font-size: clamp(28px, 5vw, 42px);
    font-weight: 800;
    color: $color-gray-900;
    line-height: 1.3;
    margin-bottom: $space-lg;
    letter-spacing: -0.5px;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__lead {
    font-size: $text-md;
    color: $color-gray-600;
    line-height: 1.8;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }
}

.intro__compare {
  padding: $space-2xl $space-xl $space-3xl;
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  gap: $space-lg;
  grid-template-columns: 120px 1fr 120px 1fr;
  align-items: start;

  @include tablet {
    grid-template-columns: 1fr;
    gap: $space-md;
  }

  @include mobile {
    grid-template-columns: 1fr;
    gap: $space-md;
    padding: $space-lg $space-md;
  }
}

.intro__compare-header {
  padding-top: $space-sm;

  @include tablet {
    display: none;
  }

  @include mobile {
    display: block;
    padding-top: 0;

    .intro__label {
      display: inline-block;
      margin-bottom: $space-sm;
    }
  }
}

.intro__compare-card {
  padding: $space-xl;
  border-radius: $radius-xl;
  background: white;
  box-shadow: $shadow-lg;
  border: 1px solid rgba($color-brand-primary, 0.06);

  [data-theme="dark"] & {
    background: #1E293B;
    border-color: rgba(255, 255, 255, 0.1);
  }

  &--pro {
    border-top: 4px solid $color-brand-accent;
  }

  &--con {
    border-top: 4px solid $color-warning;
  }
}

.intro__compare-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    font-size: $text-sm;
    color: $color-gray-700;
    line-height: 2;
    padding-left: $space-xl;
    position: relative;

    [data-theme="dark"] & {
      color: #E2E8F0;
    }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 10px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
  }

  .intro__compare-card--pro & li::before {
    background-color: $color-brand-accent;
  }

  .intro__compare-card--con & li::before {
    background-color: $color-warning;
  }
}

.intro__contradiction {
  padding: $space-3xl $space-xl;
  background: white;

  [data-theme="dark"] & {
    background: #0F172A;
  }

  @include mobile {
    padding: $space-xl $space-md;
  }

  &-inner {
    max-width: 800px;
    margin: 0 auto;
  }
}

.intro__section-title {
  font-size: clamp(22px, 4vw, 30px);
  font-weight: 800;
  color: $color-gray-900;
  margin: $space-sm 0 $space-lg;
  letter-spacing: -0.3px;

  [data-theme="dark"] & {
    color: #F8FAFC;
  }
}

.intro__contradiction-desc {
  font-size: $text-base;
  color: $color-gray-600;
  line-height: 1.7;
  margin-bottom: $space-xl;

  [data-theme="dark"] & {
    color: #94A3B8;
  }
}

.intro__solutions {
  display: grid;
  gap: $space-lg;
  grid-template-columns: 1fr 1fr;

  @include tablet {
    grid-template-columns: 1fr;
  }
}

.intro__solution {
  background: $color-brand-primary-light;
  padding: $space-xl;
  border-radius: $radius-xl;
  border: 1px solid rgba($color-brand-primary, 0.1);

  [data-theme="dark"] & {
    background: rgba(99, 102, 241, 0.15);
    border-color: rgba(99, 102, 241, 0.3);
  }

  h3 {
    font-size: $text-lg;
    font-weight: 700;
    color: $color-gray-900;
    margin-bottom: $space-sm;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  p {
    font-size: $text-sm;
    color: $color-gray-600;
    line-height: 1.7;
    margin-bottom: $space-sm;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }
}

.intro__solution-number {
  display: inline-block;
  font-size: $text-sm;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, $color-brand-primary 0%, #818CF8 100%);
  padding: $space-sm $space-md;
  border-radius: $radius-full;
  margin-bottom: $space-md;
  box-shadow: 0 2px 8px rgba($color-brand-primary, 0.3);
}

.intro__solution-example {
  font-size: $text-xs;
  color: $color-gray-500;
  font-style: italic;

  [data-theme="dark"] & {
    color: #64748B;
  }
}

.intro__steps {
  padding: $space-3xl $space-xl;
  max-width: 1100px;
  margin: 0 auto;

  @include mobile {
    padding: $space-xl $space-md;
  }

  &-inner {
    text-align: center;
  }

  &-grid {
    display: grid;
    gap: $space-lg;
    grid-template-columns: repeat(4, 1fr);
    margin-top: $space-2xl;

    @include tablet {
      grid-template-columns: repeat(2, 1fr);
    }

    @include mobile {
      grid-template-columns: 1fr;
    }
  }
}

.intro__step {
  background: white;
  padding: $space-xl;
  border-radius: $radius-xl;
  box-shadow: $shadow-lg;
  text-align: left;
  transition: all $transition-fast;
  border: 1px solid rgba($color-brand-primary, 0.06);

  [data-theme="dark"] & {
    background: #1E293B;
    border-color: rgba(255, 255, 255, 0.1);
  }

  &:hover {
    box-shadow: $shadow-xl;
    transform: translateY(-4px);
  }

  h3 {
    font-size: $text-base;
    font-weight: 700;
    color: $color-gray-900;
    margin: $space-md 0 $space-xs;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  p {
    font-size: $text-sm;
    color: $color-gray-600;
    line-height: 1.6;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }
}

.intro__step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, $color-brand-primary 0%, #818CF8 100%);
  color: white;
  border-radius: 50%;
  font-size: $text-lg;
  font-weight: 800;
  box-shadow: 0 4px 12px rgba($color-brand-primary, 0.35);
}

.intro__cta {
  padding: $space-3xl $space-xl;
  background: white;

  [data-theme="dark"] & {
    background: #0F172A;
  }

  @include mobile {
    padding: $space-xl $space-md;
  }

  &-inner {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
  }

  &-title {
    font-size: clamp(22px, 4vw, 30px);
    font-weight: 800;
    color: $color-gray-900;
    margin-bottom: $space-xs;
    letter-spacing: -0.3px;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &-desc {
    font-size: $text-base;
    color: $color-gray-500;
    margin-bottom: $space-xl;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
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
</style>
