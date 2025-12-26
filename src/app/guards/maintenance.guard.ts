import { inject, Injector } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StoreConfigService } from '../services/store-config.service';
import { firstValueFrom } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';

export const maintenanceGuard: CanActivateFn = async (route, state) => {
    const storeConfigService = inject(StoreConfigService);
    const router = inject(Router);
    const injector = inject(Injector);

    if (!storeConfigService.config()) {
        storeConfigService.loadConfigPublic();

        const isLoading$ = toObservable(storeConfigService.isLoading, { injector });

        await firstValueFrom(
            isLoading$.pipe(
                filter(loading => !loading),
                take(1)
            )
        );
    }

    const config = storeConfigService.config();

    if (config?.maintenanceMode && state.url !== '/maintenance') {
        router.navigate(['/maintenance']);
        return false;
    }

    return true;
};
