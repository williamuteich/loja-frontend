import { Component, ChangeDetectionStrategy, inject, signal, HostListener, effect, PLATFORM_ID, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Search, ShoppingBag, User, Menu, Instagram, Facebook, X, Home, Package, Layers, Phone } from 'lucide-angular';
import { NgOptimizedImage, isPlatformBrowser, CommonModule } from '@angular/common';
import { StoreConfigService } from '../../../services/store-config.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule, NgOptimizedImage],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  protected readonly storeConfigService = inject(StoreConfigService);

  protected readonly config = this.storeConfigService.config;

  protected readonly activeSocials = computed(() =>
    this.config()?.socialMedias?.filter(s => s.isActive) || []
  );

  protected readonly Search = Search;
  protected readonly ShoppingBag = ShoppingBag;
  protected readonly User = User;
  protected readonly Menu = Menu;
  protected readonly XIcon = X;
  protected readonly Home = Home;
  protected readonly Package = Package;
  protected readonly Layers = Layers;
  protected readonly Phone = Phone;
  protected readonly Instagram = Instagram;
  protected readonly Facebook = Facebook;

  protected isScrolled = signal(false);
  protected isMenuOpen = signal(false);

  constructor() {
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      if (this.isMenuOpen()) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      this.storeConfigService.loadConfigPublic();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled.set(scrollOffset > 50);
  }

  protected toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  protected closeMenu() {
    this.isMenuOpen.set(false);
  }

  protected login() {
    this.closeMenu();
    this.router.navigate(['/login']);
  }
}
