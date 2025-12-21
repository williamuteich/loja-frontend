import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Product } from '../models';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
    private readonly api = inject(ApiService);

    private readonly _products = signal<Product[]>([]);
    readonly products = this._products.asReadonly();
    readonly isLoading = signal(false);
    readonly error = signal<string | null>(null);

    private loaded = false;

    loadProducts(): void {
        if (this.loaded) return;

        this.isLoading.set(true);
        this.error.set(null);

        this.api.get<Product[]>('product')
            .subscribe({
                next: (products) => {
                    this._products.set(products);
                    this.loaded = true;
                    this.isLoading.set(false);
                },
                error: (err) => {
                    console.error('Erro ao carregar produtos', err);
                    this.error.set('Não foi possível carregar a lista de produtos.');
                    this.isLoading.set(false);
                }
            });
    }

    update(id: string, data: any): Observable<Product> {
        return this.api.patch<Product>(`product/${id}`, data).pipe(
            tap((updatedProduct) => {
                this._products.update(products =>
                    products.map(p => p.id === id ? { ...p, ...updatedProduct } : p)
                );
            })
        );
    }
}
