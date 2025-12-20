import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generic-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-modal.html',
  styleUrl: './generic-modal.css',
})
export class GenericModal {
  @Input() title: string = '';
  @Input() cancelText: string = 'Cancelar';
  @Input() saveText: string = 'Salvar';
  @Input() isLoading: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
}