<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  show: { type: Boolean, default: false },
  deporte: { type: Object, default: null }
});

const emit = defineEmits(['close', 'save']);

const form = ref({
  nombre: '',
  descripcion: '',
  isActive: true
});

const isEdit = computed(() => !!props.deporte);

watch(() => props.show, (newVal) => {
  if (newVal) {
    if (props.deporte) {
      form.value = {
        nombre: props.deporte.nombre || '',
        descripcion: props.deporte.descripcion || '',
        isActive: props.deporte.isActive ?? true
      };
    } else {
      form.value = {
        nombre: '',
        descripcion: '',
        isActive: true
      };
    }
  }
});

function handleSubmit() {
  emit('save', { ...form.value }, props.deporte?.slug);
}

function handleClose() {
  emit('close');
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="handleClose">
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">{{ isEdit ? 'Editar Deporte' : 'Nuevo Deporte' }}</h2>
        <button class="modal-close" @click="handleClose">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input id="nombre" v-model="form.nombre" type="text" required placeholder="Nombre del deporte" />
        </div>

        <div class="form-group">
          <label for="descripcion">Descripción</label>
          <textarea id="descripcion" v-model="form.descripcion" rows="3" placeholder="Descripción..."></textarea>
        </div>

        <div class="form-group checkbox-single">
          <label>
            <input type="checkbox" v-model="form.isActive" />
            <span>Activo</span>
          </label>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="handleClose">Cancelar</button>
          <button type="submit" class="btn btn-primary">{{ isEdit ? 'Guardar Cambios' : 'Crear Deporte' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>
