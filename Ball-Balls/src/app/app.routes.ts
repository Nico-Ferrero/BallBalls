import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { roleGuard } from './core/guards/role.guard';

import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { profileReducer } from './features/profile/store/reducers';
import { ProfileEffects } from './features/profile/store/effects';
import { dashboardAdminReducer } from './features/dashboard-admin/store/reducers';
import { DashboardAdminEffects } from './features/dashboard-admin/store/effects';

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
        path: 'reservas/:slug',
        loadComponent: () => import('./features/article/article.component').then(m => m.ArticleComponent),
        title: 'Reserva - Ball&Balls'
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
        path: 'dashboard-admin',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Admin'] },
        providers: [
            provideState('dashboardAdmin', dashboardAdminReducer),
            provideEffects([DashboardAdminEffects])
        ],
        loadChildren: () => import('./features/dashboard-admin/dashboard-admin.routes').then(m => m.dashboardAdminRoutes),
        title: 'Dashboard Admin - Ball&Balls'
    },
    {
        path: '**',
        loadComponent: () => import('./shared/layout/not-found/not-found.component').then(m => m.NotFoundComponent),
        title: '404 - No Encontrado'
    }
];
