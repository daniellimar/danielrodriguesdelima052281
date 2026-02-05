import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

export type ViewMode = 'grid' | 'list' | 'compact';
export type CardsPerRow = 2 | 3 | 4 | 5;

@Component({
  selector: 'app-view-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-controls.component.html',
  styleUrls: ['./view-controls.component.scss']
})
export class ViewControlsComponent {
  @Input() viewMode: ViewMode = 'grid';
  @Input() cardsPerRow: CardsPerRow = 4;

  @Output() viewModeChange = new EventEmitter<ViewMode>();
  @Output() cardsPerRowChange = new EventEmitter<CardsPerRow>();

  readonly cardsPerRowOptions: ReadonlyArray<CardsPerRow> = [2, 3, 4, 5] as const;

  onViewModeChange(mode: ViewMode): void {
    this.viewModeChange.emit(mode);
  }

  onCardsPerRowChange(count: CardsPerRow): void {
    this.cardsPerRowChange.emit(count);
  }
}
