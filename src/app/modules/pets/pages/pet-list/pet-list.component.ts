import {Component, OnInit, inject, DestroyRef} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {PetFacade} from '../../../../core/facades/pet.facade';
import {PetCardComponent} from '../../components/pet-card/pet-card.component';
import {PaginationComponent} from '../../../../shared/components/pagination/pagination.component';
import {ViewControlsComponent} from '../../../../shared/components/view-controls/view-controls.component';
import {PageHeaderComponent} from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [
    AsyncPipe,
    PetCardComponent,
    PaginationComponent,
    ViewControlsComponent,
    PageHeaderComponent
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
  deletingPetId: number | null = null;

  constructor() {
    this.initSearchDebounce();
  }

  ngOnInit(): void {
    const savedViewMode = localStorage.getItem('petViewMode') as 'grid' | 'list' | 'compact';
    const savedCardsPerRow = localStorage.getItem('petCardsPerRow');

    if (savedViewMode) this.viewMode = savedViewMode;
    if (savedCardsPerRow) this.cardsPerRow = parseInt(savedCardsPerRow) as 2 | 3 | 4 | 5;

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

  onDelete(id: number): void {
    this.deletingPetId = id;
    this.petFacade.deletePet(id);

    setTimeout(() => {
      this.deletingPetId = null;
    }, 2000);
  }

  viewMode: 'grid' | 'list' | 'compact' = 'grid';
  cardsPerRow: 2 | 3 | 4 | 5 = 4;

  setViewMode(mode: 'grid' | 'list' | 'compact'): void {
    this.viewMode = mode;
    localStorage.setItem('petViewMode', mode);
  }

  setCardsPerRow(count: 2 | 3 | 4 | 5): void {
    this.cardsPerRow = count;
    localStorage.setItem('petCardsPerRow', count.toString());
  }

  getGridClasses(): string {
    if (this.viewMode === 'list') {
      return 'grid grid-cols-1 gap-3';
    }
    if (this.viewMode === 'compact') {
      return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3';
    }

    const gridMap = {
      2: 'grid grid-cols-1 sm:grid-cols-2 gap-6',
      3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5',
      4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5',
      5: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'
    };
    return gridMap[this.cardsPerRow];
  }
}
