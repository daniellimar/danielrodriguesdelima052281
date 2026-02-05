import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Tutor} from '../../../core/models/tutor.model';

@Component({
  selector: 'app-tutor-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tutor-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TutorCardComponent {
  @Input({required: true}) tutor!: Tutor;
  @Input() isDeleting = false;

  @Output() edit = new EventEmitter<number>();
  @Output() viewDetails = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  onViewDetails(): void {
    this.viewDetails.emit(this.tutor.id);
  }

  onEdit(event: MouseEvent): void {
    event.stopPropagation();
    this.edit.emit(this.tutor.id);
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    if (confirm(`Deseja realmente excluir o tutor ${this.tutor.nome}?`)) {
      this.delete.emit(this.tutor.id);
    }
  }
}
