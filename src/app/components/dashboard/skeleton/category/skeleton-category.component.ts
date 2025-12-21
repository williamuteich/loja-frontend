import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-skeleton-category',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './skeleton-category.component.html',
    styleUrls: ['./skeleton-category.component.css']
})
export class SkeletonCategoryComponent {
    @Input() items: number = 6;
}
