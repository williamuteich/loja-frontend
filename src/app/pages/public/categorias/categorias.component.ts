import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-categorias',
    imports: [CommonModule, RouterLink, NgOptimizedImage],
    templateUrl: './categorias.component.html',
    styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
    protected readonly categoryService = inject(CategoryService);
    protected readonly categories = this.categoryService.publicCategories;
    protected readonly isLoading = this.categoryService.isLoading;
    protected readonly backendUrl = environment.BACKEND_URL;

    ngOnInit(): void {
        this.categoryService.loadCategoriesPublic();
    }
}

