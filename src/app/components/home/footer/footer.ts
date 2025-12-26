import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StoreConfigService } from '../../../services/store-config.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.html',
})
export class Footer implements OnInit {
  protected readonly storeConfigService = inject(StoreConfigService);
  protected readonly config = this.storeConfigService.config;

  ngOnInit(): void {
    // Ensure config is loaded if not already
    if (!this.config()) {
      this.storeConfigService.loadConfigPublic();
    }
  }

  getPlatformIcon(platform: string): string {
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return 'instagram';
    if (p.includes('facebook')) return 'facebook';
    if (p.includes('twitter') || p.includes('x')) return 'twitter';
    if (p.includes('youtube')) return 'youtube';
    if (p.includes('linkedin')) return 'linkedin';
    if (p.includes('whatsapp')) return 'message-circle';
    return 'link';
  }
}
