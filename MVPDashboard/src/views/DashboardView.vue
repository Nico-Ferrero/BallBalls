<script setup>
import { ref, onMounted } from 'vue';
import StatsCard from '../components/StatsCard.vue';
import DataTable from '../components/DataTable.vue';
import api from '../api/api.js';

const loading = ref(true);
const stats = ref({
  reservas: 0,
  pistas: 0,
  deportes: 0
});
const recentReservas = ref([]);

const reservasColumns = [
  { key: 'pista', label: 'Pista' },
  { key: 'fechaHoraInicio', label: 'Inicio' },
  { key: 'fechaHoraFin', label: 'Fin' },
  { key: 'estado', label: 'Estado', badge: (row) => row.estado === 'Confirmada' ? 'success' : 'warning' },
  { key: 'precioTotal', label: 'Precio', render: (row) => `€${row.precioTotal}` }
];

onMounted(async () => {
  try {
    const [reservasData, pistasData, deportesData] = await Promise.all([
      api.getReservas(),
      api.getPistas(),
      api.getDeportes()
    ]);
    
    stats.value = {
      reservas: reservasData.total || reservasData.reservas?.length || 0,
      pistas: pistasData.total || pistasData.pistas?.length || 0,
      deportes: deportesData.total || deportesData.deportes?.length || 0
    };
    
    recentReservas.value = (reservasData.reservas || []).slice(0, 5);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <header class="page-header">
      <h1 class="page-title">Dashboard</h1>
      <p class="page-subtitle">Resumen general del sistema Ball-Balls</p>
    </header>

    <div class="stats-grid">
      <StatsCard 
        icon="📅" 
        :value="stats.reservas" 
        label="Total Reservas" 
        :loading="loading"
      />
      <StatsCard 
        icon="🏟️" 
        :value="stats.pistas" 
        label="Pistas Activas" 
        :loading="loading"
      />
      <StatsCard 
        icon="⚽" 
        :value="stats.deportes" 
        label="Deportes" 
        :loading="loading"
      />
    </div>

    <DataTable 
      title="Últimas Reservas" 
      :columns="reservasColumns" 
      :data="recentReservas" 
      :loading="loading"
    />
  </div>
</template>
