import { createAction, props } from '@ngrx/store';
import { AuthResponse, RegisterResponse } from '../../../core/interfaces/Auth/AuthResponse.interface';
import { LoginRequest, RegisterRequest } from '../../../core/interfaces/Auth/AuthRequest.interface';

// --- Login Actions ---
export const login = createAction('[Auth] Login', props<{ request: LoginRequest }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ response: AuthResponse }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

// --- Register Actions ---
export const register = createAction('[Auth] Register', props<{ request: RegisterRequest }>());
export const registerSuccess = createAction('[Auth] Register Success', props<{ response: RegisterResponse }>());
export const registerFailure = createAction('[Auth] Register Failure', props<{ error: string }>());

// --- Logout Actions ---
export const logout = createAction('[Auth] Logout');
export const logoutAll = createAction('[Auth] Logout All');
export const logoutSuccess = createAction('[Auth] Logout Success');

// --- Session Actions ---
export const restoreSessionSuccess = createAction('[Auth] Restore Session Success', props<{ response: AuthResponse }>());
