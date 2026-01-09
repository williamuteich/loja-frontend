import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, FolderTree, SquarePen, Trash2, Search, X } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { CategoryService } from '../../../../services/category.service';
import { environment } from '../../../../../environments/environment';
import { GenericModal } from '../../../../components/dashboard/modals/edit-modal/generic-modal';
import { Category } from '../../../../models';
import { CategoryForm } from '../../../../components/dashboard/modals/category-form/category-form';
import { EmptyStateComponent } from '../../../../components/dashboard/empty-state/empty-state.component';
import { SkeletonCategoryComponent } from '../../../../components/dashboard/skeleton/category/skeleton-category.component';
import { DeleteConfirmationComponent } from '../../../../components/dashboard/modals/delete-confirmation/delete-confirmation.component';
import { PaginationComponent } from '../../../../components/dashboard/pagination/admin-pagination.component';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, FormsModule, LucideAngularModule, GenericModal, CategoryForm, EmptyStateComponent, SkeletonCategoryComponent, DeleteConfirmationComponent, PaginationComponent],
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit, OnDestroy {
  readonly Plus = Plus;
  readonly FolderTree = FolderTree;
  readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;
  readonly Search = Search;
  readonly X = X;

  private readonly categoryService = inject(CategoryService);
  protected readonly categories = this.categoryService.categories;
  readonly pageSize = 10;
  readonly pageIndex = signal(0);
  readonly totalItems = this.categoryService.totalItems;
  protected readonly backendUrl = environment.BACKEND_URL;

  isModalVisible = signal(false);
  selectedCategory = signal<Category | undefined>(undefined);

  isDeleteModalVisible = signal(false);
  categoryToDelete = signal<Category | undefined>(undefined);

  isSaving = signal(false);
  isLoading = this.categoryService.isLoading;
  error = this.categoryService.error;

  searchInput = signal('');
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor() {
    this.setupSearchDebounce();
  }

  ngOnInit(): void {
    this.loadCategories();
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
      this.loadCategories();
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

  loadCategories(): void {
    const searchTerm = this.searchInput().trim() || undefined;
    this.categoryService.loadCategoriesAdmin(this.pageIndex() + 1, this.pageSize, searchTerm);
  }

  onPageChange(index: number): void {
    if (index < 0) return;
    this.pageIndex.set(index);
    this.loadCategories();
  }


  openAddModal(): void {
    this.selectedCategory.set(undefined);
    this.isModalVisible.set(true);
  }

  openEditModal(category: Category): void {
    this.selectedCategory.set(category);
    this.isModalVisible.set(true);
  }

  closeModal(): void {
    this.isModalVisible.set(false);
    this.selectedCategory.set(undefined);
  }

  openDeleteModal(category: Category): void {
    this.categoryToDelete.set(category);
    this.isDeleteModalVisible.set(true);
  }

  confirmDelete(): void {
    const id = this.categoryToDelete()?.id;
    if (id) {
      this.isSaving.set(true);
      this.categoryService.delete(id).subscribe({
        next: () => {
          this.isDeleteModalVisible.set(false);
          this.categoryToDelete.set(undefined);
          this.isSaving.set(false);
          this.loadCategories();
          alert('Conteúdo deletado com sucesso!');
        },
        error: (err) => {
          console.error(err);
          this.isSaving.set(false);
        }
      });
    }
  }

  handleSave(categoryForm: CategoryForm): void {
    if (!categoryForm.isValid()) {
      console.error("Formulário inválido!");
      return;
    }

    this.isSaving.set(true);
    const formValue = categoryForm.getFormValue();
    const categoryId = this.selectedCategory()?.id;

    if (categoryId) {
      this.categoryService.update(categoryId, formValue).subscribe({
        next: () => {
          this.closeModal();
          this.isSaving.set(false);
          alert('Conteúdo atualizado com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao atualizar categoria:', err);
          this.isSaving.set(false);
        }
      });
    } else {
      const formData = new FormData();
      formData.append('name', formValue.name);

      if (formValue.description && formValue.description.trim().length > 0) {
        formData.append('description', formValue.description);
      }

      if (formValue.isHome) {
        formData.append('isHome', 'true');
      }

      if (!categoryForm.selectedFile) {
        alert('A imagem é obrigatória para criar uma nova categoria!');
        this.isSaving.set(false);
        return;
      }

      formData.append('file', categoryForm.selectedFile);

      this.categoryService.create(formData).subscribe({
        next: () => {
          this.closeModal();
          this.isSaving.set(false);
          alert('Categoria criada com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao criar categoria:', err);
          this.isSaving.set(false);
        }
      });
    }
  }
}
