import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../../components/home/header/header';
import { Footer } from '../../../components/home/footer/footer';
import { SearchResultsComponent } from '../../../components/home/search-results/search-results.component';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Footer, SearchResultsComponent],
  template: `
    <div class="flex flex-col min-h-screen pt-28">
      <app-header />
      <main class="grow">
        @if (searchService.isSearchActive()) {
          <app-search-results />
        } @else {
          <router-outlet />
        }
      </main>
      <app-footer />
    </div>
  `
})
export class MainLayoutComponent {
  protected readonly searchService = inject(SearchService);
}
