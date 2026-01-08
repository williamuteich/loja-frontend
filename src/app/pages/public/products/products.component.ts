import { Component, inject, OnInit, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { environment } from '../../../../environments/environment';
import { PaginationComponent } from '../../../components/dashboard/pagination/admin-pagination.component';
import { LucideAngularModule, Grid3x3, LayoutList, Heart, ShoppingBag } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-products',
    imports: [CommonModule, RouterLink, PaginationComponent, LucideAngularModule, FormsModule],
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
    private readonly productService = inject(ProductService);
    private readonly categoryService = inject(CategoryService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    protected readonly products = this.productService.publicProducts;
    protected readonly categories = this.categoryService.publicCategories;
    protected readonly isLoading = this.productService.isLoading;
    protected readonly totalItems = this.productService.totalItems;
    protected readonly backendUrl = environment.BACKEND_URL;

    protected readonly viewMode = signal<'grid' | 'list'>('grid');
    protected readonly selectedCategory = signal<string | null>(null);
    protected readonly searchTerm = signal<string>('');

    protected readonly pageSize = 12;
    protected readonly pageIndex = signal(0);

    readonly icons = {
        Grid3x3, LayoutList, Heart, ShoppingBag
    };

    constructor() {
        effect(() => {
            const params = this.route.snapshot.queryParams;
            if (params['categoria']) {
                this.selectedCategory.set(params['categoria']);
            } else {
                this.selectedCategory.set(null);
            }
        });
    }

    ngOnInit(): void {
        this.categoryService.loadCategoriesPublic(1, 100);

        this.route.queryParams.subscribe(params => {
            if (params['categoria']) {
                this.selectedCategory.set(params['categoria']);
            } else {
                this.selectedCategory.set(null);
            }

            if (params['page']) {
                this.pageIndex.set(Number(params['page']) - 1);
            }

            this.loadProducts();
        });
    }

    loadProducts(): void {
        this.productService.loadProductsPublic(
            this.pageIndex() + 1,
            this.pageSize,
            this.selectedCategory(),
            this.searchTerm()
        );
    }

    onPageChange(index: number): void {
        this.pageIndex.set(index);
        this.updateUrl();
    }

    onCategorySelect(categoryName: string | null): void {
        this.selectedCategory.set(categoryName);
        this.pageIndex.set(0);
        this.updateUrl();
    }

    toggleViewMode(mode: 'grid' | 'list'): void {
        this.viewMode.set(mode);
    }

    private updateUrl(): void {
        const queryParams: any = {};

        if (this.selectedCategory()) {
            queryParams.categoria = this.selectedCategory();
        } else {
            queryParams.categoria = null;
        }

        if (this.pageIndex() > 0) {
            queryParams.page = this.pageIndex() + 1;
        } else {
            queryParams.page = null;
        }

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: queryParams,
            queryParamsHandling: 'merge',
        });
    }
}
