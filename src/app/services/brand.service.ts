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

    readonly totalItems = signal(0);
    private publicLoaded = false;

    public loadBrandsAdmin(page: number = 1, pageSize: number = 10, search?: string): void {
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

        this.api.get<any>(`brand/admin?${queryString}`).subscribe({
            next: (response) => {
                if (Array.isArray(response)) {
                    this._brands.set(response);
                    if (response.length >= pageSize) {
                        this.totalItems.set((page * pageSize) + 1);
                    } else {
                        this.totalItems.set(((page - 1) * pageSize) + response.length);
                    }
                } else if (response && Array.isArray(response.data)) {
                    this._brands.set(response.data);
                    const total = response.meta?.total || response.count || response.total || 0;
                    this.totalItems.set(total);
                }
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Erro ao carregar marcas admin', err);
                this.error.set('Não foi possível carregar a lista de marcas do dashboard.');
                this.isLoading.set(false);
            }
        });
    }

    public loadAllBrandsAdmin(): void {
        this.isLoading.set(true);
        this.error.set(null);

        this.api.get<Brand[]>('brand/admin/all').subscribe({
            next: (brands) => {
                this._brands.set(brands);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Erro ao carregar todas as marcas admin', err);
                this.error.set('Não foi possível carregar todas as marcas.');
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
                this._brands.update(brands => [...brands, { ...newBrand, _count: { products: 0 } }]);
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
