import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Product } from '../models';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
    private readonly api = inject(ApiService);

    private readonly _products = signal<Product[]>([]);
    private readonly _publicProducts = signal<Product[]>([]);

    readonly products = this._products.asReadonly();
    readonly publicProducts = this._publicProducts.asReadonly();

    readonly isLoading = signal(false);
    readonly error = signal<string | null>(null);

    private publicLoaded = false;

    readonly totalItems = signal(0);

    loadProductsAdmin(page: number = 1, pageSize: number = 10): void {
        this.isLoading.set(true);
        this.error.set(null);

        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const params = new URLSearchParams({
            skip: skip.toString(),
            take: take.toString(),
        }).toString();

        this.api.get<any>(`product/admin?${params}`)
            .subscribe({
                next: (response) => {
                    if (Array.isArray(response)) {
                        this._products.set(response);
                        if (response.length >= pageSize) {
                            this.totalItems.set((page * pageSize) + 1);
                        } else {
                            this.totalItems.set(((page - 1) * pageSize) + response.length);
                        }
                    } else if (response && Array.isArray(response.data)) {
                        this._products.set(response.data);
                        const total = response.meta?.total || response.count || response.total || 0;
                        this.totalItems.set(total);
                    }
                    this.isLoading.set(false);
                },
                error: (err) => {
                    console.error('Erro ao carregar produtos admin', err);
                    this.error.set('Não foi possível carregar a lista de produtos do dashboard.');
                    this.isLoading.set(false);
                }
            });
    }

    getPublicPaged(skip = 0, take = 12): Observable<Product[]> {
        const params = new URLSearchParams({ skip: String(skip), take: String(take) }).toString();
        return this.api.get<Product[]>(`product/public?${params}`);
    }

    loadProductsPublic(): void {
        if (this.publicLoaded) return;

        this.isLoading.set(true);
        this.error.set(null);

        this.api.get<Product[]>('product/public')
            .subscribe({
                next: (products) => {
                    this._publicProducts.set(products);
                    this.publicLoaded = true;
                    this.isLoading.set(false);
                },
                error: (err) => {
                    console.error('Erro ao carregar produtos públicos', err);
                    this.error.set('Não foi possível carregar os produtos da loja.');
                    this.isLoading.set(false);
                }
            });
    }

    update(id: string, data: any): Observable<Product> {
        return this.api.patch<Product>(`product/admin/${id}`, data).pipe(
            tap((updatedProduct) => {
                this._products.update(products =>
                    products.map(p => p.id === id ? { ...p, ...updatedProduct } : p)
                );
                this.publicLoaded = false;
            })
        );
    }

    delete(id: string): Observable<void> {
        return this.api.delete<void>(`product/admin/${id}`).pipe(
            tap(() => {
                this._products.update(products =>
                    products.filter(p => p.id !== id)
                );
                this.publicLoaded = false;
            })
        );
    }

    create(data: FormData): Observable<Product> {
        return this.api.post<Product>('product/admin', data).pipe(
            tap((newProduct) => {
                this._products.update(products => [...products, newProduct]);
                this.publicLoaded = false;
            })
        );
    }

    getRelatedPublic(id: string): Observable<Product[]> {
        return this.api.get<Product[]>(`product/public/${id}/related`);
    }
}
