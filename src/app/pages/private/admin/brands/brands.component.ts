import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, Package, SquarePen, Trash2 } from 'lucide-angular';
import { AdminSearchComponent } from '../../../../components/admin-search/admin-search.component';

@Component({
  selector: 'app-brands',
  imports: [CommonModule, LucideAngularModule, AdminSearchComponent],
  templateUrl: './brands.component.html'
})
export class BrandsComponent {
  readonly Plus = Plus;
  readonly Package = Package;
  readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;

  brands = [
    {
      id: 1,
      name: 'Natura',
      initials: 'N',
      productsCount: 25,
      status: 'active'
    },
    {
      id: 2,
      name: 'O Boticário',
      initials: 'OB',
      productsCount: 32,
      status: 'active'
    },
    {
      id: 3,
      name: 'MAC',
      initials: 'M',
      productsCount: 18,
      status: 'active'
    },
    {
      id: 4,
      name: 'Lancôme',
      initials: 'L',
      productsCount: 15,
      status: 'active'
    },
    {
      id: 5,
      name: 'Maybelline',
      initials: 'MB',
      productsCount: 28,
      status: 'active'
    },
    {
      id: 6,
      name: 'Vult',
      initials: 'V',
      productsCount: 20,
      status: 'inactive'
    }
  ];
}
