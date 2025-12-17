import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [RouterOutlet, RouterLink],
    template: `
    <div class="flex h-screen bg-gray-100">
      <aside class="w-64 bg-white shadow-md">
        <div class="p-4 border-b">
          <h1 class="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav class="p-4">
          <ul class="space-y-2">
            <li><a routerLink="/dashboard/brands" class="block p-2 rounded hover:bg-gray-100">Brands</a></li>
            <li><a routerLink="/dashboard/categories" class="block p-2 rounded hover:bg-gray-100">Categories</a></li>
            <li><a routerLink="/dashboard/settings" class="block p-2 rounded hover:bg-gray-100">Settings</a></li>
          </ul>
        </nav>
      </aside>
      <main class="flex-1 p-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
    styles: ``
})
export class DashboardComponent { }
