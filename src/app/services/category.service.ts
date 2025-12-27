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

    private adminLoaded = false;
    private publicLoaded = false;

    public loadCategoriesAdmin(): void {
        if (this.adminLoaded) return;

        this.isLoading.set(true);
        this.error.set(null);

        this.api.get<Category[]>('category/admin').subscribe({
            next: (categories) => {
                this._categories.set(categories);
                this.adminLoaded = true;
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Erro ao carregar categorias admin', err);
                this.error.set('Não foi possível carregar a lista de categorias do dashboard.');
                this.isLoading.set(false);
            }
        });
    }

    public loadCategoriesPublic(): void {
        if (this.publicLoaded) return;

        this.isLoading.set(true);
        this.error.set(null);

        this.api.get<Category[]>('category/public').subscribe({
            next: (categories) => {
                this._publicCategories.set(categories);
                this.publicLoaded = true;
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