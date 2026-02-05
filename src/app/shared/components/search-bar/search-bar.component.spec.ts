import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SearchBarComponent} from './search-bar.component';
import {describe, it, expect, beforeEach, vi} from 'vitest';
import {By} from '@angular/platform-browser';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default input values', () => {
    expect(component.placeholder).toBe('Pesquisar...');
    expect(component.value).toBe('');
  });

  it('should render input with placeholder text', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(input.placeholder).toBe('Pesquisar...');
  });

  it('should update value and emit events when user types', () => {
    const valueChangeSpy = vi.fn();
    const searchSpy = vi.fn();

    component.valueChange.subscribe(valueChangeSpy);
    component.search.subscribe(searchSpy);

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    input.value = 'dog';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.value).toBe('dog');
    expect(valueChangeSpy).toHaveBeenCalledWith('dog');
    expect(searchSpy).toHaveBeenCalledWith('dog');
  });

  it('should emit valueChange and search exactly once per input event', () => {
    const valueChangeSpy = vi.fn();
    const searchSpy = vi.fn();

    component.valueChange.subscribe(valueChangeSpy);
    component.search.subscribe(searchSpy);

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    input.value = 'cat';
    input.dispatchEvent(new Event('input'));

    expect(valueChangeSpy).toHaveBeenCalledTimes(1);
    expect(searchSpy).toHaveBeenCalledTimes(1);
  });

  it('should not emit events if input value does not change', () => {
    const valueChangeSpy = vi.fn();
    const searchSpy = vi.fn();

    component.value = 'same';
    component.valueChange.subscribe(valueChangeSpy);
    component.search.subscribe(searchSpy);

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    input.value = 'same';
    input.dispatchEvent(new Event('input'));

    expect(valueChangeSpy).toHaveBeenCalledWith('same');
    expect(searchSpy).toHaveBeenCalledWith('same');
  });
});
