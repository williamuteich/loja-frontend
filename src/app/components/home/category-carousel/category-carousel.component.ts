import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { environment } from '../../../../environments/environment';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';

@Component({
    selector: 'app-category-carousel',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage, RouterModule, LucideAngularModule],
    templateUrl: './category-carousel.component.html',
    styleUrls: ['./category-carousel.component.css']
})
export class CategoryCarouselComponent implements OnInit {
    protected readonly categoryService = inject(CategoryService);
    protected readonly categories = this.categoryService.publicCategories;
    protected readonly isLoading = this.categoryService.isLoading;
    protected readonly backendUrl = environment.BACKEND_URL;

    readonly ChevronLeft = ChevronLeft;
    readonly ChevronRight = ChevronRight;

    @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

    ngOnInit(): void {
        this.categoryService.loadCategoriesPublic();
    }

    scroll(direction: 'left' | 'right'): void {
        const container = this.scrollContainer.nativeElement;
        const cardWidth = container.querySelector('a')?.clientWidth || 200;
        const visibleWidth = container.clientWidth;
        const scrollAmount = visibleWidth * 0.85;

        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    }
}
