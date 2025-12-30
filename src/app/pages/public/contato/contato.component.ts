import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { StoreConfigService } from '../../../services/store-config.service';

@Component({
  selector: 'app-contato',
  imports: [CommonModule],
  templateUrl: './contato.component.html'
})
export class ContatoComponent implements OnInit {
  private readonly storeConfigService = inject(StoreConfigService);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly config = this.storeConfigService.config;
  protected readonly isLoading = this.storeConfigService.isLoading;
  protected readonly error = this.storeConfigService.error;

  ngOnInit(): void {
    if (!this.config()) {
      this.storeConfigService.loadConfigPublic();
    }
  }

  protected getSafeMapEmbed(): SafeHtml | null {
    const embed = this.config()?.googleMapsEmbedUrl;
    if (!embed) return null;
    return this.sanitizer.bypassSecurityTrustHtml(embed);
  }
}
