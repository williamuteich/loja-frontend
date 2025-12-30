import { Component, inject, OnInit, ViewChild, ElementRef, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-offer-carousel',
    imports: [CommonModule, NgOptimizedImage, RouterLink],
    templateUrl: './offer-carousel.component.html',
    styleUrl: './offer-carousel.component.css'
})
export class OfferCarouselComponent implements OnInit {
    private readonly productService = inject(ProductService);

    protected readonly products = computed(() =>
        this.productService
            .publicProducts()
            .filter(p => p.isActive && !!p.discountPrice && p.discountPrice > 0)
    );

    protected readonly backendUrl = environment.BACKEND_URL;

    @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

    ngOnInit(): void {
        this.productService.loadProductsPublic();
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

    calculateDiscountPercentage(price: number, discountPrice: number): number {
        if (!price || !discountPrice || price <= discountPrice) return 0;
        return Math.round(((price - discountPrice) / price) * 100);
    }
}
