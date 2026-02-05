import {Directive, HostListener, ElementRef} from '@angular/core';

@Directive({
  selector: '[appPhoneMask]',
  standalone: true
})
export class PhoneMaskDirective {
  constructor(private el: ElementRef) {
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito

    // Limita a 11 dígitos (DDD + 9 dígitos)
    value = value.substring(0, 11);

    // Aplica a máscara: (00) 00000-0000 ou (00) 0000-0000
    if (value.length > 10) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length > 6) {
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    } else if (value.length > 0) {
      value = value.replace(/(\d{0,2})/, '($1');
    }

    input.value = value;
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Remove a máscara ao sair do campo
    const rawValue = input.value.replace(/\D/g, '');

    input.value = rawValue;
    input.dispatchEvent(new Event('input'));
  }
}
