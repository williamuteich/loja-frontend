import { Component, inject, computed, effect } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SearchService } from '../../../services/search.service';
import { ProductService } from '../../../services/product.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-search-results',
    imports: [CommonModule, RouterLink, NgOptimizedImage],
    templateUrl: './search-results.component.html',
    styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent {
    protected readonly searchService = inject(SearchService);
    protected readonly productService = inject(ProductService);

    protected readonly searchTerm = this.searchService.searchTerm;
    protected readonly results = this.productService.publicProducts;
    protected readonly isLoading = this.productService.isLoading;
    protected readonly backendUrl = environment.BACKEND_URL;

    protected readonly hasResults = computed(() => this.results().length > 0);

    constructor() {
        effect(() => {
            const loading = this.productService.isLoading();
            if (!loading) {
                this.searchService.setLoading(false);
            }
        });
    }

    protected getImageUrl(images: { url: string }[] | undefined): string {
        if (!images || !images.length) return 'assets/placeholder-product.png';
        const imageUrl = images[0].url;
        if (imageUrl.startsWith('http')) return imageUrl;
        return `${this.backendUrl}/${imageUrl}`;
    }

    protected clearSearch() {
        this.searchService.clearSearch();
    }
}
