<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  show: { type: Boolean, default: false },
  pista: { type: Object, default: null },
  deportes: { type: Array, default: () => [] }
});

const emit = defineEmits(['close', 'save']);

const form = ref({
  nombre: '',
  descripcion: '',
  imagen: '',
  precio: 0,
  deportes: [],
  idTipoPista: 'interior',
  idClub: 'club-default',
  idEstado: 'disponible',
  isActive: true
});

const isEdit = computed(() => !!props.pista);

watch(() => props.show, (newVal) => {
  if (newVal) {
    if (props.pista) {
      form.value = {
        nombre: props.pista.nombre || '',
        descripcion: props.pista.descripcion || '',
        imagen: props.pista.imagen || '',
        precio: props.pista.precio || 0,
        deportes: props.pista.deportes || [],
        idTipoPista: props.pista.tipoPista || 'interior', // Map from Response
        idClub: 'club-default', // Club is not in Response
        idEstado: props.pista.estado || 'disponible', // Map from Response
        isActive: props.pista.isActive ?? true
      };
    } else {
      form.value = {
        nombre: '',
        descripcion: '',
        imagen: '',
        precio: 0,
        deportes: [],
        idTipoPista: 'interior',
        idClub: 'club-default',
        idEstado: 'disponible',
        isActive: true
      };
    }
  }
});

function toggleDeporte(deporte) {
  const idx = form.value.deportes.indexOf(deporte);
  if (idx === -1) {
    form.value.deportes.push(deporte);
  } else {
    form.value.deportes.splice(idx, 1);
  }
}

function handleSubmit() {
  emit('save', { ...form.value }, props.pista?.slug);
}

function handleClose() {
  emit('close');
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="handleClose">
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">{{ isEdit ? 'Editar Pista' : 'Nueva Pista' }}</h2>
        <button class="modal-close" @click="handleClose">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input id="nombre" v-model="form.nombre" type="text" required placeholder="Nombre de la pista" />
        </div>

        <div class="form-group">
          <label for="descripcion">Descripción</label>
          <textarea id="descripcion" v-model="form.descripcion" rows="3" placeholder="Descripción..."></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="precio">Precio/Hora (€)</label>
            <input id="precio" v-model.number="form.precio" type="number" step="0.01" min="0" required />
          </div>
          <div class="form-group">
            <label for="imagen">URL Imagen</label>
            <input id="imagen" v-model="form.imagen" type="text" placeholder="https://..." />
          </div>
        </div>

        <div class="form-group">
          <label>Deportes</label>
          <div class="checkbox-group">
            <label v-for="deporte in deportes" :key="deporte.slug" class="checkbox-item">
              <input 
                type="checkbox" 
                :checked="form.deportes.includes(deporte.nombre)"
                @change="toggleDeporte(deporte.nombre)"
              />
              <span>{{ deporte.nombre }}</span>
            </label>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="idTipoPista">Tipo de Pista</label>
            <select id="idTipoPista" v-model="form.idTipoPista">
              <option value="interior">Interior</option>
              <option value="exterior">Exterior</option>
              <option value="cubierta">Cubierta</option>
            </select>
          </div>
          <div class="form-group">
            <label for="idEstado">Estado</label>
            <select id="idEstado" v-model="form.idEstado">
              <option value="disponible">Disponible</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="reservada">Reservada</option>
            </select>
          </div>
        </div>

        <div class="form-group checkbox-single">
          <label>
            <input type="checkbox" v-model="form.isActive" />
            <span>Activa</span>
          </label>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="handleClose">Cancelar</button>
          <button type="submit" class="btn btn-primary">{{ isEdit ? 'Guardar Cambios' : 'Crear Pista' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>
