import {Component, OnInit, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {PetFacade} from '../../../../core/facades/pet.facade';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  templateUrl: './pet-list.component.html'
})
export class PetListComponent implements OnInit {
  private petFacade = inject(PetFacade);

  protected readonly Math = Math;

  pets$ = this.petFacade.pets$;
  loading$ = this.petFacade.loading$;
  currentPage$ = this.petFacade.currentPage$;
  totalPages$ = this.petFacade.totalPages$;
  totalElements$ = this.petFacade.totalElements$;

  searchTerm = '';

  ngOnInit() {
    this.petFacade.loadPets();
  }

  onSearch() {
    this.petFacade.loadPets(0, this.searchTerm);
  }

  changePage(page: number): void {
    this.petFacade.loadPets(page, this.searchTerm);
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  get pages(): number[] {
    const total = this.petFacade.currentPage;
    const current = this.petFacade.currentPage;

    const maxPages = 5;
    const half = Math.floor(maxPages / 2);

    let start = Math.max(0, current - half);
    let end = Math.min(total, start + maxPages);

    if (end - start < maxPages) {
      start = Math.max(0, end - maxPages);
    }

    return Array.from({length: end - start}, (_, i) => start + i);
  }

  get currentPageValue(): number {
    let value: number | null = null;
    this.currentPage$.subscribe(v => value = v).unsubscribe();
    return value ?? 0;
  }

  get totalElementsValue(): number {
    let value: number | null = null;
    this.totalElements$.subscribe(v => value = v).unsubscribe();
    return value ?? 0;
  }

  get totalPagesValue(): number {
    let value: number | null = null;
    this.totalPages$.subscribe(v => value = v).unsubscribe();
    return value ?? 1;
  }
}
