import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-skeleton-table',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './skeletonForm.component.html',
    styleUrls: ['./skeletonForm.component.css']
})
export class SkeletonTableComponent {
    @Input() rows: number = 5;
    @Input() columns: number = 4;
}