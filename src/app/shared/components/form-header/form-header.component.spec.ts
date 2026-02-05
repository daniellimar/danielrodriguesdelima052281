import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormHeaderComponent} from './form-header.component';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';

describe('FormHeaderComponent', () => {
  let component: FormHeaderComponent;
  let fixture: ComponentFixture<FormHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormHeaderComponent,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default backRoute as "/"', () => {
    expect(component.backRoute).toBe('/');
  });

  it('should have default title as empty string', () => {
    expect(component.title).toBe('');
  });
});
