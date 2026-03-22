<script setup>
const props = defineProps({
  title: { type: String, required: true },
  columns: { type: Array, required: true },
  data: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  showActions: { type: Boolean, default: false }
});

const emit = defineEmits(['edit', 'delete']);

function getCellValue(row, col) {
  if (col.render) {
    return col.render(row);
  }
  return row[col.key] ?? '-';
}
</script>

<template>
  <div class="table-container">
    <div class="table-header">
      <h3 class="table-title">{{ title }}</h3>
      <span class="badge badge-success" v-if="!loading">{{ data.length }} registros</span>
    </div>
    
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <span>Cargando datos...</span>
    </div>
    
    <div v-else-if="data.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <p>No hay datos disponibles</p>
    </div>
    
    <div v-else class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
            <th v-if="showActions" class="actions-header">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in data" :key="index">
            <td v-for="col in columns" :key="col.key">
              <span v-if="col.badge" :class="['badge', `badge-${col.badge(row)}`]">
                {{ getCellValue(row, col) }}
              </span>
              <span v-else>{{ getCellValue(row, col) }}</span>
            </td>
            <td v-if="showActions" class="actions-cell">
              <button class="btn-action btn-edit" @click="emit('edit', row)" title="Editar">✏️</button>
              <button class="btn-action btn-delete" @click="emit('delete', row)" title="Eliminar">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

