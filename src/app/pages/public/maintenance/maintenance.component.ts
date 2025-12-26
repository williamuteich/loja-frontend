import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreConfigService } from '../../../services/store-config.service';

@Component({
    selector: 'app-maintenance',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-white to-slate-50 px-4">
      <div class="max-w-2xl w-full">
        <div class="bg-white rounded-3xl shadow-2xl border-2 border-pink-100 p-8 md:p-12 text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-pink-500 to-pink-700 rounded-2xl mb-6 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
              <path d="M12 8v4"></path>
              <path d="M12 16h.01"></path>
            </svg>
          </div>
          
          <h1 class="font-display text-3xl md:text-5xl font-bold text-slate-900 mb-4">
            Em Manutenção
          </h1>
          
          <p class="text-slate-600 text-lg md:text-xl mb-8 leading-relaxed">
            {{ config()?.maintenanceMessage || 'Estamos realizando manutenção no site. Por favor, volte em breve.' }}
          </p>
          
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div class="flex items-center gap-2 text-sm text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Voltaremos em breve</span>
            </div>
          </div>

          @if (config()?.whatsapp) {
          <div class="mt-8 pt-8 border-t border-pink-100">
            <p class="text-sm text-slate-500 mb-4">Precisa falar conosco?</p>
            <a [href]="'https://wa.me/' + formatWhatsApp(config()?.whatsapp || '')" target="_blank"
              class="inline-flex items-center gap-2 bg-linear-to-br from-[#25D366] to-[#128C7E] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Falar no WhatsApp
            </a>
          </div>
          }
        </div>
      </div>
    </div>
  `
})
export class MaintenanceComponent {
    protected readonly storeConfigService = inject(StoreConfigService);
    protected readonly config = this.storeConfigService.config;

    protected formatWhatsApp(phone: string): string {
        return phone.replace(/\D/g, '');
    }
}
