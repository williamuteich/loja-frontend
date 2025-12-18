import { Routes } from '@angular/router';
import { HomeComponent } from './pages/public/home/home.component';
import { LoginComponent } from './pages/public/login/login.component';
import { AdminLayoutComponent } from './pages/private/admin/layout/admin-layout.component';
import { HomeComponent as AdminHomeComponent } from './pages/private/admin/home/home.component';
import { BrandsComponent } from './pages/private/admin/brands/brands.component';
import { CategoriesComponent } from './pages/private/admin/categories/categories.component';
import { SettingsComponent } from './pages/private/admin/settings/settings.component';
import { MainLayoutComponent } from './pages/public/layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent }
    ]
  },
  {
    path: 'dashboard',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: AdminHomeComponent },
      { path: 'brands', component: BrandsComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];
