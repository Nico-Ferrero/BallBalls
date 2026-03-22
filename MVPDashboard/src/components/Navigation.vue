<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Menu, X, Search, Globe, UserCircle } from 'lucide-vue-next';
import Button from './ui/Button.vue';

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);

const navLinks = [
  { name: 'Instalaciones', href: '#facilities' },
  { name: 'Partidos', href: '#matches' },
  { name: 'Reservar', href: '#booking' },
  { name: 'Tarifas', href: '#pricing' },
];

const emit = defineEmits(['login']);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="isScrolled ? 'bg-white py-4 shadow-sm border-b border-gray-100' : 'bg-transparent py-6'"
  >
    <div class="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
      <!-- Logo -->
      <a href="#" class="relative z-50 flex items-center gap-2">
        <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
          a
        </div>
        <span
          class="font-bold text-2xl tracking-tighter"
          :class="isScrolled ? 'text-primary' : 'text-primary md:text-white'"
        >
          arena
        </span>
      </a>

      <!-- Desktop Search Bar (Visible on Scroll) -->
      <div
        class="hidden md:flex items-center gap-2 px-4 py-2.5 bg-white rounded-full shadow-sm border border-gray-200 transition-all duration-300"
        :class="isScrolled ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none absolute left-1/2 -translate-x-1/2'"
      >
        <button class="text-sm font-medium px-4 border-r border-gray-200">
          Cualquier pista
        </button>
        <button class="text-sm font-medium px-4 border-r border-gray-200">
          Cualquier semana
        </button>
        <button class="text-sm text-gray-500 px-4 flex items-center gap-3">
          ¿Cuántos?
          <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
            <Search :size="14" :strokeWidth="3" />
          </div>
        </button>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-2">
        <a
          v-for="link in navLinks"
          :key="link.name"
          :href="link.href"
          class="text-sm font-medium px-4 py-2.5 rounded-full transition-colors"
          :class="isScrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/10'"
        >
          {{ link.name }}
        </a>

        <div class="flex items-center gap-2 ml-2">
          <button
            class="p-3 rounded-full hover:bg-gray-100/10 transition-colors"
            :class="isScrolled ? 'text-gray-800' : 'text-white'"
          >
            <Globe :size="18" />
          </button>
          <button 
            @click="$emit('login')"
            class="flex items-center gap-2 p-1 pl-3 pr-1 bg-white border border-gray-200 rounded-full hover:shadow-md transition-shadow"
          >
            <Menu :size="16" class="text-gray-600" />
            <UserCircle :size="30" class="text-gray-500 fill-gray-200" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu Button -->
      <button
        class="md:hidden relative z-50 p-2 rounded-full"
        :class="isScrolled ? 'text-gray-800 bg-gray-100' : 'text-white bg-black/20'"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <component :is="isMobileMenuOpen ? X : Menu" :size="24" />
      </button>

      <!-- Mobile Menu Overlay -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-full"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-full"
      >
        <div
          v-if="isMobileMenuOpen"
          class="fixed inset-0 bg-white z-40 flex flex-col pt-24 px-6 md:hidden"
        >
          <div class="space-y-6">
            <a
              v-for="link in navLinks"
              :key="link.name"
              :href="link.href"
              @click="isMobileMenuOpen = false"
              class="block text-2xl font-semibold text-gray-800 hover:text-primary transition-colors"
            >
              {{ link.name }}
            </a>
          </div>
          <div class="mt-auto mb-10">
            <Button variant="primary" size="lg" class="w-full" @click="$emit('login')">
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </Transition>
    </div>
  </nav>
</template>
