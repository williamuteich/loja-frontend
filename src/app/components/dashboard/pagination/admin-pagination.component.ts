import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './admin-pagination.component.html'
})
export class PaginationComponent {
  @Input() pageIndex = 0;
  @Input() pageSize = 10;
  @Input() totalItems = 0;
  @Input() disabled = false;

  @Output() pageChange = new EventEmitter<number>();

  get currentPage(): number {
    return this.pageIndex + 1;
  }

  get totalPages(): number {
    if (this.totalItems <= 0 || this.pageSize <= 0) return 1;
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get hasPrevious(): boolean {
    return this.pageIndex > 0;
  }

  get hasNext(): boolean {
    return (this.pageIndex + 1) * this.pageSize < this.totalItems;
  }

  previous(): void {
    if (this.disabled || !this.hasPrevious) return;
    this.pageChange.emit(this.pageIndex - 1);
  }
  
  next(): void {
    if (this.disabled || !this.hasNext) return;
    this.pageChange.emit(this.pageIndex + 1);
  }

  get pageItems(): (number | '...')[] {
    const total = this.totalPages;

    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const items: (number | '...')[] = [];
    const current = this.currentPage;

    const showLeftEllipsis = current > 3;
    const showRightEllipsis = current < total - 2;

    items.push(1);

    if (showLeftEllipsis) {
      items.push('...');
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let p = start; p <= end; p++) {
      items.push(p);
    }

    if (showRightEllipsis) {
      items.push('...');
    }

    if (total > 1) {
      items.push(total);
    }

    return items.filter((item, index, arr) => index === 0 || item !== arr[index - 1]);
  }

  goToPage(page: number | '...'): void {
    if (this.disabled || page === '...') return;

    const maxPage = this.totalPages;
    if (page < 1 || page > maxPage) return;

    this.pageChange.emit(page - 1);
  }
}