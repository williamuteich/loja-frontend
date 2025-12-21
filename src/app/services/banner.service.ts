import { Injectable, signal, inject } from "@angular/core";
import { ApiService } from "./api.service";
import { Banner } from "../models";
import { Observable, tap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class BannerService {
    private readonly api = inject(ApiService);

    private readonly _banners = signal<Banner[]>([]);
    readonly banners = this._banners.asReadonly();
    readonly isLoading = signal(false);
    readonly error = signal<string | null>(null);

    private loaded = false;

    loadBanners(): void {
        if (this.loaded) return;

        this.isLoading.set(true);
        this.error.set(null);

        this.api.get<Banner[]>('banner')
            .subscribe({
                next: (banners) => {
                    this._banners.set(banners);
                    this.loaded = true;
                    this.isLoading.set(false);
                },
                error: (err) => {
                    console.error('Erro ao carregar banners', err);
                    this.error.set('Não foi possível carregar os banners. Tente novamente mais tarde.');
                    this.isLoading.set(false);
                }
            });
    }

    update(id: string, data: Partial<Banner>): Observable<Banner> {
        return this.api.patch<Banner>(`banner/${id}`, data).pipe(
            tap((updatedBanner) => {
                this._banners.update(banners =>
                    banners.map(b => b.id === id ? updatedBanner : b)
                );
            })
        );
    }
}