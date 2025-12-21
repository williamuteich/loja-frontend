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
    readonly isLoading = signal(false);
    readonly error = signal<string | null>(null);

    private loaded = false;

    public loadBrands() {
        if (this.loaded) return;

        this.isLoading.set(true);
        this.error.set(null);

        this.api.get<Brand[]>('brand').subscribe({
            next: (brands) => {
                this._brands.set(brands);
                this.loaded = true;
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Erro ao carregar marcas', err);
                this.error.set('Não foi possível carregar a lista de marcas.');
                this.isLoading.set(false);
            }
        })
    }

    create(data: Brand): Observable<Brand> {
        return this.api.post<Brand>('brand', data).pipe(
            tap((newBrand) => {
                this._brands.update(brands => [...brands, newBrand]);
            })
        );
    }

    delete(id: string): Observable<Brand['id']> {
        return this.api.delete<Brand['id']>(`brand/${id}`).pipe(
            tap(() => {
                this._brands.update(brands =>
                    brands.filter(b => b.id !== id)
                );
            })
        );
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
