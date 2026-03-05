import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersStateInterface } from '../../../core/interfaces/Users/UsersState.interface';

export const selectProfileState = createFeatureSelector<UsersStateInterface>('profile');

export const selectProfile = createSelector(
    selectProfileState,
    (state: UsersStateInterface) => state.profile
);

export const selectProfileLoading = createSelector(
    selectProfileState,
    (state: UsersStateInterface) => state.isLoading
);

export const selectProfileError = createSelector(
    selectProfileState,
    (state: UsersStateInterface) => state.error
);
