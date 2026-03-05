import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { profileReducer } from './features/profile/store/reducers';
import { ProfileEffects } from './features/profile/store/effects';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
        title: 'Inicio - Ball&Balls'
    },
    {
        path: 'pistas',
        loadComponent: () => import('./features/shop/shop.component').then(m => m.ShopComponent),
        title: 'Pistas - Ball&Balls'
    },
    {
        path: 'ranking',
        loadComponent: () => import('./shared/layout/coming-soon/coming-soon.component').then(m => m.ComingSoonComponent),
        title: 'Ranking - Ball&Balls'
    },
    {
        path: 'torneos',
        loadComponent: () => import('./shared/layout/coming-soon/coming-soon.component').then(m => m.ComingSoonComponent),
        title: 'Torneos - Ball&Balls'
    },
    {
        path: 'login',
        canActivate: [noAuthGuard],
        loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent),
        title: 'Login - Ball&Balls'
    },
    {
        path: 'profile',
        providers: [
            provideState('profile', profileReducer),
            provideEffects([ProfileEffects])
        ],
        loadChildren: () => import('./features/profile/profile.routes').then(m => m.profileRoutes)
    },
    {
        path: '**',
        loadComponent: () => import('./shared/layout/not-found/not-found.component').then(m => m.NotFoundComponent),
        title: '404 - No Encontrado'
    }
];
