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

    private adminLoaded = false;
    private publicLoaded = false;

    loadBannersAdmin(): void {
        if (this.adminLoaded) return;

        this.isLoading.set(true);
        this.error.set(null);

        this.api.get<Banner[]>('banner/admin')
            .subscribe({
                next: (banners) => {
                    this._banners.set(banners);
                    this.adminLoaded = true;
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

    update(id: string, data: Partial<Banner>): Observable<Banner> {
        return this.api.patch<Banner>(`banner/admin/${id}`, data).pipe(
            tap((updatedBanner) => {
                this._banners.update(banners =>
                    banners.map(b => b.id === id ? updatedBanner : b)
                );
                this.publicLoaded = false;
            })
        );
    }
}