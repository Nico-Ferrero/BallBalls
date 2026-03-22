<script setup>
import Navigation from '../components/Navigation.vue';
import Hero from '../components/Hero.vue';
import Facilities from '../components/Facilities.vue';
import PublicMatches from '../components/PublicMatches.vue';
import CourtBooking from '../components/CourtBooking.vue';
import Pricing from '../components/Pricing.vue';
import Footer from '../components/Footer.vue';

const emit = defineEmits(['navigate']);

function handleNavigate(view) {
  emit('navigate', view);
}
</script>

<template>
  <div class="min-h-screen bg-white font-sans text-gray-800 selection:bg-teal-500/20 selection:text-teal-900">
    <!-- Pass navigate event listener to Navigation component if needed, 
         but for now Navigation is specialized for Landing. 
         Ideally, the 'Iniciar Sesión' would trigger navigate('dashboard') -->
    <Navigation @login="handleNavigate('dashboard')" />
    <main>
      <Hero />
      <Facilities />
      <PublicMatches />
      <CourtBooking />
      <Pricing />
    </main>
    <Footer />
  </div>
</template>
