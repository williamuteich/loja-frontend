import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Search } from 'lucide-angular';

@Component({
    selector: 'app-admin-search',
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './admin-search.component.html'
})
export class AdminSearchComponent {
    @Input() placeholder: string = 'Buscar...';
    readonly Search = Search;
}
