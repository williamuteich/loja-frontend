import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchService {
    private readonly _searchTerm = signal<string>('');
    private readonly _isLoading = signal(false);

    readonly searchTerm = this._searchTerm.asReadonly();
    readonly isLoading = this._isLoading.asReadonly();
    readonly isSearchActive = computed(() => this._searchTerm().trim().length > 0);

    setSearchTerm(term: string): void {
        this._searchTerm.set(term);
    }

    setLoading(loading: boolean): void {
        this._isLoading.set(loading);
    }

    clearSearch(): void {
        this._searchTerm.set('');
    }
}
