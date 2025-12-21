import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, User, SquarePen, Trash2 } from 'lucide-angular';
import { AdminSearchComponent } from '../../../../components/dashboard/admin-search/admin-search.component';
import { ClientService } from '../../../../services/client.service';
import { GenericModal } from '../../../../components/dashboard/generic-modal/generic-modal';
import { Client } from '../../../../models';
import { DateFormatPipe } from '../../../../pipes/date-format.pipe';
import { ClientForm } from '../../../../components/dashboard/modals/client-form/client-form';

@Component({
  selector: 'app-clients',
  imports: [CommonModule, LucideAngularModule, AdminSearchComponent, GenericModal, ClientForm, DateFormatPipe],
  templateUrl: './clients.component.html'
})
export class ClientsComponent implements OnInit {
  readonly Plus = Plus;
  readonly User = User;
  readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;

  private readonly clientService = inject(ClientService);
  protected readonly clients = this.clientService.clients;

  isModalVisible = signal(false);
  selectedClient = signal<Client | undefined>(undefined);
  isLoading = signal(false);

  ngOnInit(): void {
    this.clientService.loadClients();
  }

  openEditModal(client: Client): void {
    this.selectedClient.set(client);
    this.isModalVisible.set(true);
  }

  closeModal(): void {
    this.isModalVisible.set(false);
    this.selectedClient.set(undefined);
  }

  handleSave(clientForm: ClientForm): void {
    if (!clientForm.isValid()) {
      console.error("Formulário inválido!");
      return;
    }

    const clientId = this.selectedClient()?.id;
    if (!clientId) {
      console.error("Client ID não encontrado!");
      return;
    }

    this.isLoading.set(true);

    const formValue = clientForm.getFormValue();

    this.clientService.update(clientId, formValue).subscribe({
      next: () => {
        this.clientService.loadClients();
        this.closeModal();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao atualizar cliente:', err);
        this.isLoading.set(false);
      }
    });
  }
}
