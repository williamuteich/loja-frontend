import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngFor and ngIf
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, Tags, FolderTree, Settings, Store, LogOut, X } from 'lucide-angular';

const links = [
  { path: '/dashboard', label: 'Dashboard', exact: true, icon: LayoutDashboard },
  { path: '/dashboard/brands', label: 'Marcas', icon: Tags },
  { path: '/dashboard/categories', label: 'Categorias', icon: FolderTree },
  { path: '/dashboard/settings', label: 'Configurações', icon: Settings },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <div 
        *ngIf="isOpen" 
        class="fixed inset-0 bg-black/50 z-40 transition-opacity" 
        (click)="close.emit()">
    </div>

    <aside 
      class="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 shadow-2xl transition-transform duration-300 transform"
      [class.-translate-x-full]="!isOpen"
      [class.translate-x-0]="isOpen">
      
      <div class="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-900">
        <a class="flex items-center gap-3" routerLink="/dashboard/brands">
          <div class="w-10 h-10 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-white">
             <lucide-icon [img]="StoreIcon" class="w-5 h-5"></lucide-icon>
          </div>
          <div>
            <span class="font-display text-lg font-semibold text-white">Admin</span>
            <span class="block text-xs text-slate-400">Painel de Controle</span>
          </div>
        </a>

        <button (click)="close.emit()" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
           <lucide-icon [img]="XIcon" class="w-6 h-6"></lucide-icon>
        </button>
      </div>

      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
          @for (link of links; track link.path) {
            <a
                class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-slate-400 hover:text-white hover:bg-slate-800 group cursor-pointer"
                [routerLink]="link.path"
                routerLinkActive="bg-slate-800 text-white shadow-lg"
                [routerLinkActiveOptions]="{ exact: link.exact ?? false }">
                <lucide-icon [img]="link.icon" class="w-5 h-5 group-hover:text-white"></lucide-icon>
                <span class="font-medium">{{ link.label }}</span>
            </a>
          }
      </nav>

      <div class="p-4 border-t border-slate-700/50">
        <a
          class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
          routerLink="/"
        >
          <lucide-icon [img]="StoreIcon" class="w-5 h-5"></lucide-icon>
          <span class="font-medium">Ver Loja</span>
        </a>

        <button class="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all cursor-pointer">
           <lucide-icon [img]="LogOutIcon" class="w-5 h-5"></lucide-icon>
           <span class="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  readonly StoreIcon = Store;
  readonly XIcon = X;
  readonly LogOutIcon = LogOut;

  links = links;
}
