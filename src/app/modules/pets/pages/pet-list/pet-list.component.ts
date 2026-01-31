import {Component, OnInit, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PetFacade} from '../../../../core/facades/pet.facade';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pet-list.component.html'
})
export class PetListComponent implements OnInit {
  private petFacade = inject(PetFacade);

  pets$ = this.petFacade.pets$;
  loading$ = this.petFacade.loading$;
  searchTerm = '';

  ngOnInit() {
    this.petFacade.loadPets();
  }

  onSearch() {
    this.petFacade.loadPets(0, this.searchTerm);
  }
}
