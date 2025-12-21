import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Search } from 'lucide-angular';

@Component({
    selector: 'app-admin-search',
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './admin-search.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminSearchComponent {
    placeholder = input<string>('Buscar...');
    search = output<string>();
    readonly Search = Search;

    onSearch(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.search.emit(value);
    }
}
