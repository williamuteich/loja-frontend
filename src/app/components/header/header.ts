import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
})
export class Header {
  private router = inject(Router);

  login() {
    this.router.navigate(['/login']);
  }
}
