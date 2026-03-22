<script setup>
import { ref, onMounted } from 'vue';
import DataTable from '../components/DataTable.vue';
import DeporteModal from '../components/DeporteModal.vue';
import api from '../api/api.js';

const loading = ref(true);
const deportes = ref([]);
const showModal = ref(false);
const selectedDeporte = ref(null);

const columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'slug', label: 'Slug' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'isActive', label: 'Activo', badge: (row) => row.isActive ? 'success' : 'danger', render: (row) => row.isActive ? 'Sí' : 'No' }
];

async function loadData() {
  loading.value = true;
  try {
    const data = await api.getDeportes();
    deportes.value = data.deportes || [];
  } catch (error) {
    console.error('Error loading deportes:', error);
  } finally {
    loading.value = false;
  }
}

function openCreateModal() {
  selectedDeporte.value = null;
  showModal.value = true;
}

function handleEdit(deporte) {
  selectedDeporte.value = deporte;
  showModal.value = true;
}

async function handleDelete(deporte) {
  if (!confirm(`¿Estás seguro de eliminar el deporte "${deporte.nombre}"?`)) return;
  
  try {
    await api.deleteDeporte(deporte.slug);
    await loadData();
  } catch (error) {
    console.error('Error deleting deporte:', error);
    alert('Error al eliminar el deporte');
  }
}

async function handleSave(formData, slug) {
  try {
    if (slug) {
      const payload = { ...formData, slug };
      await api.updateDeporte(slug, payload);
    } else {
      await api.createDeporte(formData);
    }
    showModal.value = false;
    await loadData();
  } catch (error) {
    console.error('Error saving deporte:', error);
    alert('Error al guardar el deporte');
  }
}

onMounted(loadData);
</script>

<template>
  <div>
    <header class="page-header">
      <div class="header-content">
        <div>
          <h1 class="page-title">Deportes</h1>
          <p class="page-subtitle">Catálogo de deportes disponibles</p>
        </div>
        <button class="btn btn-primary" @click="openCreateModal">
          <span>➕</span> Nuevo Deporte
        </button>
      </div>
    </header>

    <DataTable 
      title="Listado de Deportes" 
      :columns="columns" 
      :data="deportes" 
      :loading="loading"
      :showActions="true"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <DeporteModal
      :show="showModal"
      :deporte="selectedDeporte"
      @close="showModal = false"
      @save="handleSave"
    />
  </div>
</template>

