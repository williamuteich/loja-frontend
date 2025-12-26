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

    private adminLoaded = false;
    private publicLoaded = false;

    loadProductsAdmin(): void {
        if (this.adminLoaded) return;

        this.isLoading.set(true);
        this.error.set(null);

        this.api.get<Product[]>('product/admin')
            .subscribe({
                next: (products) => {
                    this._products.set(products);
                    this.adminLoaded = true;
                    this.isLoading.set(false);
                },
                error: (err) => {
                    console.error('Erro ao carregar produtos admin', err);
                    this.error.set('Não foi possível carregar a lista de produtos do dashboard.');
                    this.isLoading.set(false);
                }
            });
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
}
