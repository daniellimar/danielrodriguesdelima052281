import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TutorFormComponent} from './tutor-form.component';
import {TutorFacade} from '../../../../core/facades/tutor.facade';
import {Router, ActivatedRoute} from '@angular/router';
import {of, Subject, throwError} from 'rxjs';
import {ReactiveFormsModule} from '@angular/forms';
import {describe, it, expect, beforeEach, vi} from 'vitest';

describe('TutorFormComponent', () => {
  let component: TutorFormComponent;
  let fixture: ComponentFixture<TutorFormComponent>;
  let tutorFacadeMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  const selectedTutor$ = new Subject<any>();

  beforeEach(async () => {
    tutorFacadeMock = {
      loadTutorById: vi.fn(),
      clearSelectedTutor: vi.fn(),
      createTutor: vi.fn(),
      updateTutor: vi.fn(),
      uploadPhoto: vi.fn(),
      loading$: of(false),
      selectedTutor$: selectedTutor$.asObservable()
    };

    routerMock = {
      navigate: vi.fn()
    };

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue(null)
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [TutorFormComponent, ReactiveFormsModule],
      providers: [
        {provide: TutorFacade, useValue: tutorFacadeMock},
        {provide: Router, useValue: routerMock},
        {provide: ActivatedRoute, useValue: activatedRouteMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TutorFormComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    selectedTutor$.complete();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in creation mode when there is no id', () => {
    component.id = undefined;

    component.ngOnInit();

    expect(component.isEditMode).toBe(false);
    expect(tutorFacadeMock.clearSelectedTutor).toHaveBeenCalled();
  });

  it('should initialize in edit mode when there is an id', () => {
    component.id = 1;

    component.ngOnInit();

    expect(component.isEditMode).toBe(true);
    expect(tutorFacadeMock.loadTutorById).toHaveBeenCalledWith(1);
  });

  it('should set previewUrl to null when tutor has no photo', () => {
    component.id = 10;
    component.ngOnInit();

    const tutorMock = {
      id: 10,
      nome: 'Jane Doe',
      email: 'jane@example.com',
      telefone: '11987654321',
      endereco: '456 Elm St',
      cpf: '98765432100',
      foto: null
    };

    selectedTutor$.next(tutorMock);

    expect(component.previewUrl).toBeNull();
  });

  it('should not submit invalid form', () => {
    component.onSubmit();

    expect(component.tutorForm.invalid).toBe(true);
    expect(tutorFacadeMock.createTutor).not.toHaveBeenCalled();
  });

  it('should create tutor when form is valid', () => {
    const tutorResponse = {id: 1};
    tutorFacadeMock.createTutor.mockReturnValue(of(tutorResponse));

    component.tutorForm.setValue({
      nome: 'Alice Smith',
      email: 'alice@example.com',
      telefone: '11999887766',
      endereco: '789 Oak Ave',
      cpf: '11122233344'
    });

    component.onSubmit();

    expect(tutorFacadeMock.createTutor).toHaveBeenCalledWith({
      nome: 'Alice Smith',
      email: 'alice@example.com',
      telefone: '11999887766',
      endereco: '789 Oak Ave',
      cpf: '11122233344'
    });

    expect(routerMock.navigate).toHaveBeenCalledWith(['/tutores']);
  });

  it('should update tutor when in edit mode', () => {
    component.id = 2;
    component.isEditMode = true;

    tutorFacadeMock.updateTutor.mockReturnValue(of({id: 2}));

    component.tutorForm.setValue({
      nome: 'Bob Johnson',
      email: 'bob@example.com',
      telefone: '11988776655',
      endereco: '321 Pine St',
      cpf: '55566677788'
    });

    component.onSubmit();

    expect(tutorFacadeMock.updateTutor).toHaveBeenCalledWith(2, {
      nome: 'Bob Johnson',
      email: 'bob@example.com',
      telefone: '11988776655',
      endereco: '321 Pine St',
      cpf: '55566677788'
    });
  });

  it('should upload photo after saving tutor', () => {
    const file = new File(['photo'], 'photo.png');
    component.selectedFile = file;

    tutorFacadeMock.createTutor.mockReturnValue(of({id: 5}));
    tutorFacadeMock.uploadPhoto.mockReturnValue(of({}));

    component.tutorForm.setValue({
      nome: 'Charlie Brown',
      email: 'charlie@example.com',
      telefone: '11977665544',
      endereco: '654 Maple Dr',
      cpf: '99988877766'
    });

    component.onSubmit();

    expect(tutorFacadeMock.uploadPhoto).toHaveBeenCalledWith(5, file);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/tutores']);
  });

  it('should handle error when saving tutor', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {
    });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
    });

    tutorFacadeMock.createTutor.mockReturnValue(
      throwError(() => ({
        error: {message: 'API Error'}
      }))
    );

    component.tutorForm.setValue({
      nome: 'David Lee',
      email: 'david@example.com',
      telefone: '11966554433',
      endereco: '987 Birch Ln',
      cpf: '44455566677'
    });

    component.onSubmit();

    expect(consoleSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('API Error');

    alertSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  it('should show default error message when error has no message', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {
    });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
    });

    tutorFacadeMock.createTutor.mockReturnValue(
      throwError(() => ({}))
    );

    component.tutorForm.setValue({
      nome: 'Eve Wilson',
      email: 'eve@example.com',
      telefone: '11955443322',
      endereco: '147 Cedar Ct',
      cpf: '33344455566'
    });

    component.onSubmit();

    expect(alertSpy).toHaveBeenCalledWith('Erro ao salvar tutor. Tente novamente.');

    alertSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  it('should update preview when selecting file', () => {
    const file = new File(['img'], 'photo.jpg');

    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:url');

    component.handleFileSelected(file);

    expect(component.selectedFile).toBe(file);
    expect(component.previewUrl).toBe('blob:url');
  });

  it('should revoke old preview URL when selecting new file', () => {
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {
    });
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:new-url');

    component.previewUrl = 'blob:old-url';
    const file = new File(['img'], 'new-photo.jpg');

    component.handleFileSelected(file);

    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:old-url');
    expect(component.previewUrl).toBe('blob:new-url');

    revokeObjectURLSpy.mockRestore();
  });

  it('should expose form controls as getters', () => {
    expect(component.nomeControl).toBe(component.tutorForm.get('nome'));
    expect(component.emailControl).toBe(component.tutorForm.get('email'));
    expect(component.telefoneControl).toBe(component.tutorForm.get('telefone'));
    expect(component.enderecoControl).toBe(component.tutorForm.get('endereco'));
    expect(component.cpfControl).toBe(component.tutorForm.get('cpf'));
  });

  it('should validate nome field', () => {
    const nomeControl = component.nomeControl;

    nomeControl?.setValue('');
    expect(nomeControl?.hasError('required')).toBe(true);

    nomeControl?.setValue('Jo');
    expect(nomeControl?.hasError('minlength')).toBe(true);

    nomeControl?.setValue('John Doe');
    expect(nomeControl?.valid).toBe(true);
  });

  it('should validate email field', () => {
    const emailControl = component.emailControl;

    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBe(true);

    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);

    emailControl?.setValue('valid@example.com');
    expect(emailControl?.valid).toBe(true);
  });

  it('should validate cpf field', () => {
    const cpfControl = component.cpfControl;

    cpfControl?.setValue('');
    expect(cpfControl?.hasError('required')).toBe(true);

    cpfControl?.setValue('123');
    expect(cpfControl?.hasError('pattern')).toBe(true);

    cpfControl?.setValue('12345678901');
    expect(cpfControl?.valid).toBe(true);
  });

  it('should not call loadTutorData if id is undefined', () => {
    component.id = undefined;
    component.loadTutorData();

    expect(tutorFacadeMock.loadTutorById).not.toHaveBeenCalled();
  });
});
