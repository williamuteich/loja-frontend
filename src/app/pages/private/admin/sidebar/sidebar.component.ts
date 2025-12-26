import { Component, Input, Output, EventEmitter, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, Users, UsersRound, Package, FolderTree, Tags, Share2, Settings, Mail, Image, Store, LogOut, X } from 'lucide-angular';
import { AuthService } from '../../../../services/auth.service';

const links = [
  { path: '/dashboard', label: 'Dashboard', exact: true, icon: LayoutDashboard, roles: ['ADMIN', 'COLLABORATOR'] },
  { path: '/dashboard/clients', label: 'Clientes', icon: Users, roles: ['ADMIN', 'COLLABORATOR'] },

  {
    path: '/dashboard/team',
    label: 'Equipe',
    icon: UsersRound,
    roles: ['ADMIN']
  },

  { path: '/dashboard/products', label: 'Produtos', icon: Package, roles: ['ADMIN', 'COLLABORATOR'] },
  { path: '/dashboard/categories', label: 'Categorias', icon: FolderTree, roles: ['ADMIN', 'COLLABORATOR'] },
  { path: '/dashboard/brands', label: 'Marcas', icon: Tags, roles: ['ADMIN', 'COLLABORATOR'] },
  { path: '/dashboard/socials', label: 'Redes Sociais', icon: Share2, roles: ['ADMIN', 'COLLABORATOR'] },

  {
    path: '/dashboard/settings',
    label: 'Configurações',
    icon: Settings,
    roles: ['ADMIN']
  },

  { path: '/dashboard/newsletter', label: 'Newsletter', icon: Mail, roles: ['ADMIN', 'COLLABORATOR'] },
  { path: '/dashboard/banners', label: 'Banner', icon: Image, roles: ['ADMIN', 'COLLABORATOR'] },
];


@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  private readonly authService = inject(AuthService);

  readonly StoreIcon = Store;
  readonly XIcon = X;
  readonly LogOutIcon = LogOut;

  readonly visibleLinks = computed(() => {
    return links.filter(link => {
      if (!link.roles) return true;
      return this.authService.hasRole(link.roles);
    });
  });
}
