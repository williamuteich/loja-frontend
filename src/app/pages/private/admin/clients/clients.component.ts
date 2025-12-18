import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, User, SquarePen, Trash2 } from 'lucide-angular';
import { AdminSearchComponent } from '../../../../components/admin-search/admin-search.component';

@Component({
  selector: 'app-clients',
  imports: [CommonModule, LucideAngularModule, AdminSearchComponent],
  templateUrl: './clients.component.html'
})
export class ClientsComponent {
  readonly Plus = Plus;
  readonly User = User;
  readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;

  clients = [
    {
      id: 1,
      name: 'Maria',
      lastName: 'Silva',
      email: 'maria.silva@email.com',
      role: 'CLIENT',
      createdAt: '15/09/2024'
    },
    {
      id: 2,
      name: 'João',
      lastName: 'Santos',
      email: 'joao.santos@email.com',
      role: 'CLIENT',
      createdAt: '10/11/2024'
    },
    {
      id: 3,
      name: 'Ana',
      lastName: 'Oliveira',
      email: 'ana.oliveira@email.com',
      role: 'CLIENT',
      createdAt: '05/12/2024'
    },
    {
      id: 4,
      name: 'Pedro',
      lastName: 'Costa',
      email: 'pedro.costa@email.com',
      role: 'CLIENT',
      createdAt: '20/12/2024'
    }
  ];
}
