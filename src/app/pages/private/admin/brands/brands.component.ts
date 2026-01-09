import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, Package, SquarePen, Trash2, Search, X } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { BrandService } from '../../../../services/brand.service';
import { GenericModal } from '../../../../components/dashboard/modals/edit-modal/generic-modal';
import { Brand } from '../../../../models';
import { BrandForm } from '../../../../components/dashboard/modals/brand-form/brand-form';
import { DeleteConfirmationComponent } from '../../../../components/dashboard/modals/delete-confirmation/delete-confirmation.component';
import { SkeletonTableComponent } from '../../../../components/dashboard/skeleton/form/skeletonForm.component';
import { EmptyStateComponent } from '../../../../components/dashboard/empty-state/empty-state.component';
import { PaginationComponent } from '../../../../components/dashboard/pagination/admin-pagination.component';

@Component({
  selector: 'app-brands',
  imports: [CommonModule, FormsModule, LucideAngularModule, GenericModal, BrandForm, DeleteConfirmationComponent, SkeletonTableComponent, EmptyStateComponent, PaginationComponent],
  templateUrl: 'brands.component.html'
})
export class BrandsComponent implements OnInit, OnDestroy {
  readonly Plus = Plus;
  readonly Package = Package;
  readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;
  readonly Search = Search;
  readonly X = X;

  private readonly brandService = inject(BrandService);
  protected readonly brands = this.brandService.brands;

  readonly pageSize = 10;
  readonly pageIndex = signal(0);
  readonly totalItems = this.brandService.totalItems;


  isModalVisible = signal(false);
  selectedBrand = signal<Brand | undefined>(undefined);

  isDeleteModalVisible = signal(false);
  brandToDelete = signal<Brand | undefined>(undefined);

  isSaving = signal(false);
  isLoading = this.brandService.isLoading;
  error = this.brandService.error;

  searchInput = signal('');
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor() {
    this.setupSearchDebounce();
  }

  ngOnInit(): void {
    this.loadBrands();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.pageIndex.set(0);
      this.loadBrands();
    });
  }

  protected onSearchInput(value: string): void {
    this.searchInput.set(value);
    this.searchSubject.next(value);
  }

  protected clearSearch(): void {
    this.searchInput.set('');
    this.searchSubject.next('');
  }

  loadBrands(): void {
    const searchTerm = this.searchInput().trim() || undefined;
    this.brandService.loadBrandsAdmin(this.pageIndex() + 1, this.pageSize, searchTerm);
  }

  onPageChange(index: number): void {
    if (index < 0) return;
    this.pageIndex.set(index);
    this.loadBrands();
  }

  openAddModal(): void {
    this.selectedBrand.set(undefined);
    this.isModalVisible.set(true);
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
          this.loadBrands();
          alert('Conteúdo deletado com sucesso!');
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

    this.isSaving.set(true);
    const formValue = brandForm.getFormValue();
    const brandId = this.selectedBrand()?.id;

    if (brandId) {
      this.brandService.update(brandId, formValue).subscribe({
        next: () => {
          this.closeModal();
          this.isSaving.set(false);
          alert('Conteúdo atualizado com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao atualizar marca:', err);
          this.isSaving.set(false);
        }
      });
    } else {
      const payload = {
        name: formValue.name,
        isActive: true,
      };

      const createPayload: any = {
        name: formValue.name
      };

      this.brandService.create(createPayload).subscribe({
        next: () => {
          this.closeModal();
          this.isSaving.set(false);
          alert('Marca criada com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao criar marca:', err);
          this.isSaving.set(false);
        }
      });
    }
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
