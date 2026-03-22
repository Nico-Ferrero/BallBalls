<script setup>
import { ref, computed } from 'vue';
import { Users, Trophy, Star } from 'lucide-vue-next';
import Button from './ui/Button.vue';

const sports = ['Todos', 'Pádel', 'Tenis', 'Fútbol', 'Basket'];

const matches = [
  {
    id: 1,
    sport: 'Pádel',
    level: 'Intermedio',
    time: 'Hoy, 20:00',
    players: 3,
    maxPlayers: 4,
    price: '4.50€',
    location: 'Pista 3',
    host: 'Alex M.',
    image: 'https://images.unsplash.com/photo-1622163642998-1ea36b1dde3b?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    sport: 'Fútbol',
    level: 'Abierto',
    time: 'Mañana, 19:00',
    players: 8,
    maxPlayers: 14,
    price: '3.00€',
    location: 'Campo 1',
    host: 'Club Arena',
    image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    sport: 'Tenis',
    level: 'Avanzado',
    time: 'Mañana, 10:00',
    players: 1,
    maxPlayers: 2,
    price: '6.00€',
    location: 'Pista Central',
    host: 'Sarah J.',
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 4,
    sport: 'Pádel',
    level: 'Principiante',
    time: 'Sábado, 11:00',
    players: 2,
    maxPlayers: 4,
    price: '4.50€',
    location: 'Pista 5',
    host: 'Marc R.',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800&auto=format&fit=crop',
  },
];

const activeFilter = ref('Todos');

const filteredMatches = computed(() => {
  return activeFilter.value === 'Todos'
    ? matches
    : matches.filter((m) => m.sport === activeFilter.value);
});
</script>

<template>
  <section id="matches" class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
      <div class="mb-10">
        <h2 class="font-bold text-3xl md:text-4xl text-gray-800 mb-6">
          Partidos cerca de ti
        </h2>

        <!-- Filters -->
        <div class="flex flex-wrap gap-3">
          <button
            v-for="sport in sports"
            :key="sport"
            @click="activeFilter = sport"
            class="px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border cursor-pointer"
            :class="activeFilter === sport ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-600 hover:border-gray-900 border-gray-200'"
          >
            {{ sport }}
          </button>
        </div>
      </div>

      <TransitionGroup
        name="list"
        tag="div"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div
          v-for="match in filteredMatches"
          :key="match.id"
          class="group cursor-pointer bg-white rounded-2xl p-0 h-full flex flex-col"
        >
          <!-- MatchCard Content moved inline for simplicity -->
          <div class="relative aspect-[3/4] mb-4 overflow-hidden rounded-2xl bg-gray-200">
            <img
              :src="match.image"
              :alt="match.sport"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-gray-800 uppercase tracking-wide">
              {{ match.time }}
            </div>
             <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <div class="flex items-center gap-2 text-white mb-1">
                <Trophy :size="14" class="text-primary" />
                <span class="text-sm font-medium">{{ match.level }}</span>
              </div>
              <div class="flex items-center justify-between text-white">
                <span class="text-sm font-medium">Host: {{ match.host }}</span>
                <div class="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full">
                  <Star :size="12" class="fill-white text-white" />
                  <span class="text-xs font-bold">5.0</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between items-start mb-2 px-1">
            <h3 class="font-semibold text-gray-800 text-lg">
              {{ match.location }}
            </h3>
            <span class="font-bold text-gray-800">{{ match.price }}</span>
          </div>

          <div class="flex items-center gap-3 mb-4 px-1">
            <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full"
                :class="(match.maxPlayers - match.players === 1) ? 'bg-amber-500' : 'bg-primary'"
                :style="{ width: `${(match.players / match.maxPlayers) * 100}%` }"
              ></div>
            </div>
            <span class="text-xs font-medium text-gray-500 whitespace-nowrap">
              {{ match.players }}/{{ match.maxPlayers }} plazas
            </span>
          </div>

          <div class="mt-auto px-1 pb-1">
             <Button variant="primary" size="sm" class="w-full rounded-xl">
              Unirse
            </Button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </section>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.list-leave-active {
  position: absolute;
}
</style>
