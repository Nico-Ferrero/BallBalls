import { APP_INITIALIZER, Provider } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { restoreSessionSuccess } from '../../features/auth/store/actions';

/**
 * Factory for application startup to attempt silent refresh connection
 */
export function initializeApp(authService: AuthService, store: Store) {
    return async () => {
        try {
            // Intentamos refrescar el token de forma silenciosa al arrancar usando await real
            const response = await firstValueFrom(authService.refresh());

            if (response && response.accessToken) {
                store.dispatch(restoreSessionSuccess({
                    response: { accessToken: response.accessToken, usuario: response.usuario }
                }));
            }
        } catch (error) {
            // Si el refresh falla (ej: 401 Unauthorized), la app continuará su arranque normalmente
            // sin credenciales en memoria.
            console.warn('Iniciando sesión como invitado.');
        }
    };
}

export const appInitializerProvider: Provider = {
    provide: APP_INITIALIZER,
    useFactory: initializeApp,
    deps: [AuthService, Store],
    multi: true
};
