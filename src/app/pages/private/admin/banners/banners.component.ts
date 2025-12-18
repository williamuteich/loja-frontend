import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, GripVertical, Eye, EyeOff, SquarePen, Trash2 } from 'lucide-angular';
import { AdminSearchComponent } from '../../../../components/admin-search/admin-search.component';
import { BannerService } from '../../../../services/banner.service';
import { NgOptimizedImage } from '@angular/common';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-banners',
  imports: [CommonModule, LucideAngularModule, AdminSearchComponent, NgOptimizedImage],
  templateUrl: './banners.component.html'
})
export class BannersComponent implements OnInit {
  private readonly bannerService = inject(BannerService);
  protected readonly banners = this.bannerService.banners;
  readonly backendUrl = environment.BACKEND_URL;
  readonly Plus = Plus;
  readonly GripVertical = GripVertical;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;

  ngOnInit(): void {
    this.bannerService.loadBanners();
  }
}
