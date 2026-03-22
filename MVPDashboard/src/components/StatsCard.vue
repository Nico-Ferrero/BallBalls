<script setup>
const props = defineProps({
  icon: { type: String, default: '📊' },
  value: { type: [Number, String], default: 0 },
  label: { type: String, required: true },
  loading: { type: Boolean, default: false }
});
</script>

<template>
  <div class="stat-card">
    <div class="stat-icon">{{ icon }}</div>
    <div v-if="loading" class="stat-value">...</div>
    <div v-else class="stat-value">{{ value }}</div>
    <div class="stat-label">{{ label }}</div>
  </div>
</template>
