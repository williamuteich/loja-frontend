import { Routes } from '@angular/router';
import { HomeComponent } from './pages/public/home/home.component';
import { LoginComponent } from './pages/public/login/login.component';
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

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent, canActivate: [loginGuard] }
    ]
  },
  {
    path: 'dashboard',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: AdminHomeComponent },
      { path: 'brands', component: BrandsComponent },
      { path: 'categories', component: CategoriesComponent },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
      { path: 'clients', component: ClientsComponent },
      {
        path: 'team',
        component: TeamComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
      { path: 'products', component: ProductsComponent },
      { path: 'products/edit/:id', component: ProductEditComponent },
      { path: 'socials', component: SocialsComponent },
      { path: 'newsletter', component: NewsletterComponent },
      { path: 'banners', component: BannersComponent }
    ]
  }
];
