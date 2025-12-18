import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-team',
    imports: [CommonModule],
    template: `
    <div class="p-12 md:p-24">
      <h2 class="text-2xl font-bold text-slate-900 mb-6">Equipe</h2>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <p class="text-slate-500">Gestão de equipe em breve...</p>
      </div>
    </div>
  `
})
export class TeamComponent { }
