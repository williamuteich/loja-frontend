import { Component, ChangeDetectionStrategy, inject, signal, HostListener, effect, PLATFORM_ID, computed, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Search, ShoppingBag, User, Menu, Instagram, Facebook, X, Home, Package, Layers, Phone, Twitter, Youtube, Linkedin, MessageCircle, Music } from 'lucide-angular';
import { NgOptimizedImage, isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { StoreConfigService } from '../../../services/store-config.service';
import { SearchService } from '../../../services/search.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule, NgOptimizedImage, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header implements OnDestroy {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  protected readonly storeConfigService = inject(StoreConfigService);
  protected readonly searchService = inject(SearchService);
  private readonly productService = inject(ProductService);

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
  protected readonly Twitter = Twitter;
  protected readonly Youtube = Youtube;
  protected readonly Linkedin = Linkedin;
  protected readonly MessageCircle = MessageCircle;
  protected readonly Music = Music;

  protected isScrolled = signal(false);
  protected isMenuOpen = signal(false);

  protected searchInput = signal<string>('');
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

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
      this.setupSearchDebounce();
    }
  }

  private setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.searchService.setSearchTerm(term);
      if (term.trim()) {
        this.searchService.setLoading(true);
        this.productService.loadProductsPublic(1, 50, undefined, term);
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled.set(scrollOffset > 50);
  }

  protected onSearchInput(value: string): void {
    this.searchInput.set(value);
    this.searchSubject.next(value);
  }

  protected clearSearch(): void {
    this.searchInput.set('');
    this.searchService.clearSearch();
    this.searchSubject.next('');
  }

  protected toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  protected isMobileSearchOpen = signal(false);

  protected toggleMobileSearch() {
    this.isMobileSearchOpen.update(v => !v);
    if (this.isMobileSearchOpen()) {
      setTimeout(() => {
        const input = document.getElementById('mobile-search-input');
        if (input) input.focus();
      }, 100);
    }
  }

  protected closeMenu() {
    this.isMenuOpen.set(false);
  }

  protected login() {
    this.closeMenu();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
