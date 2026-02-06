import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-form-actions',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './form-actions.component.html'
})
export class FormActionsComponent {
  @Input() cancelRoute: string = '/';
  @Input() isSaving: Observable<boolean> | null = null;
  @Input() loading$: Observable<boolean> | null = null;
  @Input() isEditMode: boolean = false;
  @Input() submitLabel: string = 'Cadastrar';
  @Input() editLabel: string = 'Salvar Alterações';
}
