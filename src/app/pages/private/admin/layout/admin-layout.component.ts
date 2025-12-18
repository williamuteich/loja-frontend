import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { LucideAngularModule, Search, Bell, User, Menu } from 'lucide-angular';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, LucideAngularModule],
  template: `
    <div class="flex h-screen relative overflow-hidden mx-auto">
      <app-sidebar [isOpen]="isSidebarOpen()" (close)="isSidebarOpen.set(false)"></app-sidebar>

      <main class="flex-1 flex flex-col min-w-0 overflow-y-auto h-full transition-all duration-300">
         <header class="bg-white border-b border-slate-200 px-12 md:px-24 py-4 sticky top-0 z-40">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <button (click)="toggleSidebar()" class="p-2 text-slate-500 cursor-pointer rounded-lg transition-colors hover:bg-slate-100" aria-label="Abrir Menu">
                        <lucide-icon [img]="MenuIcon" class="w-6 h-6"></lucide-icon>
                    </button>
                    <div>
                        <h1 class="text-2xl font-display font-semibold text-slate-900">Dashboard</h1>
                        <p class="text-slate-500 text-sm mt-1">Visão geral do seu e-commerce</p>
                    </div>
                </div>
                
                <div class="flex items-center gap-4">
                    <div class="relative hidden md:block">
                        <lucide-icon [img]="SearchIcon" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></lucide-icon>
                        <input class="flex h-10 rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 w-64 bg-slate-50 border-slate-200 focus:bg-white" placeholder="Buscar...">
                    </div>
                    
                    <button class="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
                        <lucide-icon [img]="BellIcon" class="w-5 h-5"></lucide-icon>
                        <span class="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
                    </button>
                    
                    <div class="flex items-center gap-3 pl-4 border-l border-slate-200">
                        <div class="text-right hidden sm:block">
                            <span class="block text-sm font-medium text-slate-700">Admin</span>
                            <span class="block text-xs text-slate-500">Administrador</span>
                        </div>
                        <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <lucide-icon [img]="UserIcon" class="w-5 h-5 text-primary"></lucide-icon>
                        </div>
                    </div>
                </div>
            </div>
         </header>

         <router-outlet></router-outlet>
      </main>
    </div>
  `
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
