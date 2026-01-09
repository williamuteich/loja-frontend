import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LucideAngularModule, Plus, SquarePen, Trash2, Search, X } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { BannerService } from '../../../../services/banner.service';
import { Banner } from '../../../../models';
import { environment } from '../../../../../environments/environment';
import { GenericModal } from '../../../../components/dashboard/modals/edit-modal/generic-modal';
import { BannerForm } from '../../../../components/dashboard/modals/banner-form/banner-form';
import { SkeletonBannerComponent } from '../../../../components/dashboard/skeleton/banner/skeletonBanner.component';
import { EmptyStateComponent } from '../../../../components/dashboard/empty-state/empty-state.component';
import { DeleteConfirmationComponent } from '../../../../components/dashboard/modals/delete-confirmation/delete-confirmation.component';
import { PaginationComponent } from '../../../../components/dashboard/pagination/admin-pagination.component';

@Component({
  selector: 'app-banners',
  imports: [
    CommonModule,
    LucideAngularModule,
    NgOptimizedImage,
    GenericModal,
    BannerForm,
    SkeletonBannerComponent,
    EmptyStateComponent,
    DeleteConfirmationComponent,
    PaginationComponent,
    FormsModule
  ],
  templateUrl: './banners.component.html',
})
export class BannersComponent implements OnInit, OnDestroy {
  private readonly bannerService = inject(BannerService);
  protected readonly banners = this.bannerService.banners;
  readonly backendUrl = environment.BACKEND_URL;

  readonly pageSize = 10;
  readonly pageIndex = signal(0);
  readonly totalItems = this.bannerService.totalItems;

  readonly Plus = Plus;
  readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;
  readonly Search = Search;
  readonly X = X;

  readonly searchInput = signal('');
  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  isModalVisible = signal(false);
  selectedBanner = signal<Banner | undefined>(undefined);

  isDeleteModalVisible = signal(false);
  bannerToDelete = signal<Banner | undefined>(undefined);

  isSaving = signal(false);
  isLoading = this.bannerService.isLoading;
  error = this.bannerService.error;

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.loadBanners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.searchInput.set(term);
      this.pageIndex.set(0);
      this.loadBanners();
    });
  }

  onSearchInput(value: string): void {
    this.searchSubject.next(value);
  }

  clearSearch(): void {
    this.searchInput.set('');
    this.searchSubject.next('');
    this.pageIndex.set(0);
    this.loadBanners();
  }

  loadBanners(): void {
    this.bannerService.loadBannersAdmin(this.pageIndex() + 1, this.pageSize, this.searchInput());
  }

  onPageChange(index: number): void {
    if (index < 0) return;
    this.pageIndex.set(index);
    this.loadBanners();
  }

  openAddModal(): void {
    this.selectedBanner.set(undefined);
    this.isModalVisible.set(true);
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
          this.loadBanners();
          alert('Conteúdo deletado com sucesso!');
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

    this.isSaving.set(true);
    const formValue = bannerForm.getFormValue();
    const bannerId = this.selectedBanner()?.id;

    const formData = new FormData();
    formData.append('title', formValue.title);

    if (formValue.subtitle) formData.append('subtitle', formValue.subtitle);
    if (formValue.linkUrl) formData.append('linkUrl', formValue.linkUrl);
    if (formValue.resolutionDesktop) formData.append('resolutionDesktop', formValue.resolutionDesktop);
    if (formValue.resolutionMobile) formData.append('resolutionMobile', formValue.resolutionMobile);

    if (bannerForm.selectedDesktopFile) {
      formData.append('desktopImage', bannerForm.selectedDesktopFile);
    }
    if (bannerForm.selectedMobileFile) {
      formData.append('mobileImage', bannerForm.selectedMobileFile);
    }

    if (bannerId) {
      this.bannerService.update(bannerId, formData).subscribe({
        next: () => {
          this.closeModal();
          this.isSaving.set(false);
          alert('Conteúdo atualizado com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao atualizar banner:', err);
          this.isSaving.set(false);
        }
      });
    } else {
      if (!bannerForm.selectedDesktopFile) {
        alert('A imagem desktop é obrigatória para criar um novo banner!');
        this.isSaving.set(false);
        return;
      }

      this.bannerService.create(formData).subscribe({
        next: () => {
          this.closeModal();
          this.isSaving.set(false);
          alert('Banner criado com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao criar banner:', err);
          this.isSaving.set(false);
        }
      });
    }
  }
}