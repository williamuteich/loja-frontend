import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Search, ShoppingBag, User, Menu } from 'lucide-angular';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private router = inject(Router);

  protected readonly Search = Search;
  protected readonly ShoppingBag = ShoppingBag;
  protected readonly User = User;
  protected readonly Menu = Menu;

  protected login() {
    this.router.navigate(['/login']);
  }
}
