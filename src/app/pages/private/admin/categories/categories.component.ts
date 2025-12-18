import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Search, Plus, FolderTree, SquarePen, Trash2 } from 'lucide-angular';
import { AdminSearchComponent } from '../../../../components/admin-search/admin-search.component';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, LucideAngularModule, AdminSearchComponent],
  templateUrl: './categories.component.html'
})
export class CategoriesComponent {
  readonly Search = Search;
  readonly Plus = Plus;
  readonly FolderTree = FolderTree;
  readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;

  categories = [
    {
      id: 1,
      name: 'Skincare',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop',
      count: 45,
      status: 'active'
    },
    {
      id: 2,
      name: 'Maquiagem',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=800&fit=crop',
      count: 32,
      status: 'active'
    },
    {
      id: 3,
      name: 'Cabelos',
      image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&h=800&fit=crop',
      count: 28,
      status: 'active'
    },
    {
      id: 4,
      name: 'Perfumaria',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=800&fit=crop',
      count: 18,
      status: 'active'
    },
    {
      id: 5,
      name: 'Corpo & Banho',
      image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=800&h=800&fit=crop',
      count: 24,
      status: 'active'
    },
    {
      id: 6,
      name: 'Unhas',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=800&fit=crop',
      count: 15,
      status: 'inactive'
    }
  ];
}
