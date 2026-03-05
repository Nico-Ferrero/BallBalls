import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [RouterLink],
    template: `
    <div class="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 class="text-9xl font-bold text-primary mb-4 opacity-20">404</h1>
      <h2 class="text-3xl font-bold text-primary mb-6">Página no encontrada</h2>
      <p class="text-secondary text-lg max-w-md mb-8">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <a routerLink="/" 
         class="bg-accent-primary hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 no-underline">
        Volver al Inicio
      </a>
    </div>
  `
})
export class NotFoundComponent { }
