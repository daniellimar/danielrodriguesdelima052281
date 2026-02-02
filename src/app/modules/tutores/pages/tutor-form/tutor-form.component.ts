import {Component, OnInit, Input, inject, numberAttribute} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {TutorFacade} from '../../../../core/facades/tutor.facade';
import {CreateTutorDto} from '../../../../core/models/tutor.model';
import {switchMap, of} from 'rxjs';

@Component({
  selector: 'app-tutor-form',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, RouterLink],
  templateUrl: './tutor-form.component.html',
  styleUrl: './tutor-form.component.scss'
})
export class TutorFormComponent implements OnInit {
  @Input({transform: numberAttribute}) id?: number;

  private fb = inject(FormBuilder);
  private tutorFacade = inject(TutorFacade);
  private router = inject(Router);

  loading$ = this.tutorFacade.loading$;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isEditMode = false;

  tutorForm: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required]],
    endereco: ['', [Validators.required]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]]
  });

  ngOnInit(): void {
    this.isEditMode = Number.isFinite(this.id);

    if (this.isEditMode && this.id != null) {
      this.loadTutorData();
    } else {
      this.tutorFacade.clearSelectedTutor();
    }
  }

  loadTutorData(): void {
    if (!this.id) return;

    this.tutorFacade.loadTutorById(this.id);
    this.tutorFacade.selectedTutor$.subscribe(tutor => {
      if (tutor) {
        this.tutorForm.patchValue({
          nome: tutor.nome,
          email: tutor.email,
          telefone: tutor.telefone,
          endereco: tutor.endereco,
          cpf: tutor.cpf
        });
        this.previewUrl = tutor.foto?.url || null;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.tutorForm.invalid) {
      this.tutorForm.markAllAsTouched();
      return;
    }

    const tutorDto: CreateTutorDto = {
      nome: this.tutorForm.value.nome,
      email: this.tutorForm.value.email,
      telefone: this.tutorForm.value.telefone,
      endereco: this.tutorForm.value.endereco,
      cpf: Number(this.tutorForm.value.cpf)
    };

    const saveOperation = this.isEditMode && this.id
      ? this.tutorFacade.updateTutor(this.id, tutorDto)
      : this.tutorFacade.createTutor(tutorDto);

    saveOperation.pipe(
      switchMap((tutor) => {
        if (this.selectedFile && tutor.id) {
          return this.tutorFacade.uploadPhoto(tutor.id, this.selectedFile);
        }
        return of(tutor);
      })
    ).subscribe({
      next: () => {
        this.router.navigate(['/tutores']);
      },
      error: (err) => {
        console.error('Erro ao salvar tutor:', err);
        const errorMsg = err?.error?.message || 'Erro ao salvar tutor. Tente novamente.';
        alert(errorMsg);
      }
    });
  }

  get nomeControl() {
    return this.tutorForm.get('nome');
  }

  get emailControl() {
    return this.tutorForm.get('email');
  }

  get telefoneControl() {
    return this.tutorForm.get('telefone');
  }

  get enderecoControl() {
    return this.tutorForm.get('endereco');
  }

  get cpfControl() {
    return this.tutorForm.get('cpf');
  }
}
