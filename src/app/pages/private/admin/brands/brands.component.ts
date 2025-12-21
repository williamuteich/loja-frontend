import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, Package, SquarePen, Trash2 } from 'lucide-angular';
import { AdminSearchComponent } from '../../../../components/dashboard/admin-search/admin-search.component';
import { BrandService } from '../../../../services/brand.service';
import { GenericModal } from '../../../../components/dashboard/generic-modal/generic-modal';
import { Brand } from '../../../../models';
import { BrandForm } from '../../../../components/dashboard/modals/brand-form/brand-form';
import { DeleteConfirmationComponent } from '../../../../components/dashboard/modals/delete-confirmation/delete-confirmation.component';
import { SkeletonTableComponent } from '../../../../components/dashboard/skeleton/form/skeletonForm.component';
import { EmptyStateComponent } from '../../../../components/dashboard/empty-state/empty-state.component';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AdminSearchComponent, GenericModal, BrandForm, DeleteConfirmationComponent, SkeletonTableComponent, EmptyStateComponent],
  templateUrl: 'brands.component.html'
})
export class BrandsComponent implements OnInit {
  readonly Plus = Plus;
  readonly Package = Package;
  readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;

  private readonly brandService = inject(BrandService);
  protected readonly brands = this.brandService.brands;

  isModalVisible = signal(false);
  selectedBrand = signal<Brand | undefined>(undefined);

  isDeleteModalVisible = signal(false);
  brandToDelete = signal<Brand | undefined>(undefined);

  isSaving = signal(false);
  isLoading = this.brandService.isLoading;
  error = this.brandService.error;

  ngOnInit(): void {
    this.brandService.loadBrands();
  }

  openEditModal(brand: Brand): void {
    this.selectedBrand.set(brand);
    this.isModalVisible.set(true);
  }

  closeModal(): void {
    this.isModalVisible.set(false);
    this.selectedBrand.set(undefined);
  }

  openDeleteModal(brand: Brand): void {
    this.brandToDelete.set(brand);
    this.isDeleteModalVisible.set(true);
  }

  confirmDelete(): void {
    const id = this.brandToDelete()?.id;
    if (id) {
      this.isSaving.set(true);
      this.brandService.delete(id).subscribe({
        next: () => {
          this.isDeleteModalVisible.set(false);
          this.brandToDelete.set(undefined);
          this.isSaving.set(false);
          this.brandService.loadBrands();
        },
        error: (err) => {
          console.error(err);
          this.isSaving.set(false);
        }
      });
    }
  }

  handleSave(brandForm: BrandForm): void {
    if (!brandForm.isValid()) {
      console.error("Formulário inválido!");
      return;
    }

    const brandId = this.selectedBrand()?.id;
    if (!brandId) {
      console.error("Brand ID não encontrado!");
      return;
    }

    this.isSaving.set(true);

    const formValue = brandForm.getFormValue();

    this.brandService.update(brandId, formValue).subscribe({
      next: () => {
        this.closeModal();
        this.isSaving.set(false);
      },
      error: (err) => {
        console.error('Erro ao atualizar marca:', err);
        this.isSaving.set(false);
      }
    });
  }

  protected getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}
