import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { LucideAngularModule, Search, Bell, User, Menu } from 'lucide-angular';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterOutlet, SidebarComponent, LucideAngularModule],
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent {
  isSidebarOpen = signal(false);

  readonly MenuIcon = Menu;
  readonly SearchIcon = Search;
  readonly BellIcon = Bell;
  readonly UserIcon = User;

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }
}
