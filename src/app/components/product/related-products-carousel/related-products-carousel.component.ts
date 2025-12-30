import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../../models';
import { ProductService } from '../../../services/product.service';
import { environment } from '../../../../environments/environment';
import { RelatedProductsSkeletonComponent } from '../../public/skeleton/related-products/related-products-skeleton.component';

@Component({
  selector: 'app-related-products-carousel',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink, RelatedProductsSkeletonComponent],
  templateUrl: './related-products-carousel.component.html'
})
export class RelatedProductsCarouselComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  readonly relatedProducts = signal<Product[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly hasProducts = computed(() => this.relatedProducts().length > 0);
  readonly backendUrl = environment.BACKEND_URL;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  scroll(direction: 'left' | 'right'): void {
    if (!this.scrollContainer) return;
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
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        element.scrollLeft = start + change * ease;
        requestAnimationFrame(animateScroll);
      } else {
        element.scrollLeft = target;
      }
    };

    requestAnimationFrame(animateScroll);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.isLoading.set(true);
    this.error.set(null);

    this.productService.getRelatedPublic(id).subscribe({
      next: (products: Product[]) => {
        const actives = (products ?? []).filter(p => p.isActive);
        this.relatedProducts.set(actives);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Erro ao carregar produtos relacionados', err);
        this.error.set('Não foi possível carregar produtos relacionados.');
        this.isLoading.set(false);
      }
    });
  }
}
