import { Component } from '@angular/core';

@Component({
    selector: 'app-settings',
    standalone: true,
    template: `
    <div class="p-4">
      <h2 class="text-xl font-bold">Settings</h2>
      <p>System configurations.</p>
    </div>
  `
})
export class SettingsComponent { }
