import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ViewControlsComponent, ViewMode, CardsPerRow} from './view-controls.component';
import {describe, it, expect, beforeEach, vi} from 'vitest';

describe('ViewControlsComponent', () => {
  let component: ViewControlsComponent;
  let fixture: ComponentFixture<ViewControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewControlsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default input values', () => {
    expect(component.viewMode).toBe('grid');
    expect(component.cardsPerRow).toBe(4);
  });

  it('should expose all valid cards-per-row options', () => {
    expect(component.cardsPerRowOptions).toEqual([2, 3, 4, 5]);
  });

  it('should emit viewModeChange when view mode changes', () => {
    const spy = vi.fn();
    component.viewModeChange.subscribe(spy);

    const modes: ViewMode[] = ['grid', 'list', 'compact'];

    modes.forEach(mode => {
      component.onViewModeChange(mode);
      expect(spy).toHaveBeenLastCalledWith(mode);
    });

    expect(spy).toHaveBeenCalledTimes(modes.length);
  });

  it('should emit cardsPerRowChange when cards-per-row value changes', () => {
    const spy = vi.fn();
    component.cardsPerRowChange.subscribe(spy);

    const options: CardsPerRow[] = [2, 3, 4, 5];

    options.forEach(value => {
      component.onCardsPerRowChange(value);
      expect(spy).toHaveBeenLastCalledWith(value);
    });

    expect(spy).toHaveBeenCalledTimes(options.length);
  });

  it('should not mutate internal state when emitting events', () => {
    component.viewMode = 'grid';
    component.cardsPerRow = 4;

    component.onViewModeChange('list');
    component.onCardsPerRowChange(2);

    expect(component.viewMode).toBe('grid');
    expect(component.cardsPerRow).toBe(4);
  });
});
