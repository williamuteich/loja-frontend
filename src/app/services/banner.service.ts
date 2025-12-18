import { Injectable, signal, inject } from "@angular/core";
import { ApiService } from "./api.service";
import { Banner } from "../models";

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
}