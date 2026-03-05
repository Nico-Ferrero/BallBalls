import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

const isRefreshing = new BehaviorSubject<boolean>(false);
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getAccessToken();

    let authReq = req;
    // Solo se inyecta token si existe y SI TIENE withCredentials
    if (token) {
        authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`),
            withCredentials: true
        });
    } else {
        // Asegurarse de que peticiones sin token también arrastren la de cookie (refresh, etc) si es hacia /api
        authReq = req.clone({
            withCredentials: true
        });
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            // Si recibimos 401
            if (error.status === 401) {
                // Evite refrescar si la solicitud ya era un refresh 
                if (req.url.includes('/refresh')) {
                    authService.clearLocalSession();
                    return throwError(() => error);
                }

                if (!isRefreshing.value) {
                    isRefreshing.next(true);
                    refreshTokenSubject.next(null);

                    return authService.refresh().pipe(
                        switchMap((refreshResponse) => {
                            isRefreshing.next(false);
                            refreshTokenSubject.next(refreshResponse.accessToken);

                            // Reenviar la petición original clonándola con el nuevo token
                            const newAuthReq = req.clone({
                                headers: req.headers.set('Authorization', `Bearer ${refreshResponse.accessToken}`),
                                withCredentials: true
                            });
                            return next(newAuthReq);
                        }),
                        catchError((refreshError) => {
                            isRefreshing.next(false);
                            // Si falla el refresh, hacemos best-effort logout
                            authService.logout();
                            return throwError(() => refreshError);
                        })
                    );
                } else {
                    // Si isRefreshing es true, esperamos a que termine y enviamos las peticiones atascadas
                    return refreshTokenSubject.pipe(
                        filter(newToken => newToken !== null),
                        take(1),
                        switchMap(newToken => {
                            const newAuthReq = req.clone({
                                headers: req.headers.set('Authorization', `Bearer ${newToken}`),
                                withCredentials: true
                            });
                            return next(newAuthReq);
                        })
                    );
                }
            }

            return throwError(() => error);
        })
    );
};
