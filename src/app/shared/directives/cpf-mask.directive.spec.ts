import {Component, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {CpfMaskDirective} from './cpf-mask.component';

@Component({
  standalone: true,
  imports: [FormsModule, CpfMaskDirective],
  template: `<input type="text" appCpfMask [(ngModel)]="cpf">`
})
class TestComponent {
  cpf = '';
}

describe('CpfMaskDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        CpfMaskDirective,
        TestComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    inputEl = fixture.debugElement.query(By.css('input'));
    input = inputEl.nativeElement as HTMLInputElement;
  });

  /* ===============================
   * CRIAÇÃO / APLICAÇÃO
   * =============================== */

  it('should apply the directive to the input element', () => {
    expect(input).toBeTruthy();
  });

  /* ===============================
   * FORMATAÇÃO BÁSICA
   * =============================== */

  it('should format CPF when 11 digits are typed', () => {
    input.value = '12345678901';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('123.456.789-01');
  });

  it('should format CPF progressively', () => {
    input.value = '123456';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('123.456');
  });

  /* ===============================
   * REMOÇÃO DE CARACTERES INVÁLIDOS
   * =============================== */

  it('should remove non-numeric characters', () => {
    input.value = 'abc123.def456-xx789__01';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('123.456.789-01');
  });

  it('should ignore special characters only', () => {
    input.value = '!@#$%^&*()';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('');
  });

  /* ===============================
   * LIMITE DE TAMANHO
   * =============================== */

  it('should limit CPF to 11 digits', () => {
    input.value = '12345678901234567890';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('123.456.789-01');
  });

  /* ===============================
   * EDGE CASES
   * =============================== */

  it('should keep empty value when input is cleared', () => {
    input.value = '';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('');
  });

  it('should handle single digit input', () => {
    input.value = '1';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('1');
  });

  it('should handle partial CPF input (3 digits)', () => {
    input.value = '123';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('123');
  });

  it('should handle partial CPF input (9 digits)', () => {
    input.value = '123456789';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('123.456.789');
  });

  /* ===============================
   * EVENTOS
   * =============================== */

  it('should not break when multiple input events occur', () => {
    input.value = '123';
    input.dispatchEvent(new Event('input'));

    input.value = '1234';
    input.dispatchEvent(new Event('input'));

    input.value = '12345678901';
    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(input.value).toBe('123.456.789-01');
  });
});
