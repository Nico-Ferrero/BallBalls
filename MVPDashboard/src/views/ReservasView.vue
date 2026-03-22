<script setup>
import { ref, onMounted, computed } from 'vue';
import DataTable from '../components/DataTable.vue';
import ReservaModal from '../components/ReservaModal.vue';
import api from '../api/api.js';

import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

const loading = ref(true);
const reservas = ref([]);
const pistas = ref([]);
const showModal = ref(false);
const selectedReserva = ref(null);
const viewMode = ref('calendar'); // 'list' or 'calendar'

const columns = [
  { key: 'publicId', label: 'ID' },
  { key: 'pista', label: 'Pista' },
  { key: 'fechaHoraInicio', label: 'Inicio', render: (row) => formatDate(row.fechaHoraInicio) },
  { key: 'fechaHoraFin', label: 'Fin', render: (row) => formatDate(row.fechaHoraFin) },
  { key: 'estado', label: 'Estado', badge: (row) => row.estado === 'Confirmada' ? 'success' : 'warning' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'usuario', label: 'Usuario' }, // Added Usuario column
  { key: 'precioTotal', label: 'Precio', render: (row) => `€${row.precioTotal}` }
];

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
  },
  buttonText: {
    today: 'today',
    month: 'month',
    week: 'week',
    day: 'day',
    list: 'list'
  },
  events: calendarEvents.value,
  editable: false, // Drag & drop disabled as requested
  selectable: true, // Selection enabled for creation
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  select: handleSelect, // Callback for selection
  eventClick: handleEventClick
}));

const calendarEvents = computed(() => {
  return reservas.value.map(r => {
    // Backend sends "yyyy-MM-dd HH:mm:ss", ensure ISO format for calendar
    const start = r.fechaHoraInicio ? r.fechaHoraInicio.replace(' ', 'T') : null;
    const end = r.fechaHoraFin ? r.fechaHoraFin.replace(' ', 'T') : null;
    
    // Display Pista + User in title
    const title = `${r.pista} - ${r.usuario || 'Anónimo'}`;

    return {
      id: r.publicId,
      title: title,
      start: start,
      end: end,
      backgroundColor: getEventColor(r.estado),
      borderColor: getEventColor(r.estado),
      extendedProps: { ...r }
    };
  });
});

function getEventColor(estado) {
    if (estado === 'Confirmada') return '#28a745';
    if (estado === 'Pendiente') return '#ffc107';
    if (estado === 'Cancelada') return '#dc3545';
    return '#3788d8';
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
}

async function loadData() {
  loading.value = true;
  try {
    const [reservasData, pistasData] = await Promise.all([
      api.getReservas(),
      api.getPistas()
    ]);
    reservas.value = reservasData.reservas || [];
    pistas.value = pistasData.pistas || [];
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    loading.value = false;
  }
}

function openCreateModal(initialData = null) {
  if (initialData) {
      selectedReserva.value = initialData;
  } else {
      selectedReserva.value = null;
  }
  showModal.value = true;
}

function handleSelect(selectInfo) {
    // selectInfo.startStr and endStr are ISO strings
    // We need to format them for our backend/modal usage if necessary, 
    // or just pass them as initial values.
    // The Modal expects "yyyy-MM-dd HH:mm:ss" approximately for inputs? 
    // Let's check format. The date inputs in modal likely use "datetime-local" or similar.
    // FullCalendar gives ISO.
    
    // Let's create a partial reserva object
    const initialData = {
        publicId: null, // New
        fechaHoraInicio: selectInfo.startStr.replace('T', ' ').substring(0, 19),
        fechaHoraFin: selectInfo.endStr.replace('T', ' ').substring(0, 19),
        pista: pistas.value.length > 0 ? pistas.value[0].slug : '', // Default to first pista or empty
        estado: 'Confirmada'
    };
    
    openCreateModal(initialData);
}

async function handleEventClick(clickInfo) {
    const publicId = clickInfo.event.id;
    await handleEdit({ publicId }); // Pass object with ID to trigger fetch
}

async function handleEdit(reservaPartial) {
  try {
      // Fetch full details by publicId as requested
      const fullReserva = await api.getReserva(reservaPartial.publicId);
      selectedReserva.value = fullReserva;
      showModal.value = true;
  } catch (error) {
      console.error('Error fetching reserva details:', error);
      alert('Error al cargar la reserva');
  }
}

async function handleDelete(reserva) {
  if (!confirm(`¿Estás seguro de eliminar esta reserva?`)) return;
  
  try {
    await api.deleteReserva(reserva.publicId);
    await loadData();
  } catch (error) {
    console.error('Error deleting reserva:', error);
    alert('Error al eliminar la reserva');
  }
}

async function handleSave(formData, id) {
  try {
    if (id) {
      await api.updateReserva(id, formData);
    } else {
      await api.createReserva(formData);
    }
    showModal.value = false;
    await loadData();
  } catch (error) {
    console.error('Error saving reserva:', error);
    alert('Error al guardar la reserva');
  }
}

onMounted(loadData);
</script>

<template>
  <div>
    <header class="page-header">
      <div class="header-content">
        <div>
          <h1 class="page-title">Reservas</h1>
          <p class="page-subtitle">Gestión de reservas de pistas deportivas</p>
        </div>
        <div class="actions">
             <div class="btn-group">
                <button 
                    class="btn" 
                    :class="viewMode === 'calendar' ? 'btn-primary' : 'btn-secondary'"
                    @click="viewMode = 'calendar'"
                >📅 Calendario</button>
                <button 
                    class="btn" 
                    :class="viewMode === 'list' ? 'btn-primary' : 'btn-secondary'"
                    @click="viewMode = 'list'"
                >📄 Lista</button>
            </div>
            <button class="btn btn-primary" @click="openCreateModal()">
            <span>➕</span> Nueva Reserva
            </button>
        </div>
      </div>
    </header>

    <div v-if="viewMode === 'list'">
        <DataTable 
        title="Listado de Reservas" 
        :columns="columns" 
        :data="reservas" 
        :loading="loading"
        :showActions="true"
        @edit="handleEdit"
        @delete="handleDelete"
        />
    </div>

    <div v-else class="calendar-container card">
        <FullCalendar :options="calendarOptions" />
    </div>

    <ReservaModal
      :show="showModal"
      :reserva="selectedReserva"
      :pistas="pistas"
      @close="showModal = false"
      @save="handleSave"
    />
  </div>
</template>

<style scoped>
.actions {
    display: flex;
    gap: 1rem;
    align-items: center;
}
.btn-group {
    display: flex;
    gap: 0.5rem;
}
.calendar-container {
    padding: 2rem;
    background: white;
    min-height: 700px;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* FullCalendar Custom Overrides to match the dark button look */
:deep(.fc-button-primary) {
    background-color: #2c3e50 !important;
    border-color: #2c3e50 !important;
    text-transform: capitalize; 
}

:deep(.fc-button-primary:hover) {
    background-color: #1a252f !important;
    border-color: #1a252f !important;
}

:deep(.fc-button-primary:not(:disabled).fc-button-active), 
:deep(.fc-button-primary:not(:disabled):active) {
    background-color: #1a252f !important;
    border-color: #1a252f !important;
    box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
}

:deep(.fc-toolbar-title) {
    font-size: 1.5rem !important;
    font-weight: 300;
}
</style>
