import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Product } from '../../../models';
import { ProductService } from '../../../services/product.service';
import { StoreConfigService } from '../../../services/store-config.service';
import { RelatedProductsCarouselComponent } from '../../../components/product/related-products-carousel/related-products-carousel.component';
import { ProductSkeletonComponent } from '../../../components/public/skeleton/product/product-skeleton.component';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product',

  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink, RelatedProductsCarouselComponent, ProductSkeletonComponent],
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly productService = inject(ProductService);
  private readonly storeConfigService = inject(StoreConfigService);

  private readonly selectedProduct = signal<Product | null>(null);
  readonly product = computed(() => this.selectedProduct());
  readonly notFound = signal(false);

  readonly selectedVariant = signal<any>(null);
  readonly quantity = signal(1);
  readonly selectedImageIndex = signal(0);

  readonly specs = computed(() => {
    const p = this.selectedProduct();
    if (!p || !p.specs) return [] as { key: string; value: any }[];
    return Object.entries(p.specs).map(([key, value]) => ({ key, value }));
  });

  readonly variants = computed(() => this.selectedProduct()?.variants ?? []);
  readonly images = computed(() => this.selectedProduct()?.images ?? []);

  selectImage(index: number): void {
    const imgs = this.images();
    if (!imgs || index < 0 || index >= imgs.length) return;
    this.selectedImageIndex.set(index);
  }

  readonly totalQuantity = computed(() => {
    const variants: any[] = this.selectedProduct()?.variants ?? [];
    return variants.reduce((sum, v) => sum + (v?.quantity ?? 0), 0);
  });

  readonly backendUrl = environment.BACKEND_URL;

  constructor() {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('id');
      const products = this.productService.publicProducts();
      const isLoading = this.productService.isLoading();

      if (!id) {
        this.notFound.set(true);
        return;
      }

      if (isLoading) {
        return;
      }

      // Terminou de carregar e não há nenhum produto público: redireciona
      if (!products || products.length === 0) {
        this.notFound.set(true);
        return;
      }

      const found = products.find(p => p.id === id) ?? null;

      if (!found) {
        this.notFound.set(true);
        return;
      }

      this.notFound.set(false);
      this.selectedProduct.set(found);

      if (found?.variants?.length) {
        this.selectedVariant.set(found.variants[0]);
      }

      if (found?.images?.length) {
        this.selectedImageIndex.set(0);
      }
    });
  }

  ngOnInit(): void {
    this.productService.loadProductsPublic();
  }

  selectVariant(variant: any): void {
    this.selectedVariant.set(variant);

    if (!variant) {
      this.quantity.set(1);
      return;
    }

    const max = variant.quantity ?? 0;
    const current = this.quantity();

    if (max <= 0) {
      this.quantity.set(0);
    } else if (current > max) {
      this.quantity.set(max);
    } else if (current < 1) {
      this.quantity.set(1);
    }
  }

  decreaseQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  increaseQuantity(): void {
    if (this.selectedVariant() && this.quantity() < this.selectedVariant().quantity) {
      this.quantity.update(q => q + 1);
    }
  }

  addToCart(): void {
    console.log('Added to cart:', {
      product: this.product(),
      variant: this.selectedVariant(),
      quantity: this.quantity()
    });
  }

  toggleFavorite(): void {
    console.log('Toggled favorite for:', this.product());
  }

  contactViaWhatsApp(): void {
    const product = this.product();
    const variant = this.selectedVariant();
    const quantity = this.quantity();
    const config = this.storeConfigService.config();

    if (!product) {
      return;
    }

    const phoneRaw = config?.whatsapp || config?.phone || '';
    const phone = phoneRaw.replace(/\D/g, '');

    const parts: string[] = [];
    parts.push(`Olá, tenho interesse no produto: ${product.title}`);
    if (variant) {
      parts.push(`Formato/variante: ${variant.color || variant.name || ''}`.trim());
    }
    parts.push(`Quantidade: ${quantity}`);

    const urlProduct = this.backendUrl + '/produto/' + product.id;
    parts.push(`Link do produto: ${urlProduct}`);

    const message = encodeURIComponent(parts.join('\n'));

    const waBase = phone ? `https://wa.me/${phone}` : 'https://wa.me/';
    const waUrl = `${waBase}?text=${message}`;

    window.open(waUrl, '_blank');
  }
}