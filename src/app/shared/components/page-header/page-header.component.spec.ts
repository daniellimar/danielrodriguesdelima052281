import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PageHeaderComponent} from './page-header.component';
import {RouterTestingModule} from '@angular/router/testing';
import {describe, it, expect, beforeEach, vi} from 'vitest';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PageHeaderComponent,
        RouterTestingModule // ✅ REQUIRED for RouterLink
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;

    component.title = 'Test Title';
    component.subtitle = 'Test Subtitle';
    component.actionLabel = 'Create';
    component.actionRoute = '/create';
    component.showSearch = true;
    component.searchValue = '';

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should receive title input', () => {
    expect(component.title).toBe('Test Title');
  });

  it('should receive subtitle input', () => {
    expect(component.subtitle).toBe('Test Subtitle');
  });

  it('should have default icon background class', () => {
    expect(component.iconBgClass).toBe('from-blue-500 to-blue-600');
  });

  it('should emit searchChange when search input changes', () => {
    const spy = vi.fn();
    component.searchChange.subscribe(spy);

    const event = {
      target: {value: 'search text'}
    } as unknown as Event;

    component.onSearchInput(event);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('search text');
  });
});
