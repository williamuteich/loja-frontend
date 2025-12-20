import { inject, Injectable, signal } from "@angular/core";
import { ApiService } from "./api.service";
import { Client } from "../models";
import { Observable, tap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ClientService {
    private readonly api = inject(ApiService);

    private readonly _clients = signal<Client[]>([]);
    readonly clients = this._clients.asReadonly();

    private loaded = false;

    loadClients(): void {
        if (this.loaded) return;

        this.api.get<Client[]>('client')
            .subscribe(clients => {
                this._clients.set(clients);
                this.loaded = true;
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
