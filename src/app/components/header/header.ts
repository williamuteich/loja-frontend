import { Component, inject, computed, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  host: {
    '[class.hidden]': 'isDashboard()'
  }
})
export class Header {
  private router = inject(Router);

  currentUrl = signal(this.router.url);

  isDashboard = computed(() => this.currentUrl().includes('/dashboard'));

  constructor() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.set(this.router.url);
      }
    });
  }

  login() {
    this.router.navigate(['/login']);
  }
}
