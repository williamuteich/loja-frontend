import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Instagram, Facebook, Twitter, Youtube, Linkedin, Save, Trash2, Plus, MessageCircle } from 'lucide-angular';
import { SocialService } from '../../../../services/social.service';
import { Social } from '../../../../models';
import { FormsModule } from '@angular/forms';
import { GenericModal } from '../../../../components/dashboard/generic-modal/generic-modal';
import { DeleteConfirmationComponent } from '../../../../components/dashboard/modals/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-socials',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, GenericModal, DeleteConfirmationComponent],
  templateUrl: './socials.component.html'
})
export class SocialsComponent implements OnInit {
  private readonly socialService = inject(SocialService);

  readonly Instagram = Instagram;
  readonly Facebook = Facebook;
  readonly Twitter = Twitter;
  readonly Youtube = Youtube;
  readonly Linkedin = Linkedin;
  readonly Save = Save;
  readonly Trash2 = Trash2;
  readonly Plus = Plus;

  protected readonly socials = this.socialService.socials;
  protected readonly isLoading = this.socialService.isLoading;
  protected readonly error = this.socialService.error;

  localSocials = signal<Social[]>([]);
  isDeleteModalVisible = signal(false);
  isSaving = signal(false);
  socialToDelete = signal<Social | null>(null);
  private hasInitialized = false;

  private readonly platformMeta: Record<string, { icon: any, color: string, label: string }> = {
    'instagram': { icon: Instagram, color: 'from-pink-500 to-purple-600', label: 'Instagram' },
    'facebook': { icon: Facebook, color: 'from-blue-600 to-blue-700', label: 'Facebook' },
    'twitter': { icon: Twitter, color: 'from-slate-700 to-slate-900', label: 'Twitter / X' },
    'youtube': { icon: Youtube, color: 'from-red-500 to-red-600', label: 'YouTube' },
    'linkedin': { icon: Linkedin, color: 'from-blue-500 to-blue-700', label: 'LinkedIn' },
    'tiktok': { icon: Instagram, color: 'from-black to-slate-800', label: 'TikTok' },
    'whatsapp': { icon: MessageCircle, color: 'from-emerald-500 to-emerald-600', label: 'WhatsApp' }
  };

  constructor() {
    effect(() => {
      const remote = this.socials();
      if (remote.length > 0 && !this.hasInitialized) {
        this.localSocials.set(remote.map(s => ({ ...s })));
        this.hasInitialized = true;
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    this.socialService.loadSocialsAdmin();
  }

  getMeta(platform: string) {
    return this.platformMeta[platform.toLowerCase()] || { icon: Instagram, color: 'from-slate-400 to-slate-500', label: platform };
  }

  toggleSocial(social: Social): void {
    this.localSocials.update(socials =>
      socials.map(s => s.id === social.id ? { ...s, isActive: !s.isActive } : s)
    );
  }

  deleteSocial(social: Social): void {
    this.socialToDelete.set(social);
    this.isDeleteModalVisible.set(true);
  }

  confirmDelete(): void {
    const social = this.socialToDelete();
    if (social) {
      this.socialService.delete(social.id).subscribe({
        next: () => {
          this.localSocials.update(socials => socials.filter(s => s.id !== social.id));
          this.isDeleteModalVisible.set(false);
          this.socialToDelete.set(null);
        },
        error: (err) => {
          console.error('Erro ao deletar rede social', err);
          alert('Não foi possível excluir este link.');
        }
      });
    }
  }

  save(social: Social, newUrl: string): void {
    this.localSocials.update(socials =>
      socials.map(s => s.id === social.id ? { ...s, url: newUrl } : s)
    );
  }

  saveAll(): void {
    const original = this.socials();
    const current = this.localSocials();

    const changes = current.filter(curr => {
      const orig = original.find(o => o.id === curr.id);
      return orig && (orig.url !== curr.url || orig.isActive !== curr.isActive);
    });

    if (changes.length === 0) return;

    this.isSaving.set(true);
    let completed = 0;
    let errors = 0;

    changes.forEach(social => {
      this.socialService.update(social.id, {
        url: social.url,
        isActive: social.isActive
      }).subscribe({
        next: () => {
          completed++;
          if (completed + errors === changes.length) this.isSaving.set(false);
        },
        error: (err) => {
          console.error(`Erro ao salvar ${social.platform}:`, err);
          errors++;
          if (completed + errors === changes.length) this.isSaving.set(false);
        }
      });
    });
  }
}
