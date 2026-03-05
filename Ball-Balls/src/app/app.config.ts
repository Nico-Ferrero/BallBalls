import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { appInitializerProvider } from './core/initializers/auth.initializer';
import { reducers, homePistasReducer } from './features/home/store/reducers';
import { HomeEffects } from './features/home/store/effects';
import { PistasReducer } from './features/shop/store/reducers';
import { ShopEffects } from './features/shop/store/effects';
import { authReducer } from './features/auth/store/reducers';
import { AuthEffects } from './features/auth/store/effects';

import { provideLottieOptions } from 'ngx-lottie';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    provideAnimations(),
    provideEffects([HomeEffects, ShopEffects, AuthEffects]),
    provideStore({ deportes: reducers, pistas: PistasReducer, homePistas: homePistasReducer, auth: authReducer }),
    appInitializerProvider,
    provideLottieOptions({
      player: () => import('lottie-web'),
    }),
  ]
};
