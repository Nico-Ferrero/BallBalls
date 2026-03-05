import { createReducer, on } from '@ngrx/store';
import * as ProfileActions from './actions';
import * as AuthActions from '../../auth/store/actions';
import { UsersStateInterface } from '../../../core/interfaces/Users/UsersState.interface';

export const initialState: UsersStateInterface = {
    profile: null,
    isLoading: false,
    error: null
};

export const profileReducer = createReducer(
    initialState,
    on(ProfileActions.loadProfile, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),
    on(ProfileActions.loadProfileSuccess, (state, { profile }) => ({
        ...state,
        profile,
        isLoading: false,
        error: null
    })),
    on(ProfileActions.loadProfileFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error
    })),

    // Update handlers
    on(ProfileActions.updateProfile, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),
    on(ProfileActions.updateProfileSuccess, (state, { profile }) => ({
        ...state,
        profile,
        isLoading: false,
        error: null
    })),
    on(ProfileActions.updateProfileFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error
    })),

    // Auth integration
    on(AuthActions.logoutSuccess, () => ({
        ...initialState
    }))
);
