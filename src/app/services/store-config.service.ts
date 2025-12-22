import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { StoreConfig } from '../models';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StoreConfigService {
    private readonly api = inject(ApiService);

    private readonly _config = signal<StoreConfig | null>(null);
    readonly config = this._config.asReadonly();
    readonly isLoading = signal(false);
    readonly error = signal<string | null>(null);

    loadConfigPublic(): void {
        this.isLoading.set(true);
        this.api.get<StoreConfig>('store-configuration/public').subscribe({
            next: (config) => {
                this._config.set(config);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading store config', err);
                this.error.set('Não foi possível carregar as configurações da loja.');
                this.isLoading.set(false);
            }
        });
    }

    updateAdmin(data: Partial<StoreConfig>): Observable<StoreConfig> {
        return this.api.patch<StoreConfig>('store-configuration/admin', data).pipe(
            tap(config => this._config.set(config))
        );
    }
}
