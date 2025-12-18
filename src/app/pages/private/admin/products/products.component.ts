import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, SquarePen, Trash2, Filter, Eye } from 'lucide-angular';
import { AdminSearchComponent } from '../../../../components/admin-search/admin-search.component';
import { ApiService } from '../../../../services/api.service';
import { Product } from '../../../../models';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-products',
  imports: [CommonModule, LucideAngularModule, AdminSearchComponent],
  templateUrl: './products.component.html'
})
export class ProductsComponent {
  private readonly api = inject(ApiService);
  readonly backendUrl = environment.BACKEND_URL;

  readonly Plus = Plus;
  readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;
  readonly Filter = Filter;
  readonly Eye = Eye;

  products: Product[] = [];

  constructor() {
    this.api.get<Product[]>('product').subscribe(data => {
      this.products = data;
    });
  }
}
