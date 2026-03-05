import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-coming-soon',
    standalone: true,
    imports: [RouterLink],
    template: `
    <div class="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 class="text-6xl font-bold text-secondary mb-4 opacity-50">Próximamente</h1>
      <h2 class="text-3xl font-bold text-primary mb-6">Estamos trabajando en esta sección</h2>
      <p class="text-secondary text-lg max-w-md mb-8">
        Esta funcionalidad estará disponible muy pronto.
      </p>
      <a routerLink="/" 
         class="bg-accent-secondary hover:bg-opacity-90 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 no-underline">
        Volver al Inicio
      </a>
    </div>
  `
})
export class ComingSoonComponent { }
