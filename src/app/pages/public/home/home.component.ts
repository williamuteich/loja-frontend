import { Component } from '@angular/core';
import { BannerComponent } from '../../../components/home/banner/banner.component';
import { CategoryCarouselComponent } from '../../../components/home/category-carousel/category-carousel.component';
import { OfferCarouselComponent } from '../../../components/home/offer-carousel/offer-carousel.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        BannerComponent,
        CategoryCarouselComponent,
        OfferCarouselComponent
    ],
    templateUrl: './home.component.html',
    styles: ``
})
export class HomeComponent {
}
