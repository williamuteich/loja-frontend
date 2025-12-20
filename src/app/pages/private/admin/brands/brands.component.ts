import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, Package, SquarePen, Trash2 } from 'lucide-angular';
import { AdminSearchComponent } from '../../../../components/admin-search/admin-search.component';
import { BrandService } from '../../../../services/brand.service';
import { GenericModal } from '../../../../components/generic-modal/generic-modal';
import { BrandForm } from '../../../../components/brand-form/brand-form';
import { Brand } from '../../../../models';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AdminSearchComponent, GenericModal, BrandForm],
  templateUrl: './brands.component.html'
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
