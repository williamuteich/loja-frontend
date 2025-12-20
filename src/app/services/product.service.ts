import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Product } from '../models';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
    private readonly api = inject(ApiService);

    private readonly _products = signal<Product[]>([]);
    readonly products = this._products.asReadonly();

    private loaded = false;

    loadProducts(): void {
        if (this.loaded) return;

        this.api.get<Product[]>('product')
            .subscribe(products => {
                this._products.set(products);
                this.loaded = true;
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
