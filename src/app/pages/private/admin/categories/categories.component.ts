import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, FolderTree, SquarePen, Trash2 } from 'lucide-angular';
import { AdminSearchComponent } from '../../../../components/dashboard/admin-search/admin-search.component';
import { CategoryService } from '../../../../services/category.service';
import { environment } from '../../../../../environments/environment';
import { GenericModal } from '../../../../components/dashboard/generic-modal/generic-modal';
import { Category } from '../../../../models';
import { CategoryForm } from '../../../../components/dashboard/modals/category-form/category-form';
import { EmptyStateComponent } from '../../../../components/dashboard/empty-state/empty-state.component';
import { SkeletonCategoryComponent } from '../../../../components/dashboard/skeleton/category/skeleton-category.component';
import { DeleteConfirmationComponent } from '../../../../components/dashboard/modals/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AdminSearchComponent, GenericModal, CategoryForm, EmptyStateComponent, SkeletonCategoryComponent, DeleteConfirmationComponent],
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {
  readonly Plus = Plus;
  readonly FolderTree = FolderTree;
  readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;

  private readonly categoryService = inject(CategoryService);
  protected readonly categories = this.categoryService.categories;
  protected readonly backendUrl = environment.BACKEND_URL;

  isModalVisible = signal(false);
  selectedCategory = signal<Category | undefined>(undefined);

  isDeleteModalVisible = signal(false);
  categoryToDelete = signal<Category | undefined>(undefined);

  isSaving = signal(false);
  isLoading = this.categoryService.isLoading;
  error = this.categoryService.error;

  ngOnInit(): void {
    this.categoryService.loadCategoriesAdmin();
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
          this.categoryService.loadCategoriesAdmin();
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

    const categoryId = this.selectedCategory()?.id;
    if (!categoryId) {
      console.error("Category ID não encontrado!");
      return;
    }

    this.isSaving.set(true);

    const formValue = categoryForm.getFormValue();

    console.log('Sending payload:', formValue);

    this.categoryService.update(categoryId, formValue).subscribe({
      next: () => {
        this.closeModal();
        this.isSaving.set(false);
      },
      error: (err) => {
        console.error('Erro ao atualizar categoria:', err);
        this.isSaving.set(false);
      }
    });
  }
}
