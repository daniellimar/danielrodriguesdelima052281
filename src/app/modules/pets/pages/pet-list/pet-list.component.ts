import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PetFacade } from '../../../../core/facades/pet.facade';
import { PetCardComponent } from '../../components/pet-card/pet-card.component';
import { SearchBarComponent } from '../../../../shared/components/search-bar/search-bar.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [
    AsyncPipe,
    PetCardComponent,
    SearchBarComponent,
    PaginationComponent
  ],
  templateUrl: './pet-list.component.html'
})
export class PetListComponent implements OnInit {
  private petFacade = inject(PetFacade);

  pets$ = this.petFacade.pets$;
  loading$ = this.petFacade.loading$;
  currentPage$ = this.petFacade.currentPage$;
  totalPages$ = this.petFacade.totalPages$;
  totalElements$ = this.petFacade.totalElements$;

  searchTerm = '';

  ngOnInit(): void {
    this.petFacade.loadPets();
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.petFacade.loadPets(0, term);
  }

  onPageChange(page: number): void {
    this.petFacade.loadPets(page, this.searchTerm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onViewPetDetails(petId: number): void {
    // TODO: Navegar para a tela de detalhes
    console.log('View pet details:', petId);
  }
}
