import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormActionsComponent} from './form-actions.component';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';

describe('FormActionsComponent', () => {
  let component: FormActionsComponent;
  let fixture: ComponentFixture<FormActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormActionsComponent,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default cancelRoute as "/"', () => {
    expect(component.cancelRoute).toBe('/');
  });

  it('should have loading$ as null by default', () => {
    expect(component.loading$).toBeNull();
  });

  it('should have default submitLabel as "Cadastrar"', () => {
    expect(component.submitLabel).toBe('Cadastrar');
  });

  it('should have default editLabel as "Salvar Alterações"', () => {
    expect(component.editLabel).toBe('Salvar Alterações');
  });

  it('should update editLabel when input changes', () => {
    component.editLabel = 'Update';
    fixture.detectChanges();

    expect(component.editLabel).toBe('Update');
  });
});
