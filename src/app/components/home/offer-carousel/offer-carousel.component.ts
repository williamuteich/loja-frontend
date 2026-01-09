import { Component, ElementRef, ViewChild, inject, OnInit, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-offer-carousel',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage, RouterLink],
    templateUrl: './offer-carousel.component.html',
    styleUrl: './offer-carousel.component.css'
})
export class OfferCarouselComponent implements OnInit {
    private readonly productService = inject(ProductService);

    protected readonly products = computed(() =>
        this.productService.publicProducts().filter(
            p => p.isActive && p.discountPrice && p.discountPrice > 0
        )
    );

    protected readonly backendUrl = environment.BACKEND_URL;

    @ViewChild('scrollContainer', { static: false })
    scrollContainer!: ElementRef<HTMLDivElement>;

    ngOnInit(): void {
        this.productService.loadProductsPublic();
    }

    scroll(direction: 'left' | 'right'): void {
        const container = this.scrollContainer.nativeElement;
        const amount = container.clientWidth * 0.5;
        container.scrollTo({
            left: direction === 'left'
                ? container.scrollLeft - amount
                : container.scrollLeft + amount,
            behavior: 'smooth'
        });
    }

    calculateDiscountPercentage(price: number, discountPrice: number): number {
        return Math.round(((price - discountPrice) / price) * 100);
    }

    protected resolveUrl(url: string): string {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        const backend = this.backendUrl.replace(/\/$/, '');
        const cleanUrl = url.replace(/^\//, '');
        return `${backend}/${cleanUrl}`;
    }
}
