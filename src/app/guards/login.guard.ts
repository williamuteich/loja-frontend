import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        router.navigate(['/dashboard']);
        return false;
    }

    return authService.getCurrentUser().pipe(
        map(user => {
            if (user) {
                router.navigate(['/dashboard']);
                return false;
            }
            return true;
        })
    );
};
