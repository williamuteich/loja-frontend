import { inject, Injectable, signal } from "@angular/core";
import { ApiService } from "./api.service";
import { Category } from "../models";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private readonly api = inject(ApiService)

    private readonly _categories = signal<Category[]>([]);
    readonly categories = this._categories.asReadonly();

    private loaded = false;

    public loadCategories() {
        if (this.loaded) return;

        this.api.get<Category[]>('category').subscribe({
            next: (category) => {
                this._categories.set(category);
                this.loaded = true;
            }
        })
    }

    update(id: string, data: Partial<Category>) {
        this.api.patch<Category>(`category/${id}`, data).subscribe((updatedCategory: Category) => {
            this._categories.update(categories =>
                categories.map(c => c.id === id ? updatedCategory : c)
            );
        });
    }
}