import {Component, OnInit, inject, DestroyRef} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {TutorFacade} from '../../../../core/facades/tutor.facade';
import {SearchBarComponent} from '../../../../shared/components/search-bar/search-bar.component';
import {PaginationComponent} from '../../../../shared/components/pagination/pagination.component';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tutor-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink, SearchBarComponent, PaginationComponent],
  templateUrl: './tutor-list.component.html',
  styleUrl: './tutor-list.component.scss'
})
export class TutorListComponent implements OnInit {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private tutorFacade = inject(TutorFacade);
  private searchSubject = new Subject<string>();

  tutores$ = this.tutorFacade.tutores$;
  loading$ = this.tutorFacade.loading$;
  currentPage$ = this.tutorFacade.currentPage$;
  totalPages$ = this.tutorFacade.totalPages$;
  totalElements$ = this.tutorFacade.totalElements$;

  searchTerm = '';

  ngOnInit(): void {
    this.tutorFacade.loadTutores();

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(term => {
      this.tutorFacade.loadTutores(0, term);
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  onPageChange(page: number): void {
    this.tutorFacade.loadTutores(page, this.searchTerm);
  }

  onViewTutorDetails(id: number): void {
    this.router.navigate(['/tutores', id]);
  }

  onEditTutor(id: number): void {
    this.router.navigate(['/tutores', id, 'editar']);
  }
}
