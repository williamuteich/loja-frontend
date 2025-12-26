import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from '../../../components/home/banner/banner.component';
import { CategoryCarouselComponent } from '../../../components/home/category-carousel/category-carousel.component';
import { OfferCarouselComponent } from '../../../components/home/offer-carousel/offer-carousel.component';
import { CategoryProductsCarouselComponent } from '../../../components/home/category-products-carousel/category-products-carousel.component';
import { CategoryService } from '../../../services/category.service';
import { ProductService } from '../../../services/product.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        BannerComponent,
        CategoryCarouselComponent,
        OfferCarouselComponent,
        CategoryProductsCarouselComponent
    ],
    templateUrl: './home.component.html',
    styles: ``
})
export class HomeComponent implements OnInit {
    private readonly categoryService = inject(CategoryService);
    private readonly productService = inject(ProductService);

    protected readonly homeCategories = computed(() =>
        this.categoryService.publicCategories().filter(c => c.isHome)
    );

    ngOnInit(): void {
        this.categoryService.loadCategoriesPublic();
        this.productService.loadProductsPublic();
    }

    getCategoryProducts(categoryId: string) {
        return this.productService.publicProducts().filter(p =>
            p.categories.some(cat => cat.category.id === categoryId)
        );
    }
}
