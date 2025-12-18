import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, Search, ShoppingBag, User, Menu } from 'lucide-angular';

@Component({
  selector: 'app-header',
  imports: [RouterModule, LucideAngularModule],
  templateUrl: './header.html',
})
export class Header {
  private router = inject(Router);

  readonly Search = Search;
  readonly ShoppingBag = ShoppingBag;
  readonly User = User;
  readonly Menu = Menu;

  login() {
    this.router.navigate(['/login']);
  }
}
