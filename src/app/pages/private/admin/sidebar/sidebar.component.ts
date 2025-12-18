import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, Users, UsersRound, Package, FolderTree, Tags, Share2, Settings, Mail, Image, Store, LogOut, X } from 'lucide-angular';

const links = [
  { path: '/dashboard', label: 'Dashboard', exact: true, icon: LayoutDashboard },
  { path: '/dashboard/clients', label: 'Clientes', icon: Users },
  { path: '/dashboard/team', label: 'Equipe', icon: UsersRound },
  { path: '/dashboard/products', label: 'Produtos', icon: Package },
  { path: '/dashboard/categories', label: 'Categorias', icon: FolderTree },
  { path: '/dashboard/brands', label: 'Marcas', icon: Tags },
  { path: '/dashboard/socials', label: 'Redes Sociais', icon: Share2 },
  { path: '/dashboard/settings', label: 'Configurações', icon: Settings },
  { path: '/dashboard/newsletter', label: 'Newsletter', icon: Mail },
  { path: '/dashboard/banners', label: 'Banner', icon: Image },
];

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  readonly StoreIcon = Store;
  readonly XIcon = X;
  readonly LogOutIcon = LogOut;

  links = links;
}
