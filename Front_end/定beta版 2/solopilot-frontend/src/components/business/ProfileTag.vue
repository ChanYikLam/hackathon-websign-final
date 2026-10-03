<template>
  <span class="profile-tag">{{ label }}</span>
</template>

<script setup lang="ts">
interface Props {
  label: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.profile-tag {
  display: inline-block;
  padding: $space-sm $space-lg;
  background: linear-gradient(135deg, $color-brand-primary 0%, #818CF8 100%);
  color: white;
  font-size: $text-sm;
  font-weight: 600;
  border-radius: $radius-full;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba($color-brand-primary, 0.25);
}
</style>
