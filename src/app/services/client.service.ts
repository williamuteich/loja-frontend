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

    readonly totalItems = signal(0);

    public loadClientsAdmin(page: number = 1, pageSize: number = 10, search?: string) {
        this.isLoading.set(true);
        this.error.set(null);

        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const params = new URLSearchParams({
            skip: skip.toString(),
            take: take.toString(),
        });

        if (search) {
            params.append('search', search);
        }

        this.api.get<any>(`client/admin?${params.toString()}`).subscribe({
            next: (response) => {
                if (Array.isArray(response)) {
                    this._clients.set(response);
                    if (response.length >= pageSize) {
                        this.totalItems.set((page * pageSize) + 1);
                    } else {
                        this.totalItems.set(((page - 1) * pageSize) + response.length);
                    }
                } else if (response && Array.isArray(response.data)) {
                    this._clients.set(response.data);
                    const total = response.meta?.total || response.count || response.total || 0;
                    this.totalItems.set(total);
                }

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
        return this.api.patch<Client>(`client/admin/${id}`, data).pipe(
            tap((updatedClient) => {
                this._clients.update(clients =>
                    clients.map(c => c.id === id ? updatedClient : c)
                );
            })
        );
    }

    create(data: Client): Observable<Client> {
        return this.api.post<Client>('client/admin', data).pipe(
            tap((newClient) => {
                this._clients.update(clients => [...clients, newClient]);
            })
        );
    }

    delete(id: string): Observable<void> {
        return this.api.delete<void>(`client/admin/${id}`).pipe(
            tap(() => {
                this._clients.update(clients =>
                    clients.filter(c => c.id !== id)
                );
            })
        );
    }
}
