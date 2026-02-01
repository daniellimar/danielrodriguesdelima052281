import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input({ required: true }) currentPage = 0;
  @Input({ required: true }) totalPages = 1;
  @Input({ required: true }) totalElements = 0;
  @Input() itemsPerPage = 10;

  @Output() pageChange = new EventEmitter<number>();

  protected readonly Math = Math;

  get pages(): number[] {
    const maxPages = 5;
    const half = Math.floor(maxPages / 2);

    let start = Math.max(0, this.currentPage - half);
    let end = Math.min(this.totalPages, start + maxPages);

    if (end - start < maxPages) {
      start = Math.max(0, end - maxPages);
    }

    return Array.from({ length: end - start }, (_, i) => start + i);
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
