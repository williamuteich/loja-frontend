import { Routes } from '@angular/router';
import { HomeComponent } from './pages/public/home/home.component';
import { LoginComponent } from './pages/public/login/login.component';
import { MaintenanceComponent } from './pages/public/maintenance/maintenance.component';
import { AdminLayoutComponent } from './pages/private/admin/layout/admin-layout.component';
import { HomeComponent as AdminHomeComponent } from './pages/private/admin/home/home.component';
import { BrandsComponent } from './pages/private/admin/brands/brands.component';
import { CategoriesComponent } from './pages/private/admin/categories/categories.component';
import { SettingsComponent } from './pages/private/admin/settings/settings.component';
import { ClientsComponent } from './pages/private/admin/clients/clients.component';
import { TeamComponent } from './pages/private/admin/team/team.component';
import { ProductsComponent } from './pages/private/admin/products/products.component';
import { SocialsComponent } from './pages/private/admin/socials/socials.component';
import { NewsletterComponent } from './pages/private/admin/newsletter/newsletter.component';
import { BannersComponent } from './pages/private/admin/banners/banners.component';
import { MainLayoutComponent } from './pages/public/layout/main-layout.component';
import { ProductEditComponent } from './pages/private/admin/product-edit/product-edit.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { loginGuard } from './guards/login.guard';
import { maintenanceGuard } from './guards/maintenance.guard';

export const routes: Routes = [
  {
    path: 'maintenance',
    component: MaintenanceComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent, canActivate: [maintenanceGuard] },
      { path: 'login', component: LoginComponent, canActivate: [loginGuard] }
    ]
  },
  {
    path: 'dashboard',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: AdminHomeComponent, canActivate: [roleGuard], data: { roles: ['ADMIN', 'COLLABORATOR'] } },
      { path: 'brands', component: BrandsComponent, canActivate: [roleGuard], data: { roles: ['ADMIN', 'COLLABORATOR'] } },
      { path: 'categories', component: CategoriesComponent, canActivate: [roleGuard], data: { roles: ['ADMIN', 'COLLABORATOR'] } },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
      { path: 'clients', component: ClientsComponent, canActivate: [roleGuard], data: { roles: ['ADMIN', 'COLLABORATOR'] } },
      {
        path: 'team',
        component: TeamComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
      { path: 'products', component: ProductsComponent, canActivate: [roleGuard], data: { roles: ['ADMIN', 'COLLABORATOR'] } },
      { path: 'products/edit/:id', component: ProductEditComponent, canActivate: [roleGuard], data: { roles: ['ADMIN', 'COLLABORATOR'] } },
      { path: 'socials', component: SocialsComponent, canActivate: [roleGuard], data: { roles: ['ADMIN', 'COLLABORATOR'] } },
      { path: 'newsletter', component: NewsletterComponent, canActivate: [roleGuard], data: { roles: ['ADMIN', 'COLLABORATOR'] } },
      { path: 'banners', component: BannersComponent, canActivate: [roleGuard], data: { roles: ['ADMIN', 'COLLABORATOR'] } }
    ]
  }
];
