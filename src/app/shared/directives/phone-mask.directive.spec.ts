import {Component, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {PhoneMaskDirective} from './phone-mask.component';

@Component({
  standalone: true,
  imports: [FormsModule, PhoneMaskDirective, PhoneMaskDirective],
  template: `<input type="text" appPhoneMask [(ngModel)]="phone">`
})
class TestComponent {
  phone = '';
}

describe('PhoneMaskDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        PhoneMaskDirective,
        TestComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    inputEl = fixture.debugElement.query(By.css('input'));
    input = inputEl.nativeElement as HTMLInputElement;
  });

  /* ===============================
   * APLICAÇÃO DA DIRECTIVE
   * =============================== */

  it('should apply the directive to the input element', () => {
    expect(input).toBeTruthy();
  });

  /* ===============================
   * FORMATAÇÃO – CELULAR (11 dígitos)
   * =============================== */

  it('should format phone number with 11 digits (cellphone)', () => {
    input.value = '11987654321';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('(11) 98765-4321');
  });

  /* ===============================
   * FORMATAÇÃO – TELEFONE FIXO (10 dígitos)
   * =============================== */

  it('should format phone number with 10 digits (landline)', () => {
    input.value = '1132654321';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('(11) 3265-4321');
  });

  /* ===============================
   * FORMATAÇÃO PROGRESSIVA
   * =============================== */

  it('should format progressively while typing', () => {
    input.value = '11';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(input.value).toBe('(11');

    input.value = '119';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(input.value).toBe('(11) 9');

    input.value = '119876';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(input.value).toBe('(11) 9876');

    input.value = '11987654321';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(input.value).toBe('(11) 98765-4321');
  });

  /* ===============================
   * REMOÇÃO DE CARACTERES INVÁLIDOS
   * =============================== */

  it('should remove non-numeric characters', () => {
    input.value = 'abc(11)9x8y7z6-5@4#3$2%1';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('(11) 98765-4321');
  });

  /* ===============================
   * LIMITE DE TAMANHO
   * =============================== */

  it('should limit phone number to 11 digits', () => {
    input.value = '1198765432199999';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('(11) 98765-4321');
  });

  /* ===============================
   * EDGE CASES
   * =============================== */

  it('should keep empty value when input is empty', () => {
    input.value = '';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('');
  });

  it('should handle single digit input', () => {
    input.value = '1';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('(1');
  });

  it('should handle only DDD input', () => {
    input.value = '11';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('(11');
  });

  /* ===============================
   * BLUR EVENT
   * =============================== */

  it('should reapply mask after blur triggers input', () => {
    input.value = '11987654321';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    // blur remove máscara, mas dispara input de novo
    expect(input.value).toBe('(11) 98765-4321');
  });

  /* ===============================
   * EVENTOS MÚLTIPLOS
   * =============================== */

  it('should handle multiple input events without breaking', () => {
    input.value = '1';
    input.dispatchEvent(new Event('input'));

    input.value = '11';
    input.dispatchEvent(new Event('input'));

    input.value = '11987654321';
    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(input.value).toBe('(11) 98765-4321');
  });
});
