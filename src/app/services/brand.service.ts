import { inject, Injectable, signal } from "@angular/core";
import { ApiService } from "./api.service";
import { Brand } from "../models";

@Injectable({
    providedIn: 'root'
})
export class BrandService {
    private readonly api = inject(ApiService)

    private readonly _brands = signal<Brand[]>([]);
    readonly brands = this._brands.asReadonly();

    private loaded = false;

    public loadBrands() {
        if (this.loaded) return;

        this.api.get<Brand[]>('brand').subscribe({
            next: (brands) => {
                this._brands.set(brands);
                this.loaded = true;
            }
        })
    }
}
