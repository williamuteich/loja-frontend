import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { BannerService } from '../../services/banner.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { environment } from '../../../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-banner',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage, MatButtonModule, MatIconModule],
    templateUrl: './banner.component.html',
    styles: [`
        :host {
            display: block;
            width: 100%;
            overflow: hidden;
            position: relative;
        }

        .banner-wrapper {
            position: relative;
            width: 100%;
        }

        /* Mobile: ~700x435 → 62.14% */
        .banner-aspect {
            position: relative;
            padding-bottom: 62.14%;
            width: 100%;
        }

        /* Desktop: mais largo, ~56.25% (16:9 comum em banners) */
        @media (min-width: 768px) {
            .banner-aspect {
                padding-bottom: 56.25%;
            }
        }

        .banner-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        .banner-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            display: block;
        }

        .slide {
            position: absolute;
            inset: 0;
            opacity: 0;
            transition: opacity 0.7s ease-in-out;
        }

        .slide.active {
            opacity: 1;
            position: relative;
        }
    `]
})
export class BannerComponent implements OnInit, OnDestroy {
    private readonly bannerService = inject(BannerService);
    protected readonly banners = this.bannerService.banners;
    protected readonly backendUrl = environment.BACKEND_URL;

    protected currentIndex = signal(0);
    private autoplayInterval?: any;

    ngOnInit(): void {
        this.bannerService.loadBanners();
        this.startAutoplay();
    }

    ngOnDestroy(): void {
        this.stopAutoplay();
    }

    next(): void {
        if (this.banners().length === 0) return;
        const nextIndex = (this.currentIndex() + 1) % this.banners().length;
        this.currentIndex.set(nextIndex);
    }

    prev(): void {
        if (this.banners().length === 0) return;
        const prevIndex = (this.currentIndex() - 1 + this.banners().length) % this.banners().length;
        this.currentIndex.set(prevIndex);
    }

    goTo(index: number): void {
        this.currentIndex.set(index);
    }

    protected getResolution(res: string | null | undefined, isMobile: boolean = false): { width: number; height: number } {
        const defaultDesktop = { width: 1600, height: 900 };
        const defaultMobile = { width: 700, height: 435 };

        if (!res || !res.trim()) {
            return isMobile ? defaultMobile : defaultDesktop;
        }
        const parts = res.split(/\s*[xX×*]\s*/);
        if (parts.length < 2) {
            return isMobile ? defaultMobile : defaultDesktop;
        }

        return {
            width: parseInt(parts[0], 10) || (isMobile ? defaultMobile.width : defaultDesktop.width),
            height: parseInt(parts[1], 10) || (isMobile ? defaultMobile.height : defaultDesktop.height)
        };
    }

    private startAutoplay(): void {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            this.next();
        }, 5000);
    }

    private stopAutoplay(): void {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }
}