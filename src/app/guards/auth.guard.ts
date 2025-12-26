import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated() && authService.hasRole(['ADMIN', 'COLLABORATOR'])) {
        return true;
    }

    return authService.getCurrentUser().pipe(
        map(user => {
            if (user && authService.hasRole(['ADMIN', 'COLLABORATOR'])) {
                return true;
            }

            router.navigate(['/login']);
            return false;
        }),
        catchError(() => {
            router.navigate(['/login']);
            return of(false);
        })
    );
};
