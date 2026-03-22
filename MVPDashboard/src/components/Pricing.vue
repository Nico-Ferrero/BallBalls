<script setup>
import { Check } from 'lucide-vue-next';
import Button from './ui/Button.vue';

const rentals = [
  {
    sport: 'Pádel',
    price: '12€',
    unit: '/hora',
    details: ['Pista Panorámica', 'Luz LED incluida', '4 Jugadores máx'],
  },
  {
    sport: 'Tenis',
    price: '15€',
    unit: '/hora',
    details: ['Tierra Batida', 'Luz LED incluida', '2-4 Jugadores'],
  },
  {
    sport: 'Fútbol 7',
    price: '45€',
    unit: '/hora',
    details: ['Césped FIFA Pro', 'Vestuarios incluidos', '14 Jugadores máx'],
  },
];
</script>

<template>
  <section id="pricing" class="py-24 bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="font-bold text-3xl md:text-4xl text-gray-800 mb-4">
          Tarifas simples y claras
        </h2>
        <p class="text-gray-500 text-lg">
          Sin costes ocultos. Paga solo por lo que juegas.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="(item, index) in rentals" 
          :key="item.sport"
          class="bg-white p-8 rounded-3xl border border-gray-200 hover:shadow-card transition-all duration-300 flex flex-col animate-fade-in-up"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <h3 class="font-bold text-xl text-gray-800 mb-4">
            {{ item.sport }}
          </h3>
          <div class="flex items-baseline gap-1 mb-6">
            <span class="text-4xl font-bold text-gray-800">
              {{ item.price }}
            </span>
            <span class="text-gray-500">{{ item.unit }}</span>
          </div>
          <div class="h-px w-full bg-gray-100 mb-6"></div>
          <ul class="space-y-4 mb-8 flex-1">
            <li v-for="(detail, i) in item.details" :key="i" class="text-gray-600 flex items-center gap-3">
              <Check class="w-5 h-5 text-primary" />
              {{ detail }}
            </li>
          </ul>
          <Button
            variant="outline"
            class="w-full rounded-xl border-gray-800 hover:bg-gray-50"
          >
            Reservar
          </Button>
        </div>
      </div>

      <!-- Membership Banner -->
      <div class="mt-16 bg-gray-900 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div class="max-w-xl">
          <h3 class="text-2xl md:text-3xl font-bold mb-4">
            Hazte Socio Club
          </h3>
          <p class="text-gray-300 text-lg mb-6">
            Por solo 39€/mes disfruta de prioridad en reservas, descuentos exclusivos y acceso gratuito al gimnasio.
          </p>
          <div class="flex flex-wrap gap-4">
            <div class="flex items-center gap-2 text-sm font-medium bg-white/10 px-3 py-1 rounded-full">
              <Check :size="14" class="text-primary" /> Prioridad 7 días
            </div>
            <div class="flex items-center gap-2 text-sm font-medium bg-white/10 px-3 py-1 rounded-full">
              <Check :size="14" class="text-primary" /> -20% en pistas
            </div>
          </div>
        </div>
        <Button
          variant="white"
          size="lg"
          class="whitespace-nowrap rounded-xl"
        >
          Ver ventajas
        </Button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
