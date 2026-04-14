import { createAction, props } from '@ngrx/store';
import { ProfileResponse } from '../../../core/interfaces/Users/ProfileResponse.interface';
import { UpdateUserRequest } from '../../../core/interfaces/Users/UserRequest.interface';

// --- Load Profile Actions ---
export const loadProfile = createAction(
    '[Profile] Load Profile',
    props<{ username: string }>()
);

export const loadProfileSuccess = createAction(
    '[Profile] Load Profile Success',
    props<{ profile: ProfileResponse }>()
);

export const loadProfileFailure = createAction(
    '[Profile] Load Profile Failure',
    props<{ error: string }>()
);

// --- Update Profile Actions ---
export const updateProfile = createAction(
    '[Profile] Update Profile',
    props<{ request: UpdateUserRequest }>()
);

export const updateProfileSuccess = createAction(
    '[Profile] Update Profile Success',
    props<{ profile: ProfileResponse }>()
);

export const updateProfileFailure = createAction(
    '[Profile] Update Profile Failure',
    props<{ error: string }>()
);

// --- Cancel Reserva Actions ---
export const cancelReserva = createAction(
    '[Profile Reservas] Cancel Reserva',
    props<{ publicId: string }>()
);

export const cancelReservaSuccess = createAction(
    '[Profile Reservas] Cancel Reserva Success',
    props<{ publicId: string }>()
);

export const cancelReservaFailure = createAction(
    '[Profile Reservas] Cancel Reserva Failure',
    props<{ error: string }>()
);
