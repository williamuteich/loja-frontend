import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LucideAngularModule, Plus, SquarePen, Trash2 } from 'lucide-angular';
import { BannerService } from '../../../../services/banner.service';
import { Banner } from '../../../../models';
import { environment } from '../../../../../environments/environment';
import { signal } from '@angular/core';

import { AdminSearchComponent } from '../../../../components/admin-search/admin-search.component';
import { GenericModal } from '../../../../components/generic-modal/generic-modal';
import { BannerForm } from '../../../../components/modals/banner-form/banner-form';

@Component({
  selector: 'app-banners',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    AdminSearchComponent,
    NgOptimizedImage,
    GenericModal,
    BannerForm,
  ],
  templateUrl: './banners.component.html',
})
export class BannersComponent implements OnInit {
  private readonly bannerService = inject(BannerService);
  protected readonly banners = this.bannerService.banners;
  readonly backendUrl = environment.BACKEND_URL;

  readonly Plus = Plus;
  readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;

  isModalVisible = signal(false);
  selectedBanner = signal<Banner | undefined>(undefined);
  isLoading = signal(false);

  ngOnInit(): void {
    this.bannerService.loadBanners();
  }

  openEditModal(banner: Banner): void {
    this.selectedBanner.set(banner);
    this.isModalVisible.set(true);
  }

  closeModal(): void {
    this.isModalVisible.set(false);
    this.selectedBanner.set(undefined);
  }

  handleSave(bannerForm: BannerForm): void {
    if (!bannerForm.isValid()) {
      console.error("Formulário inválido!");
      return;
    }

    const bannerId = this.selectedBanner()?.id;
    if (!bannerId) {
      console.error("Banner ID não encontrado!");
      return;
    }

    this.isLoading.set(true);

    const formValue = bannerForm.getFormValue();

    this.bannerService.update(bannerId, formValue).subscribe({
      next: () => {
        this.bannerService.loadBanners();
        this.closeModal();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao atualizar banner:', err);
        this.isLoading.set(false);
      }
    });
  }
}