import { Component, ChangeDetectionStrategy, inject, signal, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Search, ShoppingBag, User, Menu, Instagram, Facebook } from 'lucide-angular';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private router = inject(Router);

  protected readonly Search = Search;
  protected readonly ShoppingBag = ShoppingBag;
  protected readonly User = User;
  protected readonly Menu = Menu;
  protected readonly Instagram = Instagram;
  protected readonly Facebook = Facebook;

  protected isScrolled = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled.set(scrollOffset > 50);
  }

  protected login() {
    this.router.navigate(['/login']);
  }
}
