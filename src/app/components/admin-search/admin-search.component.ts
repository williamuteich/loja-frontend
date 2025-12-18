import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Search } from 'lucide-angular';

@Component({
    selector: 'app-admin-search',
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './admin-search.component.html'
})
export class AdminSearchComponent {
    @Input() placeholder: string = 'Buscar...';
    @Output() search = new EventEmitter<string>();
    readonly Search = Search;

    onSearch(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.search.emit(value);
    }
}
