import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '../../features/auth/store/selectors';

export const authGuard: CanActivateFn = (route, state) => {
    const store = inject(Store);
    const router = inject(Router);

    if (store.selectSignal(selectIsAuthenticated)()) {
        return true;
    }

    return router.parseUrl('/login');
};
