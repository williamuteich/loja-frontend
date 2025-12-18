import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Search, Plus, UserCog, SquarePen, Trash2 } from 'lucide-angular';
import { AdminSearchComponent } from '../../../../components/admin-search/admin-search.component';

@Component({
  selector: 'app-team',
  imports: [CommonModule, LucideAngularModule, AdminSearchComponent],
  templateUrl: './team.component.html'
})
export class TeamComponent {
  readonly Search = Search;
  readonly Plus = Plus;
  readonly UserCog = UserCog;
  readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;

  team = [
    {
      id: 1,
      name: 'Admin',
      lastName: 'User',
      email: 'admin@loja.com',
      role: 'ADMIN',
      createdAt: '01/01/2024'
    },
    {
      id: 2,
      name: 'Roberto',
      lastName: 'Almeida',
      email: 'roberto@loja.com',
      role: 'COLLABORATOR',
      createdAt: '15/03/2024'
    },
    {
      id: 3,
      name: 'Fernanda',
      lastName: 'Lima',
      email: 'fernanda@loja.com',
      role: 'COLLABORATOR',
      createdAt: '10/06/2024'
    }
  ];
}
