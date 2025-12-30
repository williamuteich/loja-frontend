import { Component, inject, computed, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { BannerComponent } from '../../../components/home/banner/banner.component';
import { CategoryCarouselComponent } from '../../../components/home/category-carousel/category-carousel.component';
import { OfferCarouselComponent } from '../../../components/home/offer-carousel/offer-carousel.component';
import { CategoryProductsCarouselComponent } from '../../../components/home/category-products-carousel/category-products-carousel.component';
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
        CategoryProductsCarouselComponent
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
        const categories = this.categoryService.publicCategories().filter(c => c.isHome);
        const products = this.productService.publicProducts();

        if (!products || products.length === 0) {
            return categories;
        }

        // Mantém apenas categorias que realmente possuem ao menos um produto público associado
        return categories.filter(category =>
            products.some(p =>
                p.isActive && p.categories?.some(cat => cat.category.id === category.id)
            )
        );
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
        this.productService.loadProductsPublic();
    }

    getCategoryProducts(categoryId: string) {
        return this.productService.publicProducts().filter(p =>
            p.categories.some(cat => cat.category.id === categoryId)
        );
    }
}
