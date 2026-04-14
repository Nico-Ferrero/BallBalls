import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as ProfileActions from './actions';
import { ProfilesService } from '../../../core/services/profiles.service';
import { UsersService } from '../../../core/services/users.service';
import { AuthService } from '../../../core/services/auth.service';
import { ReservasService } from '../../../core/services/reservas.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Injectable()
export class ProfileEffects {
    private actions$ = inject(Actions);
    private profilesService = inject(ProfilesService);
    private usersService = inject(UsersService);
    private authService = inject(AuthService);
    private reservasService = inject(ReservasService);

    loadProfile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProfileActions.loadProfile),
            mergeMap(({ username }) =>
                this.profilesService.getProfile(username).pipe(
                    map((profile) => ProfileActions.loadProfileSuccess({ profile })),
                    catchError((error: HttpErrorResponse) => {
                        const errorMsg = error.error?.message || error.error?.title || 'Ocurrió un error al cargar el perfil. Por favor, inténtelo de nuevo más tarde.';
                        return of(ProfileActions.loadProfileFailure({ error: errorMsg }));
                    })
                )
            )
        )
    );

    updateProfile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProfileActions.updateProfile),
            mergeMap(({ request }) =>
                this.usersService.updateCurrentUser(request).pipe(
                    map((profile) => {
                        // Optional: Show success Toast/Alert here instead of component
                        Swal.fire({
                            title: '¡Actualizado!',
                            text: 'Tu perfil ha sido actualizado correctamente.',
                            icon: 'success',
                            background: '#1e1e2d',
                            color: '#fff',
                            confirmButtonColor: '#3b82f6'
                        });
                        return ProfileActions.updateProfileSuccess({ profile });
                    }),
                    catchError((error: HttpErrorResponse) => {
                        const errorMsg = error.error?.message || error.error?.title || 'Ocurrió un error al actualizar el perfil.';
                        Swal.fire({
                            title: 'Error',
                            text: errorMsg,
                            icon: 'error',
                            background: '#1e1e2d',
                            color: '#fff',
                            confirmButtonColor: '#ef4444'
                        });
                        return of(ProfileActions.updateProfileFailure({ error: errorMsg }));
                    })
                )
            )
        )
    );

    cancelReserva$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ProfileActions.cancelReserva),
            mergeMap(({ publicId }) =>
                this.reservasService.cancelReserva(publicId).pipe(
                    map(() => {
                        Swal.fire({
                            title: 'Reserva cancelada',
                            text: 'El reembolso ha sido procesado correctamente.',
                            icon: 'success',
                            background: '#1e1e2d',
                            color: '#fff',
                            confirmButtonColor: '#3b82f6'
                        });
                        return ProfileActions.cancelReservaSuccess({ publicId });
                    }),
                    catchError((error: HttpErrorResponse) => {
                        const errorMsg = error.error?.message || error.error?.title || 'No se pudo cancelar la reserva.';
                        Swal.fire({
                            title: 'Error al cancelar',
                            text: errorMsg,
                            icon: 'error',
                            background: '#1e1e2d',
                            color: '#fff',
                            confirmButtonColor: '#ef4444'
                        });
                        return of(ProfileActions.cancelReservaFailure({ error: errorMsg }));
                    })
                )
            )
        )
    );
}
