import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PaginationComponent} from './pagination.component';
import {describe, it, expect, beforeEach, vi} from 'vitest';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;

    component.currentPage = 0;
    component.totalPages = 10;
    component.totalElements = 100;
    component.itemsPerPage = 10;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should generate pages starting from zero when on first page', () => {
    component.currentPage = 0;

    const pages = component.pages;

    expect(pages).toEqual([0, 1, 2, 3, 4]);
  });

  it('should generate pages centered around current page', () => {
    component.currentPage = 5;

    const pages = component.pages;

    expect(pages).toEqual([3, 4, 5, 6, 7]);
  });

  it('should generate pages ending at totalPages when near the end', () => {
    component.currentPage = 9;
    component.totalPages = 10;

    const pages = component.pages;

    expect(pages).toEqual([5, 6, 7, 8, 9]);
  });

  it('should generate less pages if totalPages is smaller than maxPages', () => {
    component.totalPages = 3;
    component.currentPage = 0;

    const pages = component.pages;

    expect(pages).toEqual([0, 1, 2]);
  });

  it('should emit pageChange when changing to a valid page', () => {
    const spy = vi.fn();
    component.pageChange.subscribe(spy);

    component.changePage(2);

    expect(spy).toHaveBeenCalledWith(2);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not emit pageChange when page is less than zero', () => {
    const spy = vi.fn();
    component.pageChange.subscribe(spy);

    component.changePage(-1);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should not emit pageChange when page is greater than or equal to totalPages', () => {
    const spy = vi.fn();
    component.pageChange.subscribe(spy);

    component.changePage(10);

    expect(spy).not.toHaveBeenCalled();
  });
});
