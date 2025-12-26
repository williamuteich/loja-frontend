import { Component, ChangeDetectionStrategy, signal, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-trust-info',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './trust-info.component.html',
    styleUrl: './trust-info.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrustInfoComponent implements OnInit, OnDestroy {
    private readonly platformId = inject(PLATFORM_ID);
    protected currentIndex = signal(0);
    private autoplayInterval?: any;

    protected items = [
        {
            icon: 'truck',
            title: 'Entrega Rápida',
            description: 'Frete grátis para compras acima de R$ 150',
            color: 'emerald'
        },
        {
            icon: 'shield',
            title: 'Pagamento Seguro',
            description: 'Suas informações sempre protegidas',
            color: 'blue'
        },
        {
            icon: 'refresh',
            title: 'Troca Garantida',
            description: '30 dias para trocar ou devolver',
            color: 'amber'
        },
        {
            icon: 'headphones',
            title: 'Suporte Dedicado',
            description: 'Atendimento via WhatsApp',
            color: 'purple'
        }
    ];

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.startAutoplay();
        }
    }

    ngOnDestroy() {
        this.stopAutoplay();
    }

    private startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.currentIndex.update(i => (i + 1) % 2);
        }, 5000);
    }

    private stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }

    protected setIndex(index: number) {
        this.currentIndex.set(index);
        this.stopAutoplay();
        this.startAutoplay();
    }
}
