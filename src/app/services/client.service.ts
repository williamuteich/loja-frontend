import { Injectable, signal, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Client } from '../models';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClientService {
    private readonly api = inject(ApiService);

    private readonly _clients = signal<Client[]>([]);
    readonly clients = this._clients.asReadonly();
    readonly isLoading = signal(false);
    readonly error = signal<string | null>(null);

    private loaded = false;

    public loadClients() {
        if (this.loaded) return;

        this.isLoading.set(true);
        this.error.set(null);

        this.api.get<Client[]>('client').subscribe({
            next: (clients) => {
                this._clients.set(clients);
                this.loaded = true;
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Erro ao carregar clientes', err);
                this.error.set('Não foi possível carregar a lista de clientes.');
                this.isLoading.set(false);
            }
        });
    }

    update(id: string, data: Partial<Client>): Observable<Client> {
        return this.api.patch<Client>(`client/${id}`, data).pipe(
            tap((updatedClient) => {
                this._clients.update(clients =>
                    clients.map(c => c.id === id ? updatedClient : c)
                );
            })
        );
    }
}
