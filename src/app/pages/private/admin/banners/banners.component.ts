import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LucideAngularModule, Plus, SquarePen, Trash2 } from 'lucide-angular';
import { BannerService } from '../../../../services/banner.service';
import { Banner } from '../../../../models';
import { environment } from '../../../../../environments/environment';
import { signal } from '@angular/core';
import { AdminSearchComponent } from '../../../../components/dashboard/admin-search/admin-search.component';
import { GenericModal } from '../../../../components/dashboard/modals/edit-modal/generic-modal';
import { BannerForm } from '../../../../components/dashboard/modals/banner-form/banner-form';
import { SkeletonBannerComponent } from '../../../../components/dashboard/skeleton/banner/skeletonBanner.component';
import { EmptyStateComponent } from '../../../../components/dashboard/empty-state/empty-state.component';
import { DeleteConfirmationComponent } from '../../../../components/dashboard/modals/delete-confirmation/delete-confirmation.component';

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
    EmptyStateComponent,
    DeleteConfirmationComponent
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

  isDeleteModalVisible = signal(false);
  bannerToDelete = signal<Banner | undefined>(undefined);

  isSaving = signal(false);
  isLoading = this.bannerService.isLoading;
  error = this.bannerService.error;

  ngOnInit(): void {
    this.bannerService.loadBannersAdmin();
  }

  openEditModal(banner: Banner): void {
    this.selectedBanner.set(banner);
    this.isModalVisible.set(true);
  }

  closeModal(): void {
    this.isModalVisible.set(false);
    this.selectedBanner.set(undefined);
  }

  openDeleteModal(banner: Banner): void {
    this.bannerToDelete.set(banner);
    this.isDeleteModalVisible.set(true);
  }

  confirmDelete(): void {
    const id = this.bannerToDelete()?.id;
    if (id) {
      this.isSaving.set(true);
      this.bannerService.delete(id).subscribe({
        next: () => {
          this.isDeleteModalVisible.set(false);
          this.bannerToDelete.set(undefined);
          this.isSaving.set(false);
          this.bannerService.loadBannersAdmin();
        },
        error: (err) => {
          console.error(err);
          this.isSaving.set(false);
        }
      });
    }
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
        this.bannerService.loadBannersAdmin();
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