import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../../core/services/auth.service';
import * as AuthActions from './actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class AuthEffects {
    private actions$ = inject(Actions);
    private authService = inject(AuthService);
    private router = inject(Router);

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.login),
            mergeMap(({ request }) =>
                this.authService.login(request).pipe(
                    map(response => AuthActions.loginSuccess({ response })),
                    catchError((err: HttpErrorResponse) =>
                        of(AuthActions.loginFailure({ error: err.error?.message || 'Credenciales incorrectas o error en el servidor' }))
                    )
                )
            )
        )
    );

    loginSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.loginSuccess),
                tap(() => {
                    this.router.navigate(['/']); // Redirigir al inicio dashboard tras loguear
                })
            ),
        { dispatch: false }
    );

    register$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.register),
            mergeMap(({ request }) =>
                this.authService.register(request).pipe(
                    map(response => AuthActions.registerSuccess({ response })),
                    catchError((err: HttpErrorResponse) =>
                        of(AuthActions.registerFailure({ error: err.error?.message || 'Ocurrió un error al registrar el usuario' }))
                    )
                )
            )
        )
    );

    registerSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.registerSuccess),
                tap(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Registro exitoso',
                        text: 'Cuenta creada exitosamente. Por favor, inicia sesión.',
                        confirmButtonColor: '#10B981', // green-500
                    });
                })
            ),
        { dispatch: false }
    );

    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.logout),
            tap(() => {
                this.authService.logout();
            }),
            map(() => AuthActions.logoutSuccess())
        )
    );

    logoutAll$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.logoutAll),
            tap(() => {
                this.authService.logoutAll();
                Swal.fire({
                    title: 'Sesiones Cerradas',
                    text: 'Se han cerrado todas las sesiones.',
                    icon: 'success',
                    background: '#1e1e2d',
                    color: '#fff',
                    confirmButtonColor: '#3b82f6'
                });
            }),
            map(() => AuthActions.logoutSuccess())
        )
    );

    logoutSuccess$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.logoutSuccess),
                tap(() => {
                    this.router.navigate(['/login']);
                })
            ),
        { dispatch: false }
    );
}
