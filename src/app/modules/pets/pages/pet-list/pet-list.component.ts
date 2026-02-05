import {Component, OnInit, inject, DestroyRef} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {PetFacade} from '../../../../core/facades/pet.facade';
import {PetCardComponent} from '../../components/pet-card/pet-card.component';
import {SearchBarComponent} from '../../../../shared/components/search-bar/search-bar.component';
import {PaginationComponent} from '../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [
    AsyncPipe,
    PetCardComponent,
    SearchBarComponent,
    PaginationComponent,
    RouterLink
  ],
  templateUrl: './pet-list.component.html'
})
export class PetListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly petFacade = inject(PetFacade);
  private readonly destroyRef = inject(DestroyRef);

  private readonly searchSubject = new Subject<string>();

  // Observables expostos pela Facade
  readonly pets$ = this.petFacade.pets$;
  readonly loading$ = this.petFacade.loading$;
  readonly error$ = this.petFacade.error$;
  readonly currentPage$ = this.petFacade.currentPage$;
  readonly totalPages$ = this.petFacade.totalPages$;
  readonly totalElements$ = this.petFacade.totalElements$;

  searchTerm = '';

  constructor() {
    this.initSearchDebounce();
  }

  ngOnInit(): void {
    this.searchTerm = this.petFacade.searchTerm;
    this.petFacade.loadPets(this.petFacade.currentPage, this.searchTerm);
  }

  private initSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef) // Evita Memory Leak
    ).subscribe(term => {
      this.petFacade.loadPets(0, term);
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  onPageChange(page: number): void {
    if (page !== this.petFacade.currentPage) {
      this.petFacade.loadPets(page, this.searchTerm);
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }

  onRetry(): void {
    this.petFacade.loadPets(this.petFacade.currentPage, this.searchTerm);
  }

  onViewPetDetails(petId: number): void {
    this.router.navigate(['/pets', petId]);
  }

  onEditPet(id: number): void {
    this.router.navigate(['/pets', id, 'editar']);
  }
}
