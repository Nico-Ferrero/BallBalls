<script setup>
import { Instagram, Twitter, Facebook, Globe } from 'lucide-vue-next';
</script>

<template>
  <footer id="footer" class="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div class="space-y-4">
          <h4 class="font-bold text-gray-800">Asistencia</h4>
          <ul class="space-y-3 text-sm text-gray-600">
            <li><a href="#" class="hover:underline">Centro de ayuda</a></li>
            <li><a href="#" class="hover:underline">AirCover para deportistas</a></li>
            <li><a href="#" class="hover:underline">Cancelaciones</a></li>
            <li><a href="#" class="hover:underline">Nuestra respuesta ante la COVID-19</a></li>
            <li><a href="#" class="hover:underline">Reportar un problema</a></li>
          </ul>
        </div>

        <div class="space-y-4">
          <h4 class="font-bold text-gray-800">Comunidad</h4>
          <ul class="space-y-3 text-sm text-gray-600">
            <li><a href="#" class="hover:underline">Arena.org: ayuda en desastres</a></li>
            <li><a href="#" class="hover:underline">Contra la discriminación</a></li>
          </ul>
        </div>

        <div class="space-y-4">
          <h4 class="font-bold text-gray-800">Ser anfitrión</h4>
          <ul class="space-y-3 text-sm text-gray-600">
            <li><a href="#" class="hover:underline">Organiza un partido</a></li>
            <li><a href="#" class="hover:underline">AirCover para anfitriones</a></li>
            <li><a href="#" class="hover:underline">Recursos para anfitriones</a></li>
            <li><a href="#" class="hover:underline">Foro de la comunidad</a></li>
          </ul>
        </div>

        <div class="space-y-4">
          <h4 class="font-bold text-gray-800">Arena</h4>
          <ul class="space-y-3 text-sm text-gray-600">
            <li><a href="#" class="hover:underline">Newsroom</a></li>
            <li><a href="#" class="hover:underline">Descubre las nuevas funciones</a></li>
            <li><a href="#" class="hover:underline">Carta de nuestros fundadores</a></li>
            <li><a href="#" class="hover:underline">Carreras</a></li>
            <li><a href="#" class="hover:underline">Inversores</a></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span>© 2024 Arena Club, Inc.</span>
          <span class="hidden md:inline">·</span>
          <a href="#" class="hover:underline">Privacidad</a>
          <span class="hidden md:inline">·</span>
          <a href="#" class="hover:underline">Términos</a>
          <span class="hidden md:inline">·</span>
          <a href="#" class="hover:underline">Mapa del sitio</a>
        </div>

        <div class="flex items-center gap-6 font-medium text-gray-800 text-sm">
          <button class="flex items-center gap-2 hover:underline">
            <Globe :size="16" />
            Español (ES)
          </button>
          <button class="hover:underline">€ EUR</button>
          <div class="flex items-center gap-4 ml-2">
            <a href="#" class="hover:opacity-70 transition-opacity">
              <Facebook :size="18" />
            </a>
            <a href="#" class="hover:opacity-70 transition-opacity">
              <Twitter :size="18" />
            </a>
            <a href="#" class="hover:opacity-70 transition-opacity">
              <Instagram :size="18" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
