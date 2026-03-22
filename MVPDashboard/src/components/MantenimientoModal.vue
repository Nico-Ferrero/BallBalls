<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  show: { type: Boolean, default: false },
  mantenimiento: { type: Object, default: null },
  pistas: { type: Array, default: () => [] }
});

const emit = defineEmits(['close', 'save']);

const form = ref({
  slugPista: '',
  fechaMantenimiento: '',
  horaInicioMantenimiento: '',
  horaFinMantenimiento: '',
  descripcionMantenimiento: ''
});

const isEdit = computed(() => !!props.mantenimiento?.publicIdMantenimiento);

watch(() => props.show, (newVal) => {
  if (newVal) {
    if (props.mantenimiento) {
      // Parse dates from response format which uses fechaInicioMantenimiento
      const dateSource = props.mantenimiento.fechaInicioMantenimiento || props.mantenimiento.fechaMantenimiento;
      const fecha = dateSource ? dateSource.split('T')[0] : '';

      form.value = {
        slugPista: props.mantenimiento.pistaSlug || props.mantenimiento.slugPista || props.mantenimiento.publicIdPista || '',
        fechaMantenimiento: fecha,
        horaInicioMantenimiento: props.mantenimiento.horaInicioMantenimiento || '',
        horaFinMantenimiento: props.mantenimiento.horaFinMantenimiento || '',
        descripcionMantenimiento: props.mantenimiento.descripcionMantenimiento || ''
      };
    } else {
      form.value = {
        slugPista: props.pistas.length > 0 ? props.pistas[0].slug : '',
        fechaMantenimiento: '',
        horaInicioMantenimiento: '',
        horaFinMantenimiento: '',
        descripcionMantenimiento: ''
      };
    }
  }
});

function handleSubmit() {
  // Transform to backend expected format - DateTime needs full ISO 8601 UTC format with Z suffix
  const payload = {
    slugPista: form.value.slugPista,
    fechaMantenimiento: `${form.value.fechaMantenimiento}T00:00:00Z`,
    horaInicioMantenimiento: form.value.horaInicioMantenimiento,
    horaFinMantenimiento: form.value.horaFinMantenimiento,
    descripcionMantenimiento: form.value.descripcionMantenimiento,
    isActive: true 
  };
  emit('save', payload, props.mantenimiento?.publicIdMantenimiento);
}

function handleClose() {
  emit('close');
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="handleClose">
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">{{ isEdit ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento' }}</h2>
        <button class="modal-close" @click="handleClose">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label for="pista">Pista</label>
          <select id="pista" v-model="form.slugPista" required>
            <option value="" disabled>Selecciona una pista</option>
            <option v-for="p in pistas" :key="p.slug" :value="p.slug">
              {{ p.nombre }}
            </option>
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="fechaMantenimiento">Fecha</label>
            <input id="fechaMantenimiento" v-model="form.fechaMantenimiento" type="date" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="horaInicio">Hora Inicio</label>
            <input id="horaInicio" v-model="form.horaInicioMantenimiento" type="time" required />
          </div>
          <div class="form-group">
            <label for="horaFin">Hora Fin</label>
            <input id="horaFin" v-model="form.horaFinMantenimiento" type="time" required />
          </div>
        </div>

        <div class="form-group">
          <label for="descripcion">Descripción</label>
          <textarea 
            id="descripcion" 
            v-model="form.descripcionMantenimiento" 
            rows="3" 
            placeholder="Descripción del mantenimiento..."
            required
          ></textarea>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="handleClose">Cancelar</button>
          <button type="submit" class="btn btn-primary">{{ isEdit ? 'Actualizar' : 'Crear' }} Mantenimiento</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
select:disabled,
input:disabled,
textarea:disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
