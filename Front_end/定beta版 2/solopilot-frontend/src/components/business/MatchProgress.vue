<template>
  <div class="match-progress" role="progressbar" :aria-valuenow="percentage">
    <svg class="match-progress__circle" viewBox="0 0 36 36">
      <circle
        class="match-progress__bg"
        cx="18"
        cy="18"
        r="15.5"
        fill="none"
        stroke-width="3"
      />
      <circle
        class="match-progress__fill"
        cx="18"
        cy="18"
        r="15.5"
        fill="none"
        stroke-width="3"
        :stroke-dasharray="`${percentage}, 100`"
        stroke-linecap="round"
      />
    </svg>
    <span class="match-progress__text">{{ percentage }}%</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  percentage: number
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.match-progress {
  position: relative;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &__circle {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  &__bg {
    stroke: $color-gray-100;

    [data-theme="dark"] & {
      stroke: #334155;
    }
  }

  &__fill {
    stroke: $color-brand-accent;
    transition: stroke-dasharray 1s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__text {
    position: absolute;
    font-size: 10px;
    font-weight: 700;
    color: $color-brand-accent;

    [data-theme="dark"] & {
      color: #34D399;
    }
  }
}
</style>
