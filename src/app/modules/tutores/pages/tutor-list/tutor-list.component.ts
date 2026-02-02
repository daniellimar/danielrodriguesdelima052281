import {Component, OnInit, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {TutorFacade} from '../../../../core/facades/tutor.facade';
import {SearchBarComponent} from '../../../../shared/components/search-bar/search-bar.component';
import {PaginationComponent} from '../../../../shared/components/pagination/pagination.component';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-tutor-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink, SearchBarComponent, PaginationComponent],
  templateUrl: './tutor-list.component.html',
  styleUrl: './tutor-list.component.scss'
})
export class TutorListComponent implements OnInit {
  private tutorFacade = inject(TutorFacade);
  private router = inject(Router);

  tutores$ = this.tutorFacade.tutores$;
  loading$ = this.tutorFacade.loading$;
  currentPage$ = this.tutorFacade.currentPage$;
  totalPages$ = this.tutorFacade.totalPages$;

  searchTerm = '';
  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.tutorFacade.loadTutores();

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
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
