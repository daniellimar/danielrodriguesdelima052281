import {Component, OnInit, Input, inject, numberAttribute} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AsyncPipe, DatePipe} from '@angular/common';
import {TutorFacade} from '../../../../core/facades/tutor.facade';

@Component({
  selector: 'app-tutor-detail',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './tutor-detail.component.html',
  styleUrl: './tutor-detail.component.scss'
})
export class TutorDetailComponent implements OnInit {
  @Input({transform: numberAttribute}) id!: number;

  private tutorFacade = inject(TutorFacade);

  tutor$ = this.tutorFacade.selectedTutor$;
  pets$ = this.tutorFacade.tutorPets$;
  loading$ = this.tutorFacade.loading$;

  ngOnInit(): void {
    if (this.id) {
      this.tutorFacade.loadTutorById(this.id);
    }
  }

  onUnlinkPet(petId: number): void {
    if (confirm('Deseja realmente remover o vínculo deste pet com o tutor?')) {
      this.tutorFacade.unlinkPet(this.id, petId).subscribe({
        next: () => alert('Vínculo removido com sucesso!'),
        error: () => alert('Erro ao remover vínculo.')
      });
    }
  }
}
