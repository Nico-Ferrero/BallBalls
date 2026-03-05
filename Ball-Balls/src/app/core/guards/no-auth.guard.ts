import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '../../features/auth/store/selectors';

export const noAuthGuard: CanActivateFn = (route, state) => {
    const store = inject(Store);
    const router = inject(Router);

    if (!store.selectSignal(selectIsAuthenticated)()) {
        return true;
    }

    // They have a valid access token locally, navigate away from login/register
    return router.parseUrl('/');
};
