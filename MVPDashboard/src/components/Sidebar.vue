<script setup>
const props = defineProps({
  currentView: { type: String, required: true }
});

const emit = defineEmits(['navigate']);

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'reservas', label: 'Reservas', icon: '📅' },
  { id: 'pistas', label: 'Pistas', icon: '🏟️' },
  { id: 'deportes', label: 'Deportes', icon: '⚽' },
  { id: 'mantenimientos', label: 'Mantenimientos', icon: '🔧' }
];
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <span>Ball-Balls</span>
    </div>
    
    <button 
      v-for="item in navItems" 
      :key="item.id"
      class="nav-item"
      :class="{ active: currentView === item.id }"
      @click="emit('navigate', item.id)"
    >
      <span class="nav-icon">{{ item.icon }}</span>
      <span>{{ item.label }}</span>
    </button>
  </aside>
</template>
