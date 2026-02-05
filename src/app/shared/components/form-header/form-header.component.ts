import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-form-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './form-header.component.html'
})
export class FormHeaderComponent {
  @Input() backRoute: string = '/';
  @Input() title: string = '';
}
