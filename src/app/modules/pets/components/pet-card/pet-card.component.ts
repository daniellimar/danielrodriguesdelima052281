import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {Pet} from '../../../../core/models/pet.model';
import {DEFAULT_PET_IMAGE} from '../../../../shared/constants/default-images';

@Component({
  selector: 'app-pet-card',
  standalone: true,
  templateUrl: './pet-card.component.html',
  styleUrl: './pet-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PetCardComponent {
  @Input({required: true}) pet!: Pet;
  @Output() edit = new EventEmitter<number>();
  @Output() viewDetails = new EventEmitter<number>();

  readonly defaultPetImage = DEFAULT_PET_IMAGE;

  onViewDetails(): void {
    this.viewDetails.emit(this.pet.id);
  }

  onEdit(event: MouseEvent): void {
    event.stopPropagation();
    this.edit.emit(this.pet.id);
  }
}
