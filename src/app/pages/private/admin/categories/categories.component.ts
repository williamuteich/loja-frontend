import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, FolderTree, SquarePen, Trash2 } from 'lucide-angular';
import { AdminSearchComponent } from '../../../../components/dashboard/admin-search/admin-search.component';
import { CategoryService } from '../../../../services/category.service';
import { environment } from '../../../../../environments/environment';
import { GenericModal } from '../../../../components/dashboard/generic-modal/generic-modal';
import { Category } from '../../../../models';
import { CategoryForm } from '../../../../components/dashboard/modals/category-form/category-form';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AdminSearchComponent, GenericModal, CategoryForm],
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
  isLoading = signal(false);

  ngOnInit(): void {
    this.categoryService.loadCategories();
  }

  openEditModal(category: Category): void {
    this.selectedCategory.set(category);
    this.isModalVisible.set(true);
  }

  closeModal(): void {
    this.isModalVisible.set(false);
    this.selectedCategory.set(undefined);
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

    this.isLoading.set(true);

    const formValue = categoryForm.getFormValue();

    this.categoryService.update(categoryId, formValue).subscribe({
      next: () => {
        this.closeModal();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao atualizar categoria:', err);
        this.isLoading.set(false);
      }
    });
  }
}
