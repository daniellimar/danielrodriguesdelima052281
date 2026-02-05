import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ImageUploadComponent} from './image-upload.component';

describe('ImageUploadComponent', () => {
  let component: ImageUploadComponent;
  let fixture: ComponentFixture<ImageUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageUploadComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit fileSelected when a file is selected', () => {
    const file = new File(['test'], 'test.png', {type: 'image/png'});
    const spy = vi.fn();
    component.fileSelected.subscribe(spy);

    const event = {
      target: {
        files: [file]
      }
    } as unknown as Event;

    component.onFileSelected(event);

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(file);
  });

  it('should not emit fileSelected if no file is selected', () => {
    const spy = vi.fn();
    component.fileSelected.subscribe(spy);

    const event = {
      target: {
        files: []
      }
    } as unknown as Event;

    component.onFileSelected(event);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should revoke object URL on destroy when previewUrl exists', () => {
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL');

    component.previewUrl = 'blob:http://localhost/test-url';
    component.ngOnDestroy();

    expect(revokeSpy).toHaveBeenCalledWith('blob:http://localhost/test-url');
  });
});
