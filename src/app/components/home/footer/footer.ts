import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Instagram, Facebook } from 'lucide-angular';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { StoreConfigService } from '../../../services/store-config.service';
import { Social } from '../../../models';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './footer.html',
})
export class Footer implements OnInit {
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly storeConfigService = inject(StoreConfigService);
  protected readonly config = this.storeConfigService.config;

  protected readonly Instagram = Instagram;
  protected readonly Facebook = Facebook;

  protected readonly activeSocials = computed(() =>
    this.config()?.socialMedias?.filter((s: Social) => s.isActive) || []
  );

  ngOnInit(): void {
    if (!this.config()) {
      this.storeConfigService.loadConfigPublic();
    }
  }

  protected getSafeMapEmbed(): SafeHtml {
    const embedUrl = this.config()?.googleMapsEmbedUrl || '';
    return this.sanitizer.bypassSecurityTrustHtml(embedUrl);
  }

  protected formatWhatsApp(phone: string): string {
    return phone.replace(/\D/g, '');
  }
}
