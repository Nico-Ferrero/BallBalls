import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListDeportesComponent } from './components/list-deportes/list-deportes.component';
import { ListPistasHomeComponent } from './components/list-pistas-home/list-pistas-home.component';
import { FiltrosHomeComponent } from './components/filtros-home/filtros-home.component';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ListDeportesComponent, ListPistasHomeComponent, FiltrosHomeComponent, LottieComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  readonly titleText = 'Encuentra tu pista'.split('');
  readonly highlightText = 'perfecta'.split('');

  options: AnimationOptions = {
    path: '/assets/animations/hero-placeholder.json',
    loop: true,
    autoplay: true,
  };
}
