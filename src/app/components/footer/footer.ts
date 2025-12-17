import { Component, inject, computed, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  host: {
    '[class.hidden]': 'isDashboard()'
  }
})
export class Footer {
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
}
