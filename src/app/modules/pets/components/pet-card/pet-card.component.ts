import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Pet} from '../../../../core/models/pet.model';
import {DEFAULT_PET_IMAGE} from '../../../../shared/constants/default-images';

@Component({
  selector: 'app-pet-card',
  standalone: true,
  templateUrl: './pet-card.component.html',
  styleUrl: './pet-card.component.scss'
})
export class PetCardComponent {
  @Input({required: true}) pet!: Pet;
  @Output() viewDetails = new EventEmitter<number>();

  onViewDetails(): void {
    this.viewDetails.emit(this.pet.id);
  }

  defaultPetImage = DEFAULT_PET_IMAGE;

  get petImage() {
    return this.pet.foto ?? this.defaultPetImage;
  }
}
