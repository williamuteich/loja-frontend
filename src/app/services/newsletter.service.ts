import { Injectable, signal, inject } from "@angular/core";
import { ApiService } from "./api.service";
import { Newsletter } from "../models";
import { Observable, tap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class NewsletterService {
    private readonly api = inject(ApiService);

    private readonly _newsletters = signal<Newsletter[]>([]);
    readonly newsletters = this._newsletters.asReadonly();

    readonly isLoading = signal(false);
    readonly error = signal<string | null>(null);
    readonly totalItems = signal(0);

    loadNewslettersAdmin(page: number = 1, pageSize: number = 10, search?: string): void {
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

        const queryString = params.toString();

        this.api.get<any>(`newsletter/admin?${queryString}`).subscribe({
            next: (response) => {
                if (Array.isArray(response)) {
                    this._newsletters.set(response);
                    // Simple pagination total items fallback
                    if (response.length >= pageSize) {
                        this.totalItems.set((page * pageSize) + 1);
                    } else {
                        this.totalItems.set(((page - 1) * pageSize) + response.length);
                    }
                } else if (response && Array.isArray(response.data)) {
                    this._newsletters.set(response.data);
                    const total = response.meta?.total || response.count || response.total || 0;
                    this.totalItems.set(total);
                }
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Erro ao carregar newsletter admin', err);
                this.error.set('Não foi possível carregar os inscritos da newsletter.');
                this.isLoading.set(false);
            }
        });
    }

    delete(id: string): Observable<void> {
        return this.api.delete<void>(`newsletter/admin/${id}`).pipe(
            tap(() => {
                this._newsletters.update(news => news.filter(n => n.id !== id));
            })
        );
    }

    subscribe(data: { email: string; whatsapp?: string }): Observable<any> {
        return this.api.post<any>('newsletter/public', data);
    }
}
