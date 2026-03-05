import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../auth/store/selectors';

export const meGuard: CanActivateFn = (route, state) => {
    const store = inject(Store);
    const router = inject(Router);
    const currentUser = store.selectSignal(selectCurrentUser)();

    const targetUsername = route.paramMap.get('username');

    // Si el usuario está logueado y la URL a la que intenta ingresar es su propio username
    // lo redirigimos a /profile/me
    if (currentUser && currentUser.username === targetUsername) {
        return router.createUrlTree(['/profile/me']);
    }

    return true;
};
