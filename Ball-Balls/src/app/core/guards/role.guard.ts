import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const expectedRoles = route.data['roles'] as Array<string>;
    const token = authService.getAccessToken();

    if (!token) {
        return router.parseUrl('/login');
    }

    // Parse JWT manually to check roles without 3rd party libs
    try {
        const tokenPayload = token.split('.')[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const normalized = tokenPayload.padEnd(Math.ceil(tokenPayload.length / 4) * 4, '=');
        const payload = JSON.parse(atob(normalized));
        // Identity claims in ASP.NET defaults
        const roleClaim = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        const roles: string | string[] = roleClaim || payload.role || payload.roles || [];
        const rolesArray: string[] = Array.isArray(roles) ? roles : [roles];

        // Check if the route specifies required roles
        if (expectedRoles && expectedRoles.length > 0) {
            if (!expectedRoles.some(r => rolesArray.includes(r))) {
                return router.parseUrl('/');
            }
        }

        // Default system requirement: At least we look for admin if this guard is employed without specifics
        // Based on requirement: "(Nota: De momento el único rol disponible en el sistema es 'Admin')"
        if (!rolesArray.includes('Admin')) {
            return router.parseUrl('/');
        }

        return true;
    } catch (e) {
        return router.parseUrl('/login');
    }
};
