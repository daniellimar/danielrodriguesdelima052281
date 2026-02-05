import {Component, OnInit, Input, inject, numberAttribute, DestroyRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {PetFacade} from '../../../../core/facades/pet.facade';
import {CreatePetDto} from '../../../../core/services/pet.service';
import {switchMap, of} from 'rxjs';
import {FormHeaderComponent} from '../../../../shared/components/form-header/form-header.component';
import {ImageUploadComponent} from '../../../../shared/components/image-upload/image-upload.component';
import {FormActionsComponent} from '../../../../shared/components/form-actions/form-actions.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormHeaderComponent, ImageUploadComponent, FormActionsComponent],
  templateUrl: './pet-form.component.html',
  styleUrl: './pet-form.component.scss'
})
export class PetFormComponent implements OnInit {
  @Input({transform: numberAttribute}) id?: number;

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private petFacade = inject(PetFacade);
  private readonly destroyRef = inject(DestroyRef);

  loading$ = this.petFacade.loading$;
  isEditMode = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  errorMessage: string | null = null;

  petForm: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(2)]],
    raca: ['', [Validators.required]],
    idade: ['', [Validators.required, Validators.min(0), Validators.max(30)]],
  });

  ngOnInit(): void {
    this.isEditMode = Number.isFinite(this.id);

    if (this.isEditMode && this.id != null) {
      this.loadPetData();
    } else {
      this.petFacade.clearSelectedPet();
    }
  }

  loadPetData(): void {
    if (!this.id) return;

    this.petFacade.loadPetById(this.id);
    this.petFacade.selectedPet$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(pet => {
        if (pet) {
          this.petForm.patchValue({
            nome: pet.nome,
            raca: pet.raca,
            idade: pet.idade,
          });
          this.previewUrl = pet.foto?.url || null;
        }
      });
  }

  handleFileSelected(file: File): void {
    this.selectedFile = file;

    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }

    this.previewUrl = URL.createObjectURL(file);
  }

  onSubmit(): void {
    if (this.petForm.invalid) {
      this.petForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;

    const petDto: CreatePetDto = {
      nome: this.petForm.value.nome,
      raca: this.petForm.value.raca,
      idade: Number(this.petForm.value.idade)
    };

    const saveOperation = this.isEditMode && this.id
      ? this.petFacade.updatePet(this.id, petDto)
      : this.petFacade.createPet(petDto);

    saveOperation.pipe(
      switchMap((pet) => {
        if (this.selectedFile && pet.id) {
          return this.petFacade.uploadPhoto(pet.id, this.selectedFile);
        }
        return of(pet);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.router.navigate(['/pets']);
      },
      error: (err) => {
        console.error('Erro ao salvar pet:', err);
        this.errorMessage = err?.error?.message
          || err?.message
          || 'Erro ao salvar pet. Tente novamente.';
      }
    });
  }

  get nomeControl() {
    return this.petForm.get('nome');
  }

  get racaControl() {
    return this.petForm.get('raca');
  }

  get idadeControl() {
    return this.petForm.get('idade');
  }
}
