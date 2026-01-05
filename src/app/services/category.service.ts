import { inject, Injectable, signal } from "@angular/core";
import { ApiService } from "./api.service";
import { Category } from "../models";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private readonly api = inject(ApiService)

    private readonly _categories = signal<Category[]>([]);
    private readonly _publicCategories = signal<Category[]>([]);

    readonly categories = this._categories.asReadonly();
    readonly publicCategories = this._publicCategories.asReadonly();

    readonly isLoading = signal(false);
    readonly error = signal<string | null>(null);

    readonly totalItems = signal(0);
    private publicLoaded = false;

    public loadCategoriesAdmin(page: number = 1, pageSize: number = 10): void {
        this.isLoading.set(true);
        this.error.set(null);

        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const params = new URLSearchParams({
            skip: skip.toString(),
            take: take.toString(),
        }).toString();

        this.api.get<any>(`category/admin?${params}`).subscribe({
            next: (response) => {
                if (Array.isArray(response)) {
                    this._categories.set(response);
                    if (response.length >= pageSize) {
                        this.totalItems.set((page * pageSize) + 1);
                    } else {
                        this.totalItems.set(((page - 1) * pageSize) + response.length);
                    }
                } else if (response && Array.isArray(response.data)) {
                    this._categories.set(response.data);
                    const total = response.meta?.total || response.count || response.total || 0;
                    this.totalItems.set(total);
                }
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Erro ao carregar categorias admin', err);
                this.error.set('Não foi possível carregar a lista de categorias do dashboard.');
                this.isLoading.set(false);
            }
        });
    }

    public loadCategoriesPublic(page: number = 1, pageSize: number = 10): void {
        this.isLoading.set(true);
        this.error.set(null);

        const skip = (page - 1) * pageSize;
        const take = pageSize + 1;

        const params = new URLSearchParams({
            skip: skip.toString(),
            take: take.toString(),
        }).toString();

        this.api.get<any>(`category/public?${params}`).subscribe({
            next: (response) => {
                let items: Category[] = [];
                let hasNextPage = false;
                let total = 0;

                if (Array.isArray(response)) {
                    if (response.length > pageSize) {
                        hasNextPage = true;
                        items = response.slice(0, pageSize);
                    } else {
                        items = response;
                    }
                } else if (response && Array.isArray(response.data)) {
                    if (response.meta?.total !== undefined || response.count !== undefined || response.total !== undefined) {
                        total = response.meta?.total || response.count || response.total || 0;
                        items = response.data;
                        this._publicCategories.set(items);
                        this.totalItems.set(total);
                        this.isLoading.set(false);
                        return;
                    }
                    if (response.data.length > pageSize) {
                        hasNextPage = true;
                        items = response.data.slice(0, pageSize);
                    } else {
                        items = response.data;
                    }
                }

                this._publicCategories.set(items);

                if (hasNextPage) {
                    this.totalItems.set((page * pageSize) + 1);
                } else {
                    this.totalItems.set(((page - 1) * pageSize) + items.length);
                }

                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Erro ao carregar categorias públicas', err);
                this.error.set('Não foi possível carregar as categorias da loja.');
                this.isLoading.set(false);
            }
        });
    }

    public findOnePublic(id: string): Observable<Category> {
        return this.api.get<Category>(`category/public/${id}`);
    }

    update(id: string, data: Partial<Category>): Observable<Category> {
        return this.api.patch<Category>(`category/admin/${id}`, data).pipe(
            tap((updatedCategory) => {
                this._categories.update(categories =>
                    categories.map(c => c.id === id ? { ...updatedCategory, _count: c._count } : c)
                );
                this.publicLoaded = false;
            })
        );
    }

    create(data: FormData): Observable<Category> {
        return this.api.post<Category>('category/admin', data).pipe(
            tap((newCategory) => {
                this._categories.update(categories =>
                    [...categories, { ...newCategory, _count: { products: 0 } }]
                );
                this.publicLoaded = false;
            })
        );
    }

    delete(id: string): Observable<void> {
        return this.api.delete<void>(`category/admin/${id}`).pipe(
            tap(() => {
                this._categories.update(categories =>
                    categories.filter(c => c.id !== id)
                );
                this.publicLoaded = false;
            })
        );
    }
}