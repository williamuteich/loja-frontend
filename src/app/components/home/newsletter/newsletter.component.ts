import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Mail, ArrowRight, Gift, CheckCircle2 } from 'lucide-angular';
import { NewsletterService } from '../../../services/newsletter.service';

@Component({
    selector: 'app-newsletter-section',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, FormsModule],
    templateUrl: './newsletter.component.html'
})
export class NewsletterSectionComponent {
    private readonly newsletterService = inject(NewsletterService);

    readonly MailIcon = Mail;
    readonly ArrowRightIcon = ArrowRight;
    readonly GiftIcon = Gift;
    readonly CheckIcon = CheckCircle2;

    email = signal('');
    whatsapp = signal('');
    isSubmitting = signal(false);
    isSubscribed = signal(false);

    onSubmit(): void {
        if (!this.email()) return;

        this.isSubmitting.set(true);
        this.newsletterService.subscribe({
            email: this.email(),
            whatsapp: this.whatsapp() || undefined
        }).subscribe({
            next: () => {
                this.isSubscribed.set(true);
                this.isSubmitting.set(false);
                this.email.set('');
                this.whatsapp.set('');
            },
            error: (err) => {
                console.error('Erro ao assinar newsletter:', err);
                this.isSubmitting.set(false);
                alert('Ocorreu um erro ao realizar sua inscrição. Tente novamente mais tarde.');
            }
        });
    }
}
