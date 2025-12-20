import { inject, Injectable, signal } from "@angular/core";
import { ApiService } from "./api.service";
import { Brand } from "../models";
import { Observable, tap } from "rxjs";

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

    update(id: string, data: Partial<Brand>): Observable<Brand> {
        return this.api.patch<Brand>(`brand/${id}`, data).pipe(
            tap((updatedBrand) => {
                this._brands.update(brands =>
                    brands.map(b => b.id === id ? { ...updatedBrand, _count: b._count } : b)
                );
            })
        );
    }
}
