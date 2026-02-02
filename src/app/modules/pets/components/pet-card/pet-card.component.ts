import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Pet} from '../../../../core/models/pet.model';

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

  defaultPetImage = {
    url: 'images/pet-placeholder.png',
    alt: 'Imagem padrão de pet'
  };

  get petImage() {
    return this.pet.foto ?? this.defaultPetImage;
  }
}
