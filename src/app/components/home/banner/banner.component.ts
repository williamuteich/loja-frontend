import { Component, inject, OnInit, OnDestroy, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BannerService } from '../../../services/banner.service';
import { environment } from '../../../../environments/environment';
import { TrustInfoComponent } from '../trust-info/trust-info.component';

@Component({
    selector: 'app-banner',
    standalone: true,
    imports: [
        CommonModule,
        NgOptimizedImage,
        TrustInfoComponent
    ],
    templateUrl: './banner.component.html',
    styleUrl: './banner.component.css'
})
export class BannerComponent implements OnInit, OnDestroy {
    private bannerService = inject(BannerService);
    private breakpointObserver = inject(BreakpointObserver);
    private platformId = inject(PLATFORM_ID);

    protected banners = this.bannerService.publicBanners;
    protected backendUrl = environment.BACKEND_URL;

    protected isDesktop = signal(true);
    protected currentIndex = signal(0);

    private autoplay?: number;

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            this.isDesktop.set(window.innerWidth >= 1200);
            this.breakpointObserver
                .observe('(min-width: 1200px)')
                .subscribe(r => this.isDesktop.set(r.matches));
        }
    }

    ngOnInit(): void {
        this.bannerService.loadBannersPublic();
        if (isPlatformBrowser(this.platformId)) {
            this.autoplay = window.setInterval(() => this.next(), 5000);
        }
    }

    ngOnDestroy(): void {
        if (this.autoplay) {
            clearInterval(this.autoplay);
        }
    }

    next(): void {
        const total = this.banners().length;
        if (!total) return;
        this.currentIndex.set((this.currentIndex() + 1) % total);
    }

    prev(): void {
        const total = this.banners().length;
        if (!total) return;
        this.currentIndex.set((this.currentIndex() - 1 + total) % total);
    }

    goTo(index: number): void {
        this.currentIndex.set(index);
    }
}
