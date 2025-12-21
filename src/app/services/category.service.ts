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
    readonly categories = this._categories.asReadonly();
    readonly isLoading = signal(false);
    readonly error = signal<string | null>(null);

    private loaded = false;

    public loadCategories() {
        if (this.loaded) return;

        this.isLoading.set(true);
        this.error.set(null);

        this.api.get<Category[]>('category').subscribe({
            next: (category) => {
                this._categories.set(category);
                this.loaded = true;
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Erro ao carregar categorias', err);
                this.error.set('Não foi possível carregar a lista de categorias.');
                this.isLoading.set(false);
            }
        })
    }

    update(id: string, data: Partial<Category>): Observable<Category> {
        return this.api.patch<Category>(`category/${id}`, data).pipe(
            tap((updatedCategory) => {
                this._categories.update(categories =>
                    categories.map(c => c.id === id ? { ...updatedCategory, _count: c._count } : c)
                );
            })
        );
    }
}