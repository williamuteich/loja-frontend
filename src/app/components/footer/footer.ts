import { Component, inject, computed } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';

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

  currentUrl = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url)
    )
  );

  isDashboard = computed(() => {
    const url = this.currentUrl();
    return url ? url.includes('/dashboard') : false;
  });

  constructor() { }
}
