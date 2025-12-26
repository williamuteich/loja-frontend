import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
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

    protected readonly products = this.productService.publicProducts;
    protected readonly backendUrl = environment.BACKEND_URL;

    @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

    ngOnInit(): void {
        this.productService.loadProductsPublic();
    }

    scroll(direction: 'left' | 'right'): void {
        const container = this.scrollContainer.nativeElement;
        const scrollAmount = container.clientWidth * 0.8;
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    }

    calculateDiscountPercentage(price: number, discountPrice: number): number {
        if (!price || !discountPrice || price <= discountPrice) return 0;
        return Math.round(((price - discountPrice) / price) * 100);
    }
}
