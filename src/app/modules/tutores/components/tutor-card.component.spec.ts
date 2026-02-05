import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TutorCardComponent} from './tutor-card.component';
import {describe, it, expect, beforeEach, vi} from 'vitest';

describe('TutorCardComponent', () => {
  let component: TutorCardComponent;
  let fixture: ComponentFixture<TutorCardComponent>;

  const tutorMock: any = {
    id: 1,
    nome: 'John Doe'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TutorCardComponent);
    component = fixture.componentInstance;

    component.tutor = tutorMock;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit viewDetails with tutor id when onViewDetails is called', () => {
    const emitSpy = vi.spyOn(component.viewDetails, 'emit');

    component.onViewDetails();

    expect(emitSpy).toHaveBeenCalledWith(1);
  });

  it('should stop propagation and emit edit with tutor id when onEdit is called', () => {
    const emitSpy = vi.spyOn(component.edit, 'emit');
    const event = {stopPropagation: vi.fn()} as unknown as MouseEvent;

    component.onEdit(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(1);
  });

  it('should stop propagation and emit delete with tutor id when confirm returns true', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const emitSpy = vi.spyOn(component.delete, 'emit');
    const event = {stopPropagation: vi.fn()} as unknown as MouseEvent;

    component.onDelete(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(confirmSpy).toHaveBeenCalledWith('Deseja realmente excluir o tutor John Doe?');
    expect(emitSpy).toHaveBeenCalledWith(1);

    confirmSpy.mockRestore();
  });

  it('should stop propagation and NOT emit delete when confirm returns false', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const emitSpy = vi.spyOn(component.delete, 'emit');
    const event = {stopPropagation: vi.fn()} as unknown as MouseEvent;

    component.onDelete(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(confirmSpy).toHaveBeenCalledWith('Deseja realmente excluir o tutor John Doe?');
    expect(emitSpy).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('should allow setting isDeleting input', () => {
    component.isDeleting = true;
    fixture.detectChanges();

    expect(component.isDeleting).toBe(true);
  });
});
