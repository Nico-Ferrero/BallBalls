<script setup>
import { ref, onMounted } from 'vue';
import DataTable from '../components/DataTable.vue';
import MantenimientoModal from '../components/MantenimientoModal.vue';
import api from '../api/api.js';

const loading = ref(true);
const mantenimientos = ref([]);
const pistas = ref([]);
const showModal = ref(false);
const selectedMantenimiento = ref(null);

const columns = [
  { key: 'publicIdMantenimiento', label: 'ID' },
  { key: 'nombrePista', label: 'Pista' },
  { key: 'fechaMantenimiento', label: 'Fecha', render: (row) => formatDate(row.fechaMantenimiento) },
  { key: 'horaInicioMantenimiento', label: 'Hora Inicio' },
  { key: 'horaFinMantenimiento', label: 'Hora Fin' },
  { key: 'estado', label: 'Estado', badge: (row) => row.estado === 'Activo' ? 'success' : 'warning' },
  { key: 'isActive', label: 'Activo', badge: (row) => row.isActive ? 'success' : 'danger', render: (row) => row.isActive ? 'Sí' : 'No' }
];

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

async function loadData() {
  loading.value = true;
  try {
    const [mantenimientosData, pistasData] = await Promise.all([
      api.getMantenimientos(),
      api.getPistas()
    ]);
    mantenimientos.value = mantenimientosData.mantenimientos || [];
    pistas.value = pistasData.pistas || [];
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    loading.value = false;
  }
}

function openCreateModal() {
  selectedMantenimiento.value = null;
  showModal.value = true;
}

async function handleView(mantenimiento) {
  try {
    const fullMantenimiento = await api.getMantenimiento(mantenimiento.publicIdMantenimiento);
    selectedMantenimiento.value = fullMantenimiento;
    showModal.value = true;
  } catch (error) {
    console.error('Error fetching mantenimiento details:', error);
    alert('Error al cargar el mantenimiento');
  }
}

async function handleSave(formData, publicId) {
  try {
    if (publicId) {
      await api.updateMantenimiento(publicId, formData);
    } else {
      await api.createMantenimiento(formData);
    }
    showModal.value = false;
    await loadData();
  } catch (error) {
    console.error('Error saving mantenimiento:', error);
    alert('Error al guardar el mantenimiento');
  }
}

onMounted(loadData);
</script>

<template>
  <div>
    <header class="page-header">
      <div class="header-content">
        <div>
          <h1 class="page-title">Mantenimientos</h1>
          <p class="page-subtitle">Gestión de mantenimientos de pistas</p>
        </div>
        <button class="btn btn-primary" @click="openCreateModal">
          <span>🔧</span> Nuevo Mantenimiento
        </button>
      </div>
    </header>

    <DataTable 
      title="Listado de Mantenimientos" 
      :columns="columns" 
      :data="mantenimientos" 
      :loading="loading"
      :showActions="true"
      @edit="handleView"
    />

    <MantenimientoModal
      :show="showModal"
      :mantenimiento="selectedMantenimiento"
      :pistas="pistas"
      @close="showModal = false"
      @save="handleSave"
    />
  </div>
</template>
