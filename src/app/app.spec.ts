import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {App} from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, RouterTestingModule],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should expose the correct title signal value', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance as any;

    expect(typeof app.title).toBe('function');
    expect(app.title()).toBe('pet-manager-frontend');
  });

  it('should render the navbar and router outlet container', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-navbar')).toBeTruthy();

    expect(compiled.querySelector('router-outlet') || compiled.querySelector('main')).toBeTruthy();
  });
});
