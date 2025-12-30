import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../models';
import { ProductService } from '../../../services/product.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-home-products-grid',
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  templateUrl: './products-grid.component.html'
})
export class ProductsGridComponent implements OnInit {
  private readonly productService = inject(ProductService);

  protected readonly backendUrl = environment.BACKEND_URL;
  protected readonly products = signal<Product[]>([]);

  ngOnInit(): void {
    this.productService.getPublicPaged(0, 12).subscribe({
      next: (items) => this.products.set(items ?? []),
      error: (err) => {
        console.error('Erro ao carregar produtos da seção Nossos produtos', err);
        this.products.set([]);
      }
    });
  }
}
