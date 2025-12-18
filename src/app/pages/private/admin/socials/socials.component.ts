import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-socials',
    imports: [CommonModule],
    template: `
    <div class="p-12 md:p-24">
      <h2 class="text-2xl font-bold text-slate-900 mb-6">Redes Sociais</h2>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <p class="text-slate-500">Configuração de redes sociais em breve...</p>
      </div>
    </div>
  `
})
export class SocialsComponent { }
