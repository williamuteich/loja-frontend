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
    private readonly _publicBrands = signal<Brand[]>([]);

    readonly brands = this._brands.asReadonly();
    readonly publicBrands = this._publicBrands.asReadonly();

    readonly isLoading = signal(false);
    readonly error = signal<string | null>(null);

    private adminLoaded = false;
    private publicLoaded = false;

    public loadBrandsAdmin(): void {
        if (this.adminLoaded) return;

        this.isLoading.set(true);
        this.error.set(null);

        this.api.get<Brand[]>('brand/admin').subscribe({
            next: (brands) => {
                this._brands.set(brands);
                this.adminLoaded = true;
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Erro ao carregar marcas admin', err);
                this.error.set('Não foi possível carregar a lista de marcas do dashboard.');
                this.isLoading.set(false);
            }
        });
    }

    public loadBrandsPublic(): void {
        if (this.publicLoaded) return;

        this.isLoading.set(true);
        this.error.set(null);

        this.api.get<Brand[]>('brand/public').subscribe({
            next: (brands) => {
                this._publicBrands.set(brands);
                this.publicLoaded = true;
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Erro ao carregar marcas públicas', err);
                this.error.set('Não foi possível carregar as marcas da loja.');
                this.isLoading.set(false);
            }
        });
    }

    public findOnePublic(id: string): Observable<Brand> {
        return this.api.get<Brand>(`brand/public/${id}`);
    }

    create(data: Brand): Observable<Brand> {
        return this.api.post<Brand>('brand/admin', data).pipe(
            tap((newBrand) => {
                this._brands.update(brands => [...brands, newBrand]);
                this.publicLoaded = false;
            })
        );
    }

    delete(id: string): Observable<Brand['id']> {
        return this.api.delete<Brand['id']>(`brand/admin/${id}`).pipe(
            tap(() => {
                this._brands.update(brands =>
                    brands.filter(b => b.id !== id)
                );
                this.publicLoaded = false;
            })
        );
    }

    update(id: string, data: Partial<Brand>): Observable<Brand> {
        return this.api.patch<Brand>(`brand/admin/${id}`, data).pipe(
            tap((updatedBrand) => {
                this._brands.update(brands =>
                    brands.map(b => b.id === id ? { ...updatedBrand, _count: b._count } : b)
                );
                this.publicLoaded = false;
            })
        );
    }
}
