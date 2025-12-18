import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, SquarePen, Trash2, Filter, Eye } from 'lucide-angular';
import { AdminSearchComponent } from '../../../../components/admin-search/admin-search.component';

@Component({
  selector: 'app-products',
  imports: [CommonModule, LucideAngularModule, AdminSearchComponent],
  templateUrl: './products.component.html'
})
export class ProductsComponent {
  readonly Plus = Plus;
  readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;
  readonly Filter = Filter;
  readonly Eye = Eye;

  products = [
    {
      id: 1,
      name: 'Vela Aromática Lavanda',
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop',
      category: 'Aromas',
      brand: 'Natura',
      price: 49.90,
      stock: 45,
      views: 1240,
      status: 'active',
      colors: [
        { name: 'Lavanda', hex: '#E6E6FA' },
        { name: 'Rosa', hex: '#FFB6C1' },
        { name: 'Branco', hex: '#FFFFFF' }
      ]
    },
    {
      id: 2,
      name: 'Kit Cuidados Pessoais',
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop',
      category: 'Cuidados',
      brand: 'Boticário',
      price: 129.90,
      stock: 30,
      views: 856,
      status: 'active',
      colors: []
    },
    {
      id: 3,
      name: 'Porta Joias Elegante',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
      category: 'Presentes',
      brand: '-',
      price: 89.90,
      stock: 25,
      views: 2103,
      status: 'active',
      colors: [
        { name: 'Rosa', hex: '#FFC0CB' },
        { name: 'Preto', hex: '#000000' },
        { name: 'Bege', hex: '#F5F5DC' }
      ]
    },
    {
      id: 4,
      name: 'Quadro Decorativo Floral',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&h=800&fit=crop',
      category: 'Decoração',
      brand: '-',
      price: 79.90,
      stock: 18,
      views: 542,
      status: 'active',
      colors: []
    },
    {
      id: 5,
      name: 'Almofada Bordada Artesanal',
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&h=800&fit=crop',
      category: 'Casa',
      brand: '-',
      price: 69.90,
      stock: 35,
      views: 1120,
      status: 'active',
      colors: [
        { name: 'Creme', hex: '#FFFDD0' },
        { name: 'Cinza', hex: '#808080' }
      ]
    }
  ];
}
