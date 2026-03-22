<script setup>
import { Star, Heart } from 'lucide-vue-next';

const facilities = [
  {
    title: 'Pistas de Pádel Panorámicas',
    rating: '4.95',
    reviews: 128,
    type: 'Pádel',
    price: '12€',
    image: 'https://images.unsplash.com/photo-1622163642998-1ea36b1dde3b?q=80&w=2000&auto=format&fit=crop',
  },
  {
    title: 'Pistas de Tenis Clay',
    rating: '4.88',
    reviews: 84,
    type: 'Tenis',
    price: '15€',
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=2000&auto=format&fit=crop',
  },
  {
    title: 'Campo de Fútbol 7 Pro',
    rating: '4.92',
    reviews: 215,
    type: 'Fútbol',
    price: '45€',
    image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=2000&auto=format&fit=crop',
  },
  {
    title: 'Piscina Olímpica Indoor',
    rating: '4.98',
    reviews: 342,
    type: 'Natación',
    price: '8€',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=2000&auto=format&fit=crop',
  },
];
</script>

<template>
  <section id="facilities" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
      <div class="mb-10">
        <h2 class="font-bold text-3xl md:text-4xl text-gray-800 mb-2">
          Instalaciones destacadas
        </h2>
        <p class="text-gray-500 text-lg">
          Espacios de calidad profesional para tu mejor juego.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
        <div 
          v-for="(facility, index) in facilities" 
          :key="index"
          class="group cursor-pointer animate-fade-in-up"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="relative aspect-[20/19] mb-4 overflow-hidden rounded-2xl bg-gray-200">
            <img
              :src="facility.image"
              :alt="facility.title"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <button class="absolute top-3 right-3 p-2 rounded-full hover:bg-white/10 transition-colors">
              <Heart
                class="text-white hover:fill-white transition-colors"
                :size="24"
                :strokeWidth="2"
              />
            </button>
            <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-gray-800 uppercase tracking-wide">
              {{ facility.type }}
            </div>
          </div>

          <div class="flex justify-between items-start mb-1">
            <h3 class="font-semibold text-gray-800 text-base leading-tight truncate pr-2">
              {{ facility.title }}
            </h3>
            <div class="flex items-center gap-1 text-sm">
              <Star :size="14" class="fill-gray-800 text-gray-800" />
              <span class="font-medium">{{ facility.rating }}</span>
            </div>
          </div>

          <p class="text-gray-500 text-sm mb-2">Calidad profesional</p>

          <div class="flex items-baseline gap-1">
            <span class="font-bold text-gray-800 text-base">
              {{ facility.price }}
            </span>
            <span class="text-gray-800 text-sm">hora</span>
          </div>
        </div>
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
