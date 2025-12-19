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

    public getCategories() {
        if (this.loaded) return;

        this.api.get<Category[]>('/categories').subscribe({
            next: (categories) => {
                this._categories.set(categories);
                this.loaded = true;
            }
        })
    }
}