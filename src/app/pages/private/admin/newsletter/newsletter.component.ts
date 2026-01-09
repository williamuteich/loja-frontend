import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Download, Mail, Trash2, Search, X } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { NewsletterService } from '../../../../services/newsletter.service';
import { Newsletter } from '../../../../models';
import { PaginationComponent } from '../../../../components/dashboard/pagination/admin-pagination.component';
import { EmptyStateComponent } from '../../../../components/dashboard/empty-state/empty-state.component';
import { GenericModal } from '../../../../components/dashboard/modals/edit-modal/generic-modal';
import { DeleteConfirmationComponent } from '../../../../components/dashboard/modals/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-newsletter',
  imports: [
    CommonModule,
    LucideAngularModule,
    FormsModule,
    PaginationComponent,
    EmptyStateComponent,
    GenericModal,
    DeleteConfirmationComponent
  ],
  templateUrl: './newsletter.component.html'
})
export class NewsletterComponent implements OnInit, OnDestroy {
  private readonly newsletterService = inject(NewsletterService);

  readonly newsletters = this.newsletterService.newsletters;
  readonly isLoading = this.newsletterService.isLoading;
  readonly error = this.newsletterService.error;
  readonly totalItems = this.newsletterService.totalItems;

  readonly pageSize = 10;
  readonly pageIndex = signal(0);
  readonly searchInput = signal('');

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  readonly Download = Download;
  readonly Mail = Mail;
  readonly Trash2 = Trash2;
  readonly Search = Search;
  readonly X = X;

  isDeleteModalVisible = signal(false);
  itemToDelete = signal<Newsletter | null>(null);
  isSaving = signal(false);

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.loadNewsletters();
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
      this.loadNewsletters();
    });
  }

  loadNewsletters(): void {
    this.newsletterService.loadNewslettersAdmin(
      this.pageIndex() + 1,
      this.pageSize,
      this.searchInput()
    );
  }

  onSearchInput(value: string): void {
    this.searchSubject.next(value);
  }

  clearSearch(): void {
    this.searchInput.set('');
    this.searchSubject.next('');
    this.pageIndex.set(0);
    this.loadNewsletters();
  }

  onPageChange(index: number): void {
    this.pageIndex.set(index);
    this.loadNewsletters();
  }

  openDeleteModal(item: Newsletter): void {
    this.itemToDelete.set(item);
    this.isDeleteModalVisible.set(true);
  }

  confirmDelete(): void {
    const id = this.itemToDelete()?.id;
    if (id) {
      this.isSaving.set(true);
      this.newsletterService.delete(id).subscribe({
        next: () => {
          this.isDeleteModalVisible.set(false);
          this.itemToDelete.set(null);
          this.isSaving.set(false);
          this.loadNewsletters();
          alert('Inscrito removido com sucesso!');
        },
        error: (err) => {
          console.error(err);
          this.isSaving.set(false);
          alert('Erro ao remover inscrito.');
        }
      });
    }
  }

  exportList(): void {
    const data = this.newsletters();
    if (data.length === 0) return;

    const headers = ['Email', 'WhatsApp', 'Data de Inscrição'];
    const csvContent = [
      headers.join(','),
      ...data.map(n => [
        n.email,
        n.whatsapp || '',
        new Date(n.createdAt).toLocaleDateString('pt-BR')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'newsletter_subscribers.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
