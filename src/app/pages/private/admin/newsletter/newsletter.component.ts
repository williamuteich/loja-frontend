import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Search, Download, Users, TrendingUp, Mail, Trash2 } from 'lucide-angular';
import { AdminSearchComponent } from '../../../../components/admin-search/admin-search.component';

@Component({
  selector: 'app-newsletter',
  imports: [CommonModule, LucideAngularModule, AdminSearchComponent],
  templateUrl: './newsletter.component.html'
})
export class NewsletterComponent {
  readonly Search = Search;
  readonly Download = Download;
  readonly Users = Users;
  readonly TrendingUp = TrendingUp;
  readonly Mail = Mail;
  readonly Trash2 = Trash2;

  subscribers = [
    {
      id: 1,
      email: 'maria@email.com',
      date: '15/12/2024',
      status: 'active'
    },
    {
      id: 2,
      email: 'joao@email.com',
      date: '14/12/2024',
      status: 'active'
    },
    {
      id: 3,
      email: 'ana.costa@email.com',
      date: '13/12/2024',
      status: 'active'
    },
    {
      id: 4,
      email: 'pedro123@email.com',
      date: '12/12/2024',
      status: 'active'
    },
    {
      id: 5,
      email: 'lucia.santos@email.com',
      date: '11/12/2024',
      status: 'canceled'
    },
    {
      id: 6,
      email: 'carlos@email.com',
      date: '10/12/2024',
      status: 'active'
    }
  ];
}
