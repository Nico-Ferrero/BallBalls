<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  show: { type: Boolean, default: false },
  reserva: { type: Object, default: null },
  pistas: { type: Array, default: () => [] }
});

const emit = defineEmits(['close', 'save']);

const form = ref({
  pista: '',
  fecha: '',
  horaInicio: '',
  horaFin: '',
  precioTotal: 0,
  estado: 'Confirmada',
  tipo: 'Individual',
  club: ''
});

const isEdit = computed(() => !!props.reserva && !!props.reserva.publicId);

watch(() => props.show, (newVal) => {
  if (newVal) {
    if (props.reserva) {
      // Backend returns combined "yyyy-MM-dd HH:mm:ss" strings in ReservaResponse
      // We need to split them for the form
      const startParts = splitDateTime(props.reserva.fechaHoraInicio);
      const endParts = splitDateTime(props.reserva.fechaHoraFin);

      form.value = {
        pista: props.reserva.pista || '',
        fecha: startParts.date || '', // Assuming start and end are same day
        horaInicio: startParts.time || '',
        horaFin: endParts.time || '',
        precioTotal: props.reserva.precioTotal || 0,
        estado: props.reserva.estado || 'Confirmada',
        tipo: props.reserva.tipo || 'Individual',
        club: props.reserva.club || ''
      };
    } else {
      form.value = {
        pista: '',
        fecha: '',
        horaInicio: '',
        horaFin: '',
        precioTotal: 0,
        estado: 'Confirmada',
        tipo: 'Individual',
        club: ''
      };
    }
  }
});

// Watch for changes to recalculate price
watch([() => form.value.pista, () => form.value.fecha, () => form.value.horaInicio, () => form.value.horaFin], () => {
    calculatePrice();
});

function splitDateTime(dateTimeStr) {
    if (!dateTimeStr) return { date: '', time: '' };
    // Expected format: "yyyy-MM-dd HH:mm:ss" or "yyyy-MM-dd HH:mm"
    const [date, timeWithSeconds] = dateTimeStr.split(' ');
    const time = timeWithSeconds ? timeWithSeconds.substring(0, 5) : ''; // Take HH:mm
    return { date, time };
}

function calculatePrice() {
    if (!form.value.pista || !form.value.fecha || !form.value.horaInicio || !form.value.horaFin) {
        return;
    }

    const selectedPista = props.pistas.find(p => p.slug === form.value.pista);
    if (!selectedPista) return;

    // Construct Date objects for calculation
    const start = new Date(`${form.value.fecha}T${form.value.horaInicio}`);
    const end = new Date(`${form.value.fecha}T${form.value.horaFin}`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

    const durationMs = end - start;
    if (durationMs > 0) {
        const durationHours = durationMs / (1000 * 60 * 60);
        form.value.precioTotal = (durationHours * selectedPista.precio).toFixed(2);
    } else {
        form.value.precioTotal = 0;
    }
}

function handleSubmit() {
  // Payload now matches CreateReservaRequest/UpdateReservaRequest: 
  // { Pista, Fecha, HoraInicio, HoraFin, Estado, Tipo, Club }
  // Case sensitive? Backend usually binds case-insensitive or camelCase to PascalCase. 
  // JS usually sends lowerCamelCase. Let's send what the form has.
  emit('save', { ...form.value }, props.reserva?.publicId);
}

function handleClose() {
  emit('close');
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="handleClose">
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">{{ isEdit ? 'Editar Reserva' : 'Nueva Reserva' }}</h2>
        <button class="modal-close" @click="handleClose">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label for="pista">Pista</label>
          <select id="pista" v-model="form.pista" required>
            <option value="" disabled>Selecciona una pista</option>
            <option v-for="p in pistas" :key="p.slug" :value="p.slug">{{ p.nombre }}</option>
          </select>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label for="fecha">Fecha</label>
                <input id="fecha" v-model="form.fecha" type="date" required />
            </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="horaInicio">Hora Inicio</label>
            <input id="horaInicio" v-model="form.horaInicio" type="time" required />
          </div>
          <div class="form-group">
            <label for="horaFin">Hora Fin</label>
            <input id="horaFin" v-model="form.horaFin" type="time" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="precio">Precio Total (€)</label>
            <input id="precio" v-model="form.precioTotal" type="number" step="0.01" min="0" readonly class="readonly-input" />
            <small class="help-text">Calculado automáticamente</small>
          </div>
          <div class="form-group">
            <label for="estado">Estado</label>
            <select id="estado" v-model="form.estado">
              <option value="Confirmada">Confirmada</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="tipo">Tipo</label>
            <select id="tipo" v-model="form.tipo">
              <option value="Individual">Individual</option>
              <option value="Grupo">Grupo</option>
              <option value="Torneo">Torneo</option>
            </select>
          </div>
          <div class="form-group">
            <label for="club">Club (opcional)</label>
            <input id="club" v-model="form.club" type="text" placeholder="Nombre del club" />
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="handleClose">Cancelar</button>
          <button type="submit" class="btn btn-primary">{{ isEdit ? 'Guardar Cambios' : 'Crear Reserva' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.readonly-input {
  background-color: #f0f0f0;
  cursor: not-allowed;
}
.help-text {
  font-size: 0.8em;
  color: #666;
  margin-top: 4px;
  display: block;
}
</style>
