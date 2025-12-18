import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, GripVertical, Eye, EyeOff, SquarePen, Trash2 } from 'lucide-angular';
import { AdminSearchComponent } from '../../../../components/admin-search/admin-search.component';

@Component({
  selector: 'app-banners',
  imports: [CommonModule, LucideAngularModule, AdminSearchComponent],
  templateUrl: './banners.component.html'
})
export class BannersComponent {
  readonly Plus = Plus;
  readonly GripVertical = GripVertical;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;

  banners = [
    {
      id: 1,
      title: 'Promoção de Verão',
      position: 'Hero Principal',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=100&fit=crop',
      clicks: 1234,
      status: 'active'
    },
    {
      id: 2,
      name: 'Nova Coleção Skincare',
      title: 'Nova Coleção Skincare',
      position: 'Banner Lateral',
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=100&fit=crop',
      clicks: 856,
      status: 'active'
    },
    {
      id: 3,
      title: 'Frete Grátis',
      position: 'Topo',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=100&fit=crop',
      clicks: 432,
      status: 'inactive'
    }
  ];
}
