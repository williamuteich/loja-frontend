import { Component, inject, ChangeDetectionStrategy, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, SquarePen, Trash2, Filter, Eye } from 'lucide-angular';
import { AdminSearchComponent } from '../../../../components/dashboard/admin-search/admin-search.component';
import { ProductService } from '../../../../services/product.service';
import { environment } from '../../../../../environments/environment';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { SkeletonTableComponent } from '../../../../components/dashboard/skeleton/form/skeletonForm.component';
import { EmptyStateComponent } from '../../../../components/dashboard/empty-state/empty-state.component';
import { DeleteConfirmationComponent } from '../../../../components/dashboard/modals/delete-confirmation/delete-confirmation.component';
import { GenericModal } from '../../../../components/dashboard/modals/edit-modal/generic-modal';
import { PaginationComponent } from '../../../../components/dashboard/pagination/admin-pagination.component';
import { Product } from '../../../../models';

@Component({
  selector: 'app-products',
  imports: [CommonModule, LucideAngularModule, AdminSearchComponent, NgOptimizedImage, SkeletonTableComponent, EmptyStateComponent, DeleteConfirmationComponent, GenericModal, PaginationComponent],
  templateUrl: './products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  readonly BackendUrl = environment.BACKEND_URL;
  readonly products = this.productService.products;
  readonly pageSize = 10;
  readonly pageIndex = signal(0);
  readonly totalItems = this.productService.totalItems;

  readonly isLoading = this.productService.isLoading;
  readonly error = this.productService.error;

  isDeleteModalVisible = signal(false);
  productToDelete = signal<Product | null>(null);
  isSaving = signal(false);

  protected readonly Plus = Plus;
  protected readonly SquarePen = SquarePen;
  protected readonly Trash2 = Trash2;
  protected readonly Filter = Filter;
  protected readonly Eye = Eye;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.loadProductsAdmin(this.pageIndex() + 1, this.pageSize);
  }

  onPageChange(index: number) {
    if (index < 0) return;
    this.pageIndex.set(index);
    this.loadProducts();
  }

  openCreatePage() {
    this.router.navigate(['/dashboard/products/create']);
  }

  openEditPage(productId: string) {
    this.router.navigate(['/dashboard/products/edit', productId]);
  }

  openDeleteModal(product: Product) {
    this.productToDelete.set(product);
    this.isDeleteModalVisible.set(true);
  }

  confirmDelete() {
    const product = this.productToDelete();
    if (!product) return;

    this.isSaving.set(true);
    this.productService.delete(product.id).subscribe({
      next: () => {
        this.isDeleteModalVisible.set(false);
        this.productToDelete.set(null);
        this.isSaving.set(false);
        alert('Conteúdo deletado com sucesso!');
      },
      error: (err: any) => {
        console.error('Error deleting product:', err);
        this.isSaving.set(false);
      }
    });
  }
}
