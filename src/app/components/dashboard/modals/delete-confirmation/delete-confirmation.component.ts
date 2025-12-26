import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
    selector: 'app-delete-confirmation',
    imports: [CommonModule],
    templateUrl: './delete-confirmation.component.html',
})
export class DeleteConfirmationComponent {
    itemName = input.required<string>();
    itemType = input<string>('este item');
    warningMessage = input<string | null>(null);
    canConfirm = input<boolean>(true);

    confirm = output<void>();
    cancel = output<void>();
}