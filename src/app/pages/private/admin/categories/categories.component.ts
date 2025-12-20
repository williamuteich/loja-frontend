import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, FolderTree, SquarePen, Trash2 } from 'lucide-angular';
import { AdminSearchComponent } from '../../../../components/admin-search/admin-search.component';
import { CategoryService } from '../../../../services/category.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AdminSearchComponent],
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

  ngOnInit(): void {
    this.categoryService.loadCategories();
  }
}
