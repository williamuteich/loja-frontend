import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LucideAngularModule, Plus, SquarePen, Trash2 } from 'lucide-angular';
import { BannerService } from '../../../../services/banner.service';
import { Banner } from '../../../../models';
import { environment } from '../../../../../environments/environment';
import { signal } from '@angular/core';
import { AdminSearchComponent } from '../../../../components/dashboard/admin-search/admin-search.component';
import { GenericModal } from '../../../../components/dashboard/generic-modal/generic-modal';
import { BannerForm } from '../../../../components/dashboard/modals/banner-form/banner-form';
import { SkeletonBannerComponent } from '../../../../components/dashboard/skeleton/banner/skeletonBanner.component';
import { EmptyStateComponent } from '../../../../components/dashboard/empty-state/empty-state.component';

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
    SkeletonBannerComponent,
    EmptyStateComponent
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
  isSaving = signal(false);
  isLoading = this.bannerService.isLoading;
  error = this.bannerService.error;

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

    this.isSaving.set(true);

    const formValue = bannerForm.getFormValue();

    this.bannerService.update(bannerId, formValue).subscribe({
      next: () => {
        this.bannerService.loadBanners();
        this.closeModal();
        this.isSaving.set(false);
      },
      error: (err) => {
        console.error('Erro ao atualizar banner:', err);
        this.isSaving.set(false);
      }
    });
  }
}