import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, AlertCircle } from 'lucide-angular';

@Component({
    selector: 'app-empty-state',
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
    @Input() title: string = 'Nenhum item encontrado';
    @Input() description: string = 'Não conseguimos encontrar nenhum registro no momento.';
    @Input() icon: any = AlertCircle;
}