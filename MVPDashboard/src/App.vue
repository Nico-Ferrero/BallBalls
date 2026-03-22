<script setup>
import { ref } from 'vue';
import Sidebar from './components/Sidebar.vue';
import DashboardView from './views/DashboardView.vue';
import ReservasView from './views/ReservasView.vue';
import PistasView from './views/PistasView.vue';
import DeportesView from './views/DeportesView.vue';
import MantenimientosView from './views/MantenimientosView.vue';

const currentView = ref('dashboard');

// Simple routing based on query params
const params = new URLSearchParams(window.location.search);
const viewParam = params.get('view');
if (viewParam) {
  currentView.value = viewParam;
}

function navigate(view) {
  currentView.value = view;
  // Update URL without reloading
  const newUrl = new URL(window.location);
  newUrl.searchParams.set('view', view);
  window.history.pushState({}, '', newUrl);
}
</script>

<template>
  <div class="dashboard-mode">
    <Sidebar :currentView="currentView" @navigate="navigate" />
    
    <main class="main-content">
      <DashboardView v-if="currentView === 'dashboard'" />
      <ReservasView v-else-if="currentView === 'reservas'" />
      <PistasView v-else-if="currentView === 'pistas'" />
      <DeportesView v-else-if="currentView === 'deportes'" />
      <MantenimientosView v-else-if="currentView === 'mantenimientos'" />
    </main>
  </div>
</template>

