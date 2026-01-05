import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { loginGuard } from './guards/login.guard';
import { maintenanceGuard } from './guards/maintenance.guard';

export const routes: Routes = [
  {
    path: 'maintenance',
    loadComponent: () => import('./pages/public/maintenance/maintenance.component').then(m => m.MaintenanceComponent)
  },
  {
    path: '',
    loadComponent: () => import('./pages/public/layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/public/home/home.component').then(m => m.HomeComponent),
        canActivate: [maintenanceGuard]
      },
      {
        path: 'produto/:id',
        loadComponent: () => import('./pages/public/product/product.component').then(m => m.ProductComponent),
        canActivate: [maintenanceGuard]
      },
      {
        path: 'contato',
        loadComponent: () => import('./pages/public/contato/contato.component').then(m => m.ContatoComponent),
        canActivate: [maintenanceGuard]
      },
      {
        path: 'privacidade',
        loadComponent: () => import('./pages/public/privacidade/privacidade.component').then(m => m.PrivacidadeComponent),
        canActivate: [maintenanceGuard]
      },
      {
        path: 'cookies',
        loadComponent: () => import('./pages/public/cookies/cookies.component').then(m => m.CookiesComponent),
        canActivate: [maintenanceGuard]
      },
      {
        path: 'termos',
        loadComponent: () => import('./pages/public/termos/termos.component').then(m => m.TermosComponent),
        canActivate: [maintenanceGuard]
      },
      {
        path: 'categorias',
        loadComponent: () => import('./pages/public/categorias/categorias.component').then(m => m.CategoriasComponent),
        canActivate: [maintenanceGuard]
      },
    ]

  },
  {
    path: 'login',
    loadComponent: () => import('./pages/public/login/login.component').then(m => m.LoginComponent),
    canActivate: [loginGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/private/admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/private/admin/home/home.component').then(m => m.HomeComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'COLLABORATOR'] }
      },
      {
        path: 'brands',
        loadComponent: () => import('./pages/private/admin/brands/brands.component').then(m => m.BrandsComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'COLLABORATOR'] }
      },
      {
        path: 'categories',
        loadComponent: () => import('./pages/private/admin/categories/categories.component').then(m => m.CategoriesComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'COLLABORATOR'] }
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/private/admin/settings/settings.component').then(m => m.SettingsComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'clients',
        loadComponent: () => import('./pages/private/admin/clients/clients.component').then(m => m.ClientsComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'COLLABORATOR'] }
      },
      {
        path: 'team',
        loadComponent: () => import('./pages/private/admin/team/team.component').then(m => m.TeamComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/private/admin/products/products.component').then(m => m.ProductsComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'COLLABORATOR'] }
      },
      {
        path: 'products/create',
        loadComponent: () => import('./pages/private/admin/product-edit/product-edit.component').then(m => m.ProductEditComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'COLLABORATOR'] }
      },
      {
        path: 'products/edit/:id',
        loadComponent: () => import('./pages/private/admin/product-edit/product-edit.component').then(m => m.ProductEditComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'COLLABORATOR'] }
      },
      {
        path: 'socials',
        loadComponent: () => import('./pages/private/admin/socials/socials.component').then(m => m.SocialsComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'COLLABORATOR'] }
      },
      {
        path: 'newsletter',
        loadComponent: () => import('./pages/private/admin/newsletter/newsletter.component').then(m => m.NewsletterComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'COLLABORATOR'] }
      },
      {
        path: 'banners',
        loadComponent: () => import('./pages/private/admin/banners/banners.component').then(m => m.BannersComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'COLLABORATOR'] }
      }
    ]
  }
];
