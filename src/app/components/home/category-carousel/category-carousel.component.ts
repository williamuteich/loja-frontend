import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { environment } from '../../../../environments/environment';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';

@Component({
    selector: 'app-category-carousel',
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
        const scrollAmount = container.clientWidth * 0.5;
        const targetScrollLeft = direction === 'left'
            ? Math.max(0, container.scrollLeft - scrollAmount)
            : Math.min(container.scrollWidth - container.clientWidth, container.scrollLeft + scrollAmount);

        this.smoothScrollTo(container, targetScrollLeft, 600);
    }



    private smoothScrollTo(element: HTMLElement, target: number, duration: number): void {
        const start = element.scrollLeft;
        const change = target - start;
        const startTime = performance.now();

        const animateScroll = (currentTime: number) => {
            const elapsed = currentTime - startTime;

            if (elapsed < duration) {
                const t = elapsed / duration;
                const ease = t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

                element.scrollLeft = start + change * ease;
                requestAnimationFrame(animateScroll);
            } else {
                element.scrollLeft = target;
            }
        };

        requestAnimationFrame(animateScroll);
    }
}
