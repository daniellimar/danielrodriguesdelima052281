import {Component, Input, Output, EventEmitter} from '@angular/core';
import {RouterLink, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './page-header.component.html'
})
export class PageHeaderComponent {
  @Input() title!: string;
  @Input() subtitle?: string;

  @Input() iconBgClass = 'from-blue-500 to-blue-600';
  @Input() actionLabel?: string;
  @Input() actionRoute?: string;

  @Input() searchPlaceholder?: string;
  @Input() searchValue = '';
  @Input() showSearch = false;

  @Output() searchChange = new EventEmitter<string>();

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }
}
