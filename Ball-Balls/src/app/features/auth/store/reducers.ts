import { createReducer, on } from '@ngrx/store';
import { AuthStateInterface } from '../../../core/interfaces/Auth/AuthState.interface';
import * as AuthActions from './actions';

export const initialAuthState: AuthStateInterface = {
    isLoading: false,
    auth: null,
    usuario: null,
    error: null,
};

export const authReducer = createReducer(
    initialAuthState,

    // Login
    on(AuthActions.login, (state) => ({
        ...state,
        isLoading: true,
        error: null,
    })),
    on(AuthActions.loginSuccess, (state, { response }) => ({
        ...state,
        isLoading: false,
        auth: response,
        usuario: response.usuario,
        error: null,
    })),
    on(AuthActions.loginFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error: error,
    })),

    // Register 
    on(AuthActions.register, (state) => ({
        ...state,
        isLoading: true,
        error: null,
    })),
    on(AuthActions.registerSuccess, (state) => ({
        ...state,
        isLoading: false,
        error: null,
    })),
    on(AuthActions.registerFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error: error,
    })),

    // Logout
    on(AuthActions.logoutSuccess, () => ({
        ...initialAuthState, // Resetea el estado completo al hacer logout
    })),

    // Restore Session
    on(AuthActions.restoreSessionSuccess, (state, { response }) => ({
        ...state,
        isLoading: false,
        auth: response,
        usuario: response.usuario,
        error: null,
    }))
);
