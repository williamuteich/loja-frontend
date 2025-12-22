import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TrustInfoComponent } from '../trust-info/trust-info.component';
import { BannerService } from '../../../services/banner.service';
import { environment } from '../../../../environments/environment';


@Component({
    selector: 'app-banner',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage, MatButtonModule, MatIconModule, TrustInfoComponent],
    templateUrl: './banner.component.html',
    styleUrl: './banner.component.css'
})
export class BannerComponent implements OnInit, OnDestroy {
    private readonly bannerService = inject(BannerService);
    protected readonly banners = this.bannerService.publicBanners;
    protected readonly backendUrl = environment.BACKEND_URL;

    protected currentIndex = signal(0);
    private autoplayInterval?: any;

    ngOnInit(): void {
        this.bannerService.loadBannersPublic();
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