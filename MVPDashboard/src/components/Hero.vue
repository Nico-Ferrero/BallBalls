<script setup>
import { Search } from 'lucide-vue-next';
</script>

<template>
  <section class="relative min-h-[85vh] w-full flex flex-col justify-center pt-20">
    <!-- Background Image -->
    <div class="absolute inset-0 z-0">
      <img
        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop"
        alt="Sports Complex"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent"></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
      <div class="max-w-2xl text-white mb-12 animate-fade-in-up">
        <h1 class="font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight mb-6 drop-shadow-lg">
          ¿Listo para <br />
          <span class="text-primary-light">jugar?</span>
        </h1>
        <p class="text-xl md:text-2xl font-medium drop-shadow-md max-w-lg">
          Encuentra partidos, reserva pistas y conecta con deportistas cerca de ti.
        </p>
      </div>

      <!-- Search Widget -->
      <div class="bg-white rounded-full p-2 pr-3 shadow-card max-w-4xl flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-gray-200 animate-fade-in-up delay-200">
        <div class="flex-1 px-6 py-3 hover:bg-gray-100 rounded-full cursor-pointer transition-colors w-full md:w-auto">
          <div class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-0.5">
            Deporte
          </div>
          <div class="text-gray-500 text-sm truncate">
            ¿Qué quieres jugar?
          </div>
        </div>

        <div class="flex-1 px-6 py-3 hover:bg-gray-100 rounded-full cursor-pointer transition-colors w-full md:w-auto">
          <div class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-0.5">
            Fecha
          </div>
          <div class="text-gray-500 text-sm truncate">Añadir fechas</div>
        </div>

        <div class="flex-1 px-6 py-3 hover:bg-gray-100 rounded-full cursor-pointer transition-colors w-full md:w-auto">
          <div class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-0.5">
            Jugadores
          </div>
          <div class="text-gray-500 text-sm truncate">¿Cuántos sois?</div>
        </div>

        <div class="pl-2 w-full md:w-auto mt-2 md:mt-0">
          <button class="w-full md:w-auto bg-primary hover:bg-primary-hover text-white rounded-full p-4 md:px-8 md:py-4 flex items-center justify-center gap-2 font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105">
            <Search :size="20" :strokeWidth="3" />
            <span class="md:hidden">Buscar</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.delay-200 {
  animation-delay: 0.2s;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
