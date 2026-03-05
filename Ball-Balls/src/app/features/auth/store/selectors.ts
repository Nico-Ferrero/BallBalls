import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthStateInterface } from '../../../core/interfaces/Auth/AuthState.interface';

export const selectAuthState = createFeatureSelector<AuthStateInterface>('auth');

export const selectIsLoading = createSelector(
    selectAuthState,
    (state: AuthStateInterface) => state.isLoading
);

export const selectAuthError = createSelector(
    selectAuthState,
    (state: AuthStateInterface) => state.error
);

export const selectCurrentUser = createSelector(
    selectAuthState,
    (state: AuthStateInterface) => state.usuario
);

export const selectIsAuthenticated = createSelector(
    selectAuthState,
    (state: AuthStateInterface) => !!state.auth?.accessToken
);
