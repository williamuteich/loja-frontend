import { Component, inject, computed, OnInit, effect, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { BannerComponent } from '../../../components/home/banner/banner.component';
import { CategoryCarouselComponent } from '../../../components/home/category-carousel/category-carousel.component';
import { OfferCarouselComponent } from '../../../components/home/offer-carousel/offer-carousel.component';
import { CategoryProductsCarouselComponent } from '../../../components/home/category-products-carousel/category-products-carousel.component';
import { ProductsGridComponent } from '../../../components/home/products-grid/products-grid.component';
import { PromotionsBannerComponent } from '../../../components/home/promotions-banner/promotions-banner.component';
import { NewsletterSectionComponent } from '../../../components/home/newsletter/newsletter.component';
import { CategoryService } from '../../../services/category.service';
import { ProductService } from '../../../services/product.service';
import { StoreConfigService } from '../../../services/store-config.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        BannerComponent,
        CategoryCarouselComponent,
        OfferCarouselComponent,
        CategoryProductsCarouselComponent,
        ProductsGridComponent,
        PromotionsBannerComponent,
        NewsletterSectionComponent,
    ],
    templateUrl: './home.component.html',
    styles: ``
})
export class HomeComponent implements OnInit {
    private readonly categoryService = inject(CategoryService);
    private readonly productService = inject(ProductService);
    private readonly storeConfigService = inject(StoreConfigService);
    private readonly titleService = inject(Title);
    private readonly metaService = inject(Meta);

    protected readonly homeCategories = computed(() => {
        return this.categoryService.publicCategories().filter(c => c.isHome);
    });

    constructor() {
        effect(() => {
            const config = this.storeConfigService.config();
            if (config) {
                if (config.seoTitle) {
                    this.titleService.setTitle(config.seoTitle);
                }
                if (config.seoDescription) {
                    this.metaService.updateTag({ name: 'description', content: config.seoDescription });
                }
                if (config.ogImageUrl) {
                    this.metaService.updateTag({ property: 'og:image', content: config.ogImageUrl });
                }
            }
        });
    }

    ngOnInit(): void {
        this.storeConfigService.loadConfigPublic();
        this.categoryService.loadCategoriesPublic();
        this.productService.loadProductsPublic(1, 50);
    }

    getCategoryProducts(categoryId: string) {
        return this.productService.publicProducts().filter(p =>
            p.isActive && p.categories.some(cat => cat.category.id === categoryId)
        );
    }
}
