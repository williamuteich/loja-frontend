import { Component } from '@angular/core';
import { BannerComponent } from '../../../components/home/banner/banner.component';
import { CategoryCarouselComponent } from '../../../components/home/category-carousel/category-carousel.component';

@Component({
    selector: 'app-home',
    imports: [BannerComponent, CategoryCarouselComponent],
    templateUrl: './home.component.html',
    styles: ``
})
export class HomeComponent {
}
