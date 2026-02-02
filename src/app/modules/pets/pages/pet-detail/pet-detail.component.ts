import {Component, OnInit, Input, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {PetFacade} from '../../../../core/facades/pet.facade';

@Component({
  selector: 'app-pet-detail',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './pet-detail.component.html',
  styleUrl: './pet-detail.component.scss'
})
export class PetDetailComponent implements OnInit {
  @Input() id!: string;

  private petFacade = inject(PetFacade);

  pet$ = this.petFacade.selectedPet$;
  loading$ = this.petFacade.loading$;

  ngOnInit(): void {
    if (this.id) {
      this.petFacade.loadPetById(Number(this.id));
    }
  }
}
