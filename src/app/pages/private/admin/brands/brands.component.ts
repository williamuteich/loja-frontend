import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, Package, SquarePen, Trash2 } from 'lucide-angular';
import { AdminSearchComponent } from '../../../../components/admin-search/admin-search.component';
import { BrandService } from '../../../../services/brand.service';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AdminSearchComponent],
  templateUrl: './brands.component.html'
})
export class BrandsComponent implements OnInit {
  readonly Plus = Plus;
  readonly Package = Package;
  readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;

  private readonly brandService = inject(BrandService);
  protected readonly brands = this.brandService.brands;

  ngOnInit(): void {
    this.brandService.loadBrands();
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
