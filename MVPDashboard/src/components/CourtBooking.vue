<script setup>
import { ref, computed } from 'vue';
import Button from './ui/Button.vue';

const sports = [
  { id: 'padel', name: 'Pádel', icon: '🎾' },
  { id: 'tennis', name: 'Tenis', icon: '🎾' },
  { id: 'football', name: 'Fútbol', icon: '⚽' },
  { id: 'basket', name: 'Basket', icon: '🏀' },
];

const timeSlots = [
  '09:00', '10:30', '12:00', '13:30', '15:00', 
  '16:30', '18:00', '19:30', '21:00',
];

const selectedSport = ref(sports[0].id);
const selectedDateIndex = ref(0);
const selectedTime = ref(null);

const dates = computed(() => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      day: d.toLocaleDateString('es-ES', { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString('es-ES', { month: 'short' }),
    };
  });
});

const selectedSportObj = computed(() => sports.find((s) => s.id === selectedSport.value));
</script>

<template>
  <section id="booking" class="py-24 bg-white border-t border-gray-100">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        <!-- Left Column: Interactive Selector -->
        <div class="lg:col-span-7 space-y-12">
          <div>
            <h2 class="font-bold text-3xl md:text-4xl text-gray-800 mb-6">
              Reserva tu pista
            </h2>
            <p class="text-gray-500 text-lg mb-8">
              Selecciona deporte, fecha y hora en 3 simples pasos.
            </p>
          </div>

          <!-- Sport Selector -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs">
                1
              </span>
              Elige deporte
            </h3>
            <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              <button
                v-for="sport in sports"
                :key="sport.id"
                @click="selectedSport = sport.id"
                class="flex-shrink-0 px-6 py-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-2 min-w-[120px]"
                :class="selectedSport === sport.id ? 'border-primary bg-primary-light' : 'border-gray-100 hover:border-gray-300'"
              >
                <span class="text-3xl">{{ sport.icon }}</span>
                <span class="font-semibold text-gray-800">
                  {{ sport.name }}
                </span>
              </button>
            </div>
          </div>

          <!-- Date Selector -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs">
                2
              </span>
              Elige fecha
            </h3>
            <div class="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              <button
                v-for="(date, index) in dates"
                :key="index"
                @click="selectedDateIndex = index"
                class="flex-shrink-0 w-20 h-24 rounded-2xl border flex flex-col items-center justify-center transition-all duration-200 cursor-pointer"
                :class="selectedDateIndex === index ? 'bg-gray-800 text-white border-gray-800 shadow-lg transform scale-105' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-800'"
              >
                <span class="text-xs font-medium uppercase mb-1 opacity-80">
                  {{ date.day }}
                </span>
                <span class="text-2xl font-bold mb-1">{{ date.date }}</span>
                <span class="text-xs opacity-60">{{ date.month }}</span>
              </button>
            </div>
          </div>

          <!-- Time Selector -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs">
                3
              </span>
              Elige hora
            </h3>
            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              <button
                v-for="time in timeSlots"
                :key="time"
                @click="selectedTime = time"
                class="py-2.5 px-2 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer"
                :class="selectedTime === time ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-800'"
              >
                {{ time }}
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column: Summary Card -->
        <div class="lg:col-span-5">
          <div class="sticky top-32 bg-white rounded-3xl border border-gray-200 shadow-card p-8">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="text-2xl font-bold text-gray-800 mb-1">
                  {{ selectedTime ? '12.00€' : '0.00€' }}
                  <span class="text-base font-normal text-gray-500">
                    / hora
                  </span>
                </h3>
                <div class="flex items-center gap-1 text-sm font-medium text-gray-800 underline decoration-gray-300">
                  <span class="text-gray-500 no-underline">Reseñas</span>
                  <span class="font-bold">4.95</span>
                  <span class="text-gray-400">(128)</span>
                </div>
              </div>
            </div>

            <div class="border border-gray-200 rounded-2xl overflow-hidden mb-6">
              <div class="flex border-b border-gray-200">
                <div class="flex-1 p-3 border-r border-gray-200">
                  <div class="text-[10px] font-bold uppercase text-gray-800">
                    FECHA
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ dates[selectedDateIndex].day }}, {{ dates[selectedDateIndex].date }}
                    {{ dates[selectedDateIndex].month }}
                  </div>
                </div>
                <div class="flex-1 p-3">
                  <div class="text-[10px] font-bold uppercase text-gray-800">
                    HORA
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ selectedTime || 'Seleccionar' }}
                  </div>
                </div>
              </div>
              <div class="p-3">
                <div class="text-[10px] font-bold uppercase text-gray-800">
                  DEPORTE
                </div>
                <div class="text-sm text-gray-600 capitalize">
                  {{ selectedSportObj?.name }}
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              class="w-full mb-4"
              :disabled="!selectedTime"
            >
              Reservar
            </Button>

            <p class="text-center text-xs text-gray-500">
              No se te cobrará nada todavía
            </p>

            <div class="mt-6 pt-6 border-t border-gray-100 space-y-3">
              <div class="flex justify-between text-gray-600">
                <span class="underline decoration-gray-300">
                  Pista x 1 hora
                </span>
                <span>12.00€</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span class="underline decoration-gray-300">
                  Tarifa de servicio
                </span>
                <span>1.50€</span>
              </div>
              <div class="flex justify-between font-bold text-gray-800 pt-3 border-t border-gray-100">
                <span>Total</span>
                <span>13.50€</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
