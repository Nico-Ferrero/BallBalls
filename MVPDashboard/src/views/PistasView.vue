<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import PistaCard from '../components/PistaCard.vue';
import PistaModal from '../components/PistaModal.vue';
import api from '../api/api.js';

const loading = ref(true);
const pistas = ref([]);
const deportes = ref([]);
const showModal = ref(false);
const selectedPista = ref(null);

const pagination = ref({
  page: 1,
  pageSize: 6,
  totalItems: 0
});

const filters = ref({
  Nombre: '',
  Deporte: '',
  PrecioMin: '',
  PrecioMax: '',
  Disponibilidad: ''
});

const totalPages = computed(() => Math.ceil(pagination.value.totalItems / pagination.value.pageSize));

async function loadData() {
  loading.value = true;
  try {
    // Clean filters to remove empty strings
    const activeFilters = Object.fromEntries(
      Object.entries(filters.value).filter(([_, v]) => v !== '' && v !== null)
    );

    // Add pagination params
    activeFilters.PageNumber = pagination.value.page;
    activeFilters.PageSize = pagination.value.pageSize;

    const [pistasData, deportesData] = await Promise.all([
      api.getPistas(activeFilters),
      api.getDeportes()
    ]);
    
    // Check if response is PagedResultDto or array (handling both just in case)
    if (pistasData.items) {
      pistas.value = pistasData.items;
      pagination.value.totalItems = pistasData.totalCount;
      // Update local page if backend corrected it? Usually not needed unless out of bounds.
    } else {
      // Fallback if API returns just array (shouldn't happen with current backend)
      pistas.value = pistasData; 
    }

    deportes.value = deportesData.deportes || [];
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    loading.value = false;
  }
}

function applyFilters() {
  pagination.value.page = 1; // Reset to first page on filter change
  updateUrl();
  loadData();
}

function clearFilters() {
  filters.value = {
    Nombre: '',
    Deporte: '',
    PrecioMin: '',
    PrecioMax: '',
    Disponibilidad: ''
  };
  applyFilters();
}

function updateUrl() {
  const newUrl = new URL(window.location);
  Object.keys(filters.value).forEach(key => {
    if (filters.value[key]) {
      newUrl.searchParams.set(key, filters.value[key]);
    } else {
      newUrl.searchParams.delete(key);
    }
  });
  // Also sync pagination? usually filters yes, page maybe
  newUrl.searchParams.set('page', pagination.value.page);
  window.history.pushState({}, '', newUrl);
}

function changePage(newPage) {
  if (newPage < 1 || newPage > totalPages.value) return;
  pagination.value.page = newPage;
  updateUrl();
  loadData();
}

function openCreateModal() {
  selectedPista.value = null;
  showModal.value = true;
}

function handleEdit(pista) {
  selectedPista.value = pista;
  showModal.value = true;
}

async function handleDelete(pista) {
  if (!confirm(`¿Estás seguro de eliminar la pista "${pista.nombre}"?`)) return;
  
  try {
    await api.deletePista(pista.slug);
    await loadData();
  } catch (error) {
    console.error('Error deleting pista:', error);
    alert('Error al eliminar la pista');
  }
}

async function handleSave(formData, slug) {
  try {
    if (slug) {
      const payload = {
        Slug: slug,
        Nombre: formData.nombre,
        Descripcion: formData.descripcion,
        Imagen: formData.imagen,
        Precio: formData.precio,
        Deportes: formData.deportes,
        TipoPista: formData.idTipoPista,
        Estado: formData.idEstado,
        IsActive: formData.isActive
      };
      console.log('Updating Pista Payload:', payload);
      await api.updatePista(slug, payload);
    } else {
      await api.createPista(formData);
    }
    showModal.value = false;
    await loadData();
  } catch (error) {
    console.error('Error saving pista:', error);
    alert('Error al guardar la pista');
  }
}

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  filters.value.Nombre = params.get('Nombre') || '';
  filters.value.Deporte = params.get('Deporte') || '';
  filters.value.PrecioMin = params.get('PrecioMin') || '';
  filters.value.PrecioMax = params.get('PrecioMax') || '';
  filters.value.Disponibilidad = params.get('Disponibilidad') || '';
  
  const pageParam = parseInt(params.get('page'));
  if (pageParam && !isNaN(pageParam)) {
    pagination.value.page = pageParam;
  }
  
  loadData();
});
</script>

<template>
  <div>
    <header class="page-header">
      <div class="header-content">
        <div>
          <h1 class="page-title">Pistas</h1>
          <p class="page-subtitle">Gestión de pistas deportivas disponibles</p>
        </div>
        <button class="btn btn-primary" @click="openCreateModal">
          <span>➕</span> Nueva Pista
        </button>
      </div>
    </header>

    <!-- Filters Bar -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input v-model="filters.Nombre" type="text" class="form-input w-full" placeholder="Buscar..." @keyup.enter="applyFilters">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Deporte</label>
          <input v-model="filters.Deporte" type="text" class="form-input w-full" placeholder="Tenis..." @keyup.enter="applyFilters">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input v-model="filters.Disponibilidad" type="date" class="form-input w-full" @change="applyFilters">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
          <div class="flex gap-2">
            <input v-model="filters.PrecioMin" type="number" class="form-input w-full" placeholder="Min" @keyup.enter="applyFilters">
            <input v-model="filters.PrecioMax" type="number" class="form-input w-full" placeholder="Max" @keyup.enter="applyFilters">
          </div>
        </div>
        <div class="flex items-end gap-2">
          <button class="btn btn-secondary w-full" @click="applyFilters">
            🔍 Filtrar
          </button>
          <button class="btn btn-danger w-full bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-300" @click="clearFilters">
            🗑️ Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="pistas.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
      <p class="text-gray-500 text-lg">No se encontraron pistas que coincidan con los filtros.</p>
    </div>

    <!-- Grid Layout -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <PistaCard 
        v-for="pista in pistas" 
        :key="pista.slug" 
        :pista="pista"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1 && !loading" class="flex justify-center items-center gap-4 py-4 bg-white rounded-lg shadow">
      <button 
        class="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        :disabled="pagination.page === 1"
        @click="changePage(pagination.page - 1)"
      >
        Anterior
      </button>
      
      <span class="text-gray-600 font-medium">
        Página {{ pagination.page }} de {{ totalPages }}
      </span>
      
      <button 
        class="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        :disabled="pagination.page === totalPages"
        @click="changePage(pagination.page + 1)"
      >
        Siguiente
      </button>
    </div>

    <PistaModal
      :show="showModal"
      :pista="selectedPista"
      :deportes="deportes"
      @close="showModal = false"
      @save="handleSave"
    />
  </div>
</template>

