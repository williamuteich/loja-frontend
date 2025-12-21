import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../../components/home/header/header';
import { Footer } from '../../../components/home/footer/footer';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Footer],
  template: `
    <div class="flex flex-col min-h-screen pt-28">
      <app-header />
      <main class="grow">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `
})
export class MainLayoutComponent { }
