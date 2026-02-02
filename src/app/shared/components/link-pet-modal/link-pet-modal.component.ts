import {Component, OnInit, Output, EventEmitter, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {PetFacade} from '../../../core/facades/pet.facade';

@Component({
  selector: 'app-link-pet-modal',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './link-pet-modal.component.html',
  styleUrl: './link-pet-modal.component.scss'
})
export class LinkPetModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() selectPet = new EventEmitter<number>();

  private petFacade = inject(PetFacade);

  pets$ = this.petFacade.pets$;
  loading$ = this.petFacade.loading$;
  searchTerm = '';

  ngOnInit(): void {
    this.petFacade.loadPets(0, '');
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.petFacade.loadPets(0, this.searchTerm);
  }

  onSelectPet(petId: number): void {
    this.selectPet.emit(petId);
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
