import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, Package, SquarePen, Trash2 } from 'lucide-angular';
import { AdminSearchComponent } from '../../../../components/admin-search/admin-search.component';
import { BrandService } from '../../../../services/brand.service';
import { GenericModal } from '../../../../components/generic-modal/generic-modal';
import { BrandForm } from '../../../../components/modals/brand-form/brand-form';
import { DeleteConfirmationComponent } from '../../../../components/modals/delete-confirmation/delete-confirmation.component';
import { Brand } from '../../../../models';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AdminSearchComponent, GenericModal, BrandForm, DeleteConfirmationComponent],
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

  isLoading = signal(false);

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
      this.isLoading.set(true);
      this.brandService.delete(id).subscribe({
        next: () => {
          this.isDeleteModalVisible.set(false);
          this.brandToDelete.set(undefined);
          this.isLoading.set(false);
          this.brandService.loadBrands();
        },
        error: (err) => {
          console.error(err);
          this.isLoading.set(false);
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

    this.isLoading.set(true);

    const formValue = brandForm.getFormValue();

    this.brandService.update(brandId, formValue).subscribe({
      next: () => {
        this.closeModal();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao atualizar marca:', err);
        this.isLoading.set(false);
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
