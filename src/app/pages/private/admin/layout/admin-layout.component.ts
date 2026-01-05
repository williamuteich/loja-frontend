import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { LucideAngularModule, Search, Bell, User, Menu } from 'lucide-angular';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterOutlet, SidebarComponent, LucideAngularModule],
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  isSidebarOpen = signal(false);

  readonly MenuIcon = Menu;
  readonly SearchIcon = Search;
  readonly BellIcon = Bell;
  readonly UserIcon = User;

  readonly currentUser = this.authService.currentUser;

  readonly roleLabel = computed(() => {
    const role = this.currentUser()?.role;
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'COLLABORATOR': return 'Colaborador';
      default: return role || '';
    }
  });

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }
}
