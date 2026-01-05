import { inject, Injectable, signal } from "@angular/core";
import { ApiService } from "./api.service";
import { Social } from "../models";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SocialService {
    private readonly api = inject(ApiService)

    private readonly _socials = signal<Social[]>([]);
    private readonly _publicSocials = signal<Social[]>([]);

    readonly socials = this._socials.asReadonly();
    readonly publicSocials = this._publicSocials.asReadonly();

    readonly isLoading = signal(false);
    readonly error = signal<string | null>(null);

    readonly totalItems = signal(0);
    private publicLoaded = false;

    public loadSocialsAdmin() {
        this.isLoading.set(true);
        this.error.set(null);

        this.api.get<any>('social/admin').subscribe({
            next: (response) => {
                if (Array.isArray(response)) {
                    this._socials.set(response);
                    this.totalItems.set(response.length);
                } else if (response && Array.isArray(response.data)) {
                    this._socials.set(response.data);
                    this.totalItems.set(response.data.length);
                }
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Erro ao carregar redes sociais admin', err);
                this.error.set('Não foi possível carregar as redes sociais.');
                this.isLoading.set(false);
            }
        });
    }

    public loadSocialsPublic() {
        if (this.publicLoaded) return;

        this.isLoading.set(true);
        this.error.set(null);

        this.api.get<Social[]>('social/public').subscribe({
            next: (socials) => {
                this._publicSocials.set(socials);
                this.publicLoaded = true;
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Erro ao carregar redes sociais public', err);
                this.error.set('Não foi possível carregar as redes sociais da loja.');
                this.isLoading.set(false);
            }
        });
    }

    public update(id: string, data: Partial<Social>): Observable<Social> {
        return this.api.patch<Social>(`social/admin/${id}`, data).pipe(
            tap((updatedSocial) => {
                this._socials.update(socials =>
                    socials.map(s => s.id === id ? { ...updatedSocial } : s)
                );
                this.publicLoaded = false;
            })
        );
    }

    public create(data: Partial<Social>): Observable<Social> {
        return this.api.post<Social>('social/admin', data).pipe(
            tap((newSocial) => {
                this._socials.update(socials => [...socials, newSocial]);
                this.publicLoaded = false;
            })
        );
    }

    public delete(id: string): Observable<void> {
        return this.api.delete<void>(`social/admin/${id}`).pipe(
            tap(() => {
                this._socials.update(socials => socials.filter(s => s.id !== id));
                this.publicLoaded = false;
            })
        );
    }
}