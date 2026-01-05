import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { environment } from '../../../../environments/environment';
import { PaginationComponent } from '../../../components/dashboard/pagination/admin-pagination.component';

@Component({
    selector: 'app-categorias',
    imports: [CommonModule, RouterLink, NgOptimizedImage, PaginationComponent],
    templateUrl: './categorias.component.html',
    styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
    protected readonly categoryService = inject(CategoryService);
    protected readonly categories = this.categoryService.publicCategories;
    protected readonly isLoading = this.categoryService.isLoading;
    protected readonly backendUrl = environment.BACKEND_URL;
    protected readonly totalItems = this.categoryService.totalItems;

    protected readonly pageSize = 10;
    protected readonly pageIndex = signal(0);

    ngOnInit(): void {
        this.loadCategories();
    }

    loadCategories(): void {
        this.categoryService.loadCategoriesPublic(this.pageIndex() + 1, this.pageSize);
    }

    onPageChange(index: number): void {
        this.pageIndex.set(index);
        this.loadCategories();
    }
}

