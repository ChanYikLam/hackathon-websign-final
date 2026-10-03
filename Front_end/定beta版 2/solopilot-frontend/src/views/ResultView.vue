<template>
  <div class="result">
    <div class="result__hero">
      <svg viewBox="0 0 1200 200" class="result__hero-bg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="resultGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#6366F1;stop-opacity:0.1" />
            <stop offset="50%" style="stop-color:#818CF8;stop-opacity:0.15" />
            <stop offset="100%" style="stop-color:#10B981;stop-opacity:0.1" />
          </linearGradient>
        </defs>
        <rect width="1200" height="200" fill="url(#resultGrad)" />
        <circle cx="100" cy="100" r="80" fill="#6366F1" opacity="0.05" />
        <circle cx="1100" cy="50" r="100" fill="#10B981" opacity="0.05" />
      </svg>
      <div class="result__hero-content">
        <div class="result__demo-badge" v-if="isDemoMode">
          <Icon icon="mdi:information" />
          <span>演示数据，非真实分析</span>
        </div>
        <h1 class="result__hero-title">你的专属创业方案</h1>
        <p class="result__hero-subtitle">基于你的性格、兴趣和市场分析，为你量身定制</p>
      </div>
    </div>

    <div class="result__content">
      <section id="profile" class="result__section">
        <h2 class="result__section-title">你的创业画像</h2>
        <div class="result__tags">
          <ProfileTag v-for="tag in profile?.tags" :key="tag" :label="tag" />
        </div>
        <p class="result__profile-desc">{{ profile?.description }}</p>
      </section>

      <section id="direction" class="result__section">
        <h2 class="result__section-title">为你推荐的方向</h2>
        <div class="result__directions">
          <DirectionCard
            v-for="direction in directions"
            :key="direction.rank"
            :title="direction.name"
            :rank="direction.rank"
            :match-rate="direction.match_rate"
            :reason="direction.reason"
            :income-range="direction.income_range"
            :case-brief="direction.case_brief"
            :startup-tips="direction.startup_tips"
            :expanded="expandedCards.includes(direction.rank)"
            @toggle="toggleCard(direction.rank)"
          />
        </div>
      </section>

      <section id="type" class="result__section">
        <h2 class="result__section-title">你的 MBTI 性格解析</h2>

        <!-- MBTI 类型概览 -->
        <SpCard class="result__mbti-overview">
          <div class="result__mbti-header">
            <span class="result__mbti-badge">{{ mbtiResult?.mbti_type }}</span>
            <span class="result__mbti-category">{{ getMbtiCategory(mbtiResult?.mbti_type) }}</span>
          </div>
          <p class="result__mbti-desc">{{ mbtiResult?.type_description }}</p>
        </SpCard>

        <!-- 对公司的影响 -->
        <SpCard v-if="mbtiResult?.entrepreneurship_analysis?.company_impact" class="result__mbti-impact">
          <h3 class="result__mbti-subtitle">
            <Icon icon="mdi:office-building" />
            对个人公司的影响
          </h3>
          <p class="result__mbti-impact-text">{{ mbtiResult?.entrepreneurship_analysis?.company_impact }}</p>
        </SpCard>

        <!-- 优势与盲点 -->
        <div class="result__mbti-analysis">
          <SpCard class="result__mbti-strengths">
            <h3 class="result__mbti-subtitle result__mbti-subtitle--strength">
              <Icon icon="mdi:thumb-up" />
              核心优势
            </h3>
            <ul class="result__mbti-list">
              <li v-for="(strength, idx) in mbtiResult?.entrepreneurship_analysis?.strengths" :key="idx">
                {{ strength }}
              </li>
            </ul>
          </SpCard>

          <SpCard class="result__mbti-blindspots">
            <h3 class="result__mbti-subtitle result__mbti-subtitle--blindspot">
              <Icon icon="mdi:eye-off" />
              需要注意的盲点
            </h3>
            <ul class="result__mbti-list">
              <li v-for="(blindspot, idx) in mbtiResult?.entrepreneurship_analysis?.blind_spots" :key="idx">
                {{ blindspot }}
              </li>
            </ul>
          </SpCard>
        </div>

        <!-- 团队建议 -->
        <SpCard v-if="mbtiResult?.entrepreneurship_analysis?.team_advice" class="result__mbti-team">
          <h3 class="result__mbti-subtitle result__mbti-subtitle--team">
            <Icon icon="mdi:account-group" />
            团队协作建议
          </h3>
          <p class="result__mbti-team-text">{{ mbtiResult?.entrepreneurship_analysis?.team_advice }}</p>
        </SpCard>

        <!-- 适合的方向 -->
        <SpCard v-if="mbtiResult?.entrepreneurship_analysis?.suitable_directions?.length" class="result__mbti-directions">
          <h3 class="result__mbti-subtitle result__mbti-subtitle--directions">
            <Icon icon="mdi:compass" />
            适合你的创业方向
          </h3>
          <div class="result__mbti-tags">
            <span
              v-for="(dir, idx) in mbtiResult?.entrepreneurship_analysis?.suitable_directions"
              :key="idx"
              class="result__mbti-tag"
            >
              {{ dir }}
            </span>
          </div>
        </SpCard>
      </section>

      <section id="summary" class="result__section">
        <h2 class="result__section-title">你的专属创业方案</h2>
        <SpCard>
          <div class="result__summary">
            <div class="result__summary-item">
              <h4>你的画像</h4>
              <p>{{ summary?.your_profile }}</p>
            </div>
            <div class="result__summary-item">
              <h4>推荐方向</h4>
              <p>{{ summary?.recommended_directions }}</p>
            </div>
            <div class="result__summary-item">
              <h4>策略建议</h4>
              <p>{{ summary?.strategy_advice }}</p>
            </div>
            <div class="result__summary-item">
              <h4>城市建议</h4>
              <p>{{ summary?.city_advice }}</p>
            </div>
            <div class="result__summary-item">
              <h4>首月行动清单</h4>
              <ul class="result__checklist">
                <li
                  v-for="item in summary?.first_month_checklist"
                  :key="item.id"
                  :class="{ 'result__checklist-item--done': item.completed }"
                  @click="toggleChecklist(item.id)"
                >
                  <span class="result__checkbox">{{ item.completed ? '✓' : '' }}</span>
                  {{ item.content }}
                </li>
              </ul>
            </div>
            <div class="result__summary-item">
              <h4>预期时间线</h4>
              <p>{{ summary?.expected_timeline }}</p>
            </div>
          </div>
        </SpCard>
      </section>

      <section class="result__actions">
        <SpButton @click="goToFeedback">开始反馈</SpButton>
        <SpButton variant="secondary" @click="goToAiTeam">配置AI团队</SpButton>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import SpCard from '@/components/ui/SpCard.vue'
import SpButton from '@/components/ui/SpButton.vue'
import ProfileTag from '@/components/business/ProfileTag.vue'
import DirectionCard from '@/components/business/DirectionCard.vue'
import { useResultStore } from '@/stores/result'
import { useMbtiStore } from '@/stores/mbti'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const resultStore = useResultStore()
const mbtiStore = useMbtiStore()
const authStore = useAuthStore()
const appStore = useAppStore()

const expandedCards = ref<number[]>([])

const isDemoMode = computed(() => authStore.isDemoMode)
const profile = computed(() => resultStore.profile)
const directions = computed(() => resultStore.directions)
const userType = computed(() => resultStore.userType)
const summary = computed(() => resultStore.summary)
const mbtiResult = computed(() => mbtiStore.result)

// MBTI 类型分类映射
const mbtiCategories: Record<string, string> = {
  'INTJ': '分析师型 - 战略思想家',
  'INTP': '分析师型 - 战略思想家',
  'ENTJ': '分析师型 - 战略思想家',
  'ENTP': '分析师型 - 战略思想家',
  'INFJ': '外交家型 - 理想主义者',
  'INFP': '外交家型 - 理想主义者',
  'ENFJ': '外交家型 - 理想主义者',
  'ENFP': '外交家型 - 理想主义者',
  'ISTJ': '守护者型 - 秩序稳定者',
  'ISFJ': '守护者型 - 秩序稳定者',
  'ESTJ': '守护者型 - 秩序稳定者',
  'ESFJ': '守护者型 - 秩序稳定者',
  'ISTP': '探险家型 - 务实问题解决者',
  'ISFP': '探险家型 - 务实问题解决者',
  'ESTP': '探险家型 - 务实问题解决者',
  'ESFP': '探险家型 - 务实问题解决者'
}

const getMbtiCategory = (mbtiType?: string) => {
  if (!mbtiType) return ''
  return mbtiCategories[mbtiType.toUpperCase()] || '独特性格类型'
}

onMounted(() => {
  resultStore.loadFromStorage()
  if (!resultStore.hasResult) {
    appStore.showToast('请先完成创业测评', 'warning')
    setTimeout(() => {
      router.push('/info-collect-intro')
    }, 1500)
  }
})

const toggleCard = (rank: number) => {
  if (expandedCards.value.includes(rank)) {
    expandedCards.value = expandedCards.value.filter(r => r !== rank)
  } else {
    expandedCards.value.push(rank)
  }
}

const toggleChecklist = (itemId: number) => {
  resultStore.toggleChecklistItem(itemId)
}

const goToFeedback = () => {
  router.push('/feedback')
}

const goToAiTeam = () => {
  router.push('/ai-team')
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/responsive';

.result {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 $space-xl $space-xl;

  [data-theme="dark"] & {
    background: #0F172A;
  }

  @include mobile {
    padding: 0 $space-md $space-md;
  }

  &__hero {
    position: relative;
    margin: 0 (-$space-xl) $space-2xl;
    padding: $space-2xl $space-xl;
    overflow: hidden;

    [data-theme="dark"] & {
      background: #1E293B;
    }

    @include mobile {
      margin: 0 (-$space-md) $space-lg;
      padding: $space-xl $space-md;
    }
  }

  &__hero-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__hero-content {
    position: relative;
    z-index: 1;
    text-align: center;
  }

  &__hero-title {
    font-size: $text-2xl;
    font-weight: 800;
    color: $color-gray-900;
    margin-bottom: $space-sm;
    letter-spacing: -0.5px;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__hero-subtitle {
    font-size: $text-base;
    color: $color-gray-600;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  &__demo-badge {
    display: inline-flex;
    align-items: center;
    gap: $space-sm;
    padding: $space-sm $space-lg;
    background: $color-warning-light;
    color: $color-warning;
    font-size: $text-xs;
    font-weight: 600;
    border-radius: $radius-full;
    margin-bottom: $space-lg;

    [data-theme="dark"] & {
      background: rgba(251, 191, 36, 0.2);
      color: #FBBF24;
    }
  }

  &__content {
    background: white;
    border-radius: $radius-2xl;
    padding: $space-2xl;
    box-shadow: $shadow-xl;

    [data-theme="dark"] & {
      background: #1E293B;
    }

    @include mobile {
      padding: $space-lg;
      border-radius: $radius-xl;
    }
  }

  &__section {
    margin-bottom: $space-2xl;
  }

  &__section-title {
    font-size: $text-xl;
    font-weight: 700;
    color: $color-gray-900;
    margin-bottom: $space-xl;
    letter-spacing: -0.3px;

    [data-theme="dark"] & {
      color: #F8FAFC;
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: $space-sm;
    margin-bottom: $space-lg;
  }

  &__profile-desc {
    font-size: $text-base;
    color: $color-gray-700;
    line-height: 1.7;

    [data-theme="dark"] & {
      color: #E2E8F0;
    }
  }

  &__directions {
    display: flex;
    flex-direction: column;
    gap: $space-lg;
  }

  &__type {
    text-align: center;
  }

  &__type-badge {
    display: inline-block;
    padding: $space-sm $space-xl;
    background: linear-gradient(135deg, $color-brand-primary 0%, #818CF8 100%);
    color: white;
    font-size: $text-lg;
    font-weight: 700;
    border-radius: $radius-full;
    margin-bottom: $space-md;
    box-shadow: 0 4px 14px rgba($color-brand-primary, 0.3);
  }

  &__type-desc {
    font-size: $text-base;
    color: $color-gray-700;
    line-height: 1.7;
    margin-bottom: $space-sm;

    [data-theme="dark"] & {
      color: #E2E8F0;
    }
  }

  &__type-strategy {
    font-size: $text-sm;
    color: $color-gray-500;

    [data-theme="dark"] & {
      color: #94A3B8;
    }
  }

  // MBTI 详细解析样式
  &__mbti-overview {
    margin-bottom: $space-lg;
    text-align: center;
  }

  &__mbti-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-md;
    margin-bottom: $space-md;
    flex-wrap: wrap;
  }

  &__mbti-badge {
    display: inline-block;
    padding: $space-sm $space-xl;
    background: linear-gradient(135deg, $color-brand-primary 0%, #818CF8 100%);
    color: white;
    font-size: $text-xl;
    font-weight: 800;
    border-radius: $radius-full;
    box-shadow: 0 4px 14px rgba($color-brand-primary, 0.3);
    letter-spacing: 2px;
  }

  &__mbti-category {
    font-size: $text-sm;
    color: $color-brand-primary;
    font-weight: 600;
    padding: $space-xs $space-md;
    background: $color-brand-primary-light;
    border-radius: $radius-full;

    [data-theme="dark"] & {
      background: rgba(99, 102, 241, 0.2);
      color: #818CF8;
    }
  }

  &__mbti-desc {
    font-size: $text-base;
    color: $color-gray-700;
    line-height: 1.8;
    text-align: left;

    [data-theme="dark"] & {
      color: #E2E8F0;
    }
  }

  &__mbti-impact {
    margin-bottom: $space-lg;
    background: linear-gradient(135deg, rgba($color-brand-primary, 0.05) 0%, rgba(#818CF8, 0.05) 100%);
    border: 1px solid rgba($color-brand-primary, 0.1);

    [data-theme="dark"] & {
      background: rgba(99, 102, 241, 0.1);
      border-color: rgba(99, 102, 241, 0.2);
    }
  }

  &__mbti-impact-text {
    font-size: $text-base;
    color: $color-gray-700;
    line-height: 1.8;

    [data-theme="dark"] & {
      color: #E2E8F0;
    }
  }

  &__mbti-analysis {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-lg;
    margin-bottom: $space-lg;

    @include mobile {
      grid-template-columns: 1fr;
    }
  }

  &__mbti-strengths,
  &__mbti-blindspots {
    padding: $space-lg;
  }

  &__mbti-subtitle {
    display: flex;
    align-items: center;
    gap: $space-sm;
    font-size: $text-base;
    font-weight: 700;
    margin-bottom: $space-md;
    padding-bottom: $space-sm;
    border-bottom: 2px solid $color-gray-200;

    [data-theme="dark"] & {
      border-color: #334155;
    }

    svg {
      font-size: 20px;
    }

    &--strength {
      color: $color-brand-accent;

      [data-theme="dark"] & {
        color: #34D399;
      }
    }

    &--blindspot {
      color: $color-warning;

      [data-theme="dark"] & {
        color: #FBBF24;
      }
    }

    &--team {
      color: $color-brand-primary;

      [data-theme="dark"] & {
        color: #818CF8;
      }
    }

    &--directions {
      color: $color-brand-accent;

      [data-theme="dark"] & {
        color: #34D399;
      }
    }
  }

  &__mbti-list {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      position: relative;
      padding-left: $space-lg;
      margin-bottom: $space-sm;
      font-size: $text-sm;
      color: $color-gray-700;
      line-height: 1.6;

      [data-theme="dark"] & {
        color: #E2E8F0;
      }

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 8px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: $color-brand-primary;

        [data-theme="dark"] & {
          background: #818CF8;
        }
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  &__mbti-team {
    margin-bottom: $space-lg;
    background: linear-gradient(135deg, rgba($color-brand-primary, 0.05) 0%, rgba(#818CF8, 0.08) 100%);
    border: 1px solid rgba($color-brand-primary, 0.1);

    [data-theme="dark"] & {
      background: rgba(99, 102, 241, 0.1);
      border-color: rgba(99, 102, 241, 0.2);
    }
  }

  &__mbti-team-text {
    font-size: $text-base;
    color: $color-gray-700;
    line-height: 1.8;
    font-style: italic;

    [data-theme="dark"] & {
      color: #E2E8F0;
    }
  }

  &__mbti-directions {
    margin-bottom: $space-lg;
  }

  &__mbti-tags {
    display: flex;
    flex-wrap: wrap;
    gap: $space-sm;
  }

  &__mbti-tag {
    display: inline-block;
    padding: $space-xs $space-md;
    background: $color-brand-primary-light;
    color: $color-brand-primary;
    font-size: $text-sm;
    font-weight: 600;
    border-radius: $radius-full;
    transition: all $transition-fast;

    [data-theme="dark"] & {
      background: rgba(99, 102, 241, 0.2);
      color: #818CF8;
    }

    &:hover {
      background: $color-brand-primary;
      color: white;

      [data-theme="dark"] & {
        background: #6366F1;
        color: white;
      }
    }
  }

  &__summary {
    display: flex;
    flex-direction: column;
    gap: $space-xl;
  }

  &__summary-item {
    h4 {
      font-size: $text-sm;
      font-weight: 600;
      color: $color-gray-700;
      margin-bottom: $space-sm;

      [data-theme="dark"] & {
        color: #E2E8F0;
      }
    }

    p {
      font-size: $text-base;
      color: $color-gray-600;
      line-height: 1.7;

      [data-theme="dark"] & {
        color: #94A3B8;
      }
    }
  }

  &__checklist {
    display: flex;
    flex-direction: column;
    gap: $space-md;
  }

  &__checklist-item {
    display: flex;
    align-items: flex-start;
    gap: $space-md;
    font-size: $text-base;
    color: $color-gray-700;
    cursor: pointer;
    padding: $space-md;
    background: $color-gray-50;
    border-radius: $radius-lg;
    transition: all $transition-fast;

    [data-theme="dark"] & {
      background: #0F172A;
      color: #E2E8F0;
    }

    &:hover {
      background: $color-brand-primary-light;

      [data-theme="dark"] & {
        background: rgba(99, 102, 241, 0.2);
      }
    }

    &--done {
      color: $color-gray-400;
      text-decoration: line-through;
      background: $color-gray-100;

      [data-theme="dark"] & {
        background: #0F172A;
        color: #64748B;
      }
    }
  }

  &__checkbox {
    width: 22px;
    height: 22px;
    border: 2px solid $color-gray-300;
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: white;
    flex-shrink: 0;
    transition: all $transition-fast;

    [data-theme="dark"] & {
      border-color: #475569;
    }

    .result__checklist-item--done & {
      background: $color-brand-accent;
      border-color: $color-brand-accent;
    }
  }

  &__actions {
    display: flex;
    gap: $space-md;
    justify-content: center;
    padding: $space-2xl 0;

    @include mobile {
      flex-direction: column;
      padding: $space-xl 0;

      :deep(button) {
        width: 100%;
      }
    }
  }
}
</style>
