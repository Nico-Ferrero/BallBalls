<script setup>
defineProps({
  pista: {
    type: Object,
    required: true
  }
});

defineEmits(['edit', 'delete']);
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <!-- Image Header -->
    <div class="h-48 overflow-hidden bg-gray-200 relative">
      <img 
        v-if="pista.imagen" 
        :src="pista.imagen" 
        :alt="pista.nombre"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
        <span class="text-4xl">🏟️</span>
      </div>
      
      <!-- Status Badge -->
      <div class="absolute top-2 right-2">
        <span 
          :class="[
            'px-2 py-1 text-xs font-semibold rounded-full',
            pista.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          ]"
        >
          {{ pista.isActive ? 'Activo' : 'Inactivo' }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-xl font-bold text-gray-900 truncate" :title="pista.nombre">
          {{ pista.nombre }}
        </h3>
        <span class="text-lg font-bold text-primary-600">
          {{ pista.precio }}€<span class="text-sm text-gray-500 font-normal">/h</span>
        </span>
      </div>

      <p class="text-gray-600 text-sm mb-4 line-clamp-2" :title="pista.descripcion">
        {{ pista.descripcion }}
      </p>

      <!-- Sports Tags -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span 
          v-for="deporte in pista.deportes" 
          :key="deporte"
          class="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md"
        >
          {{ deporte }}
        </span>
      </div>

      <!-- Actions -->
      <div class="border-t pt-4 flex justify-between items-center mt-auto">
        <button 
          @click="$emit('edit', pista)"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
        >
          ✏️ Editar
        </button>
        <button 
          @click="$emit('delete', pista)"
          class="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  </div>
</template>
