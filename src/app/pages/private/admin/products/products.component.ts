import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, SquarePen, Trash2, Filter, Eye } from 'lucide-angular';
import { AdminSearchComponent } from '../../../../components/dashboard/admin-search/admin-search.component';
import { ProductService } from '../../../../services/product.service';
import { environment } from '../../../../../environments/environment';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { SkeletonTableComponent } from '../../../../components/dashboard/skeleton/form/skeletonForm.component';
import { EmptyStateComponent } from '../../../../components/dashboard/empty-state/empty-state.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AdminSearchComponent, NgOptimizedImage, SkeletonTableComponent, EmptyStateComponent],
  templateUrl: './products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  readonly backendUrl = environment.BACKEND_URL;
  readonly products = this.productService.products;
  readonly isLoading = this.productService.isLoading;
  readonly error = this.productService.error;

  protected readonly Plus = Plus;
  protected readonly SquarePen = SquarePen;
  protected readonly Trash2 = Trash2;
  protected readonly Filter = Filter;
  protected readonly Eye = Eye;

  ngOnInit() {
    this.productService.loadProducts();
  }

  openEditPage(productId: string) {
    this.router.navigate(['/dashboard/products/edit', productId]);
  }
}
