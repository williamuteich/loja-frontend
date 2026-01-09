import { Injectable, signal, inject } from "@angular/core";
import { ApiService } from "./api.service";
import { Banner } from "../models";
import { Observable, tap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class BannerService {
    private readonly api = inject(ApiService);

    private readonly _banners = signal<Banner[]>([]);
    private readonly _publicBanners = signal<Banner[]>([]);

    readonly banners = this._banners.asReadonly();
    readonly publicBanners = this._publicBanners.asReadonly();

    readonly isLoading = signal(false);
    readonly error = signal<string | null>(null);

    readonly totalItems = signal(0);
    private publicLoaded = false;

    loadBannersAdmin(page: number = 1, pageSize: number = 10, search?: string): void {
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

        this.api.get<any>(`banner/admin?${queryString}`)
            .subscribe({
                next: (response) => {
                    if (Array.isArray(response)) {
                        this._banners.set(response);
                        if (response.length >= pageSize) {
                            this.totalItems.set((page * pageSize) + 1);
                        } else {
                            this.totalItems.set(((page - 1) * pageSize) + response.length);
                        }
                    } else if (response && Array.isArray(response.data)) {
                        this._banners.set(response.data);
                        const total = response.meta?.total || response.count || response.total || 0;
                        this.totalItems.set(total);
                    }
                    this.isLoading.set(false);
                },
                error: (err) => {
                    console.error('Erro ao carregar banners admin', err);
                    this.error.set('Não foi possível carregar os banners do dashboard.');
                    this.isLoading.set(false);
                }
            });
    }

    loadBannersPublic(): void {
        if (this.publicLoaded) return;

        this.isLoading.set(true);
        this.error.set(null);

        this.api.get<Banner[]>('banner/public')
            .subscribe({
                next: (banners) => {
                    this._publicBanners.set(banners);
                    this.publicLoaded = true;
                    this.isLoading.set(false);
                },
                error: (err) => {
                    console.error('Erro ao carregar banners públicas', err);
                    this.error.set('Não foi possível carregar os banners da loja.');
                    this.isLoading.set(false);
                }
            });
    }

    public findOnePublic(id: string): Observable<Banner> {
        return this.api.get<Banner>(`banner/public/${id}`);
    }

    update(id: string, data: any): Observable<Banner> {
        return this.api.patch<Banner>(`banner/admin/${id}`, data).pipe(
            tap((updatedBanner) => {
                this._banners.update(banners =>
                    banners.map(b => b.id === id ? updatedBanner : b)
                );
                this.publicLoaded = false;
            })
        );
    }

    delete(id: string): Observable<void> {
        return this.api.delete<void>(`banner/admin/${id}`).pipe(
            tap(() => {
                this._banners.update(banners =>
                    banners.filter(b => b.id !== id)
                );
                this.publicLoaded = false;
            })
        );
    }

    create(data: FormData): Observable<Banner> {
        return this.api.post<Banner>('banner/admin', data).pipe(
            tap((newBanner) => {
                this._banners.update(banners => [...banners, newBanner]);
                this.publicLoaded = false;
            })
        );
    }
}