import { Injectable, signal, inject } from "@angular/core";
import { ApiService } from "./api.service";
import { Banner } from "../models";
import { Observable, tap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class BannerService {
    private readonly api = inject(ApiService);

    private readonly _banners = signal<Banner[]>([]);
    readonly banners = this._banners.asReadonly();

    private loaded = false;

    loadBanners(): void {
        if (this.loaded) return;

        this.api.get<Banner[]>('banner')
            .subscribe(banners => {
                this._banners.set(banners);
                this.loaded = true;
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