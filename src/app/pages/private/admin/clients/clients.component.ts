import { Component, inject, OnInit, signal, ChangeDetectorRef, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, User, SquarePen, Trash2 } from 'lucide-angular';
import { AdminSearchComponent } from '../../../../components/dashboard/admin-search/admin-search.component';
import { ClientService } from '../../../../services/client.service';
import { GenericModal } from '../../../../components/dashboard/modals/edit-modal/generic-modal';
import { Client } from '../../../../models';
import { ClientForm } from '../../../../components/dashboard/modals/client-form/client-form';
import { DeleteConfirmationComponent } from '../../../../components/dashboard/modals/delete-confirmation/delete-confirmation.component';
import { SkeletonTableComponent } from '../../../../components/dashboard/skeleton/form/skeletonForm.component';
import { EmptyStateComponent } from '../../../../components/dashboard/empty-state/empty-state.component';
import { PaginationComponent } from '../../../../components/dashboard/pagination/admin-pagination.component';
import { DateFormatPipe } from '../../../../pipes/date-format.pipe';

@Component({
  selector: 'app-clients',
  imports: [CommonModule, LucideAngularModule, AdminSearchComponent, GenericModal, ClientForm, DeleteConfirmationComponent, SkeletonTableComponent, EmptyStateComponent, DateFormatPipe, PaginationComponent],
  templateUrl: 'clients.component.html'
})
export class ClientsComponent implements OnInit {
  readonly Plus = Plus;
  readonly User = User;
  readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;

  private readonly clientService = inject(ClientService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly clients = this.clientService.clients;

  isModalVisible = signal(false);
  selectedClient = signal<Client | undefined>(undefined);

  isDeleteModalVisible = signal(false);
  clientToDelete = signal<Client | undefined>(undefined);

  isSaving = signal(false);
  isLoading = this.clientService.isLoading;
  error = this.clientService.error;

  readonly pageSize = 10;
  readonly pageIndex = signal(0);
  readonly totalItems = this.clientService.totalItems;

  constructor() {
    effect(() => {
      this.loadClients();
    });
  }

  loadClients(): void {
    this.clientService.loadClientsAdmin(this.pageIndex() + 1, this.pageSize);
  }

  ngOnInit(): void {
    this.loadClients();
  }

  openAddModal(): void {
    this.selectedClient.set(undefined);
    this.isModalVisible.set(true);
  }

  openEditModal(client: Client): void {
    this.selectedClient.set(client);
    this.isModalVisible.set(true);
  }

  closeModal(): void {
    this.isModalVisible.set(false);
    this.selectedClient.set(undefined);
  }

  openDeleteModal(client: Client): void {
    this.clientToDelete.set(client);
    this.isDeleteModalVisible.set(true);
  }

  confirmDelete(): void {
    const id = this.clientToDelete()?.id;
    if (id) {
      this.isSaving.set(true);
      this.clientService.delete(id).subscribe({
        next: () => {
          this.isDeleteModalVisible.set(false);
          this.clientToDelete.set(undefined);
          this.isSaving.set(false);
          this.clientService.loadClientsAdmin();
          alert('Conteúdo deletado com sucesso!');
        },
        error: (err) => {
          console.error(err);
          this.isSaving.set(false);
        }
      });
    }
  }

  onPageChange(index: number): void {
    if (index < 0) return;
    this.pageIndex.set(index);
    // effect will trigger loadClients
  }

  handleSave(clientForm: ClientForm): void {
    if (!clientForm.isValid()) {
      console.error("Formulário inválido!");
      return;
    }

    this.isSaving.set(true);
    const formValue = clientForm.getFormValue();
    const clientId = this.selectedClient()?.id;

    if (clientId) {
      this.clientService.update(clientId, formValue).subscribe({
        next: () => {
          this.closeModal();
          this.isSaving.set(false);
          alert('Conteúdo atualizado com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao atualizar cliente:', err);
          this.isSaving.set(false);
        }
      });
    } else {
      this.clientService.create(formValue).subscribe({
        next: () => {
          this.closeModal();
          this.isSaving.set(false);
          alert('Cliente criado com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao criar cliente:', err);
          this.isSaving.set(false);
        }
      });
    }
  }
}
