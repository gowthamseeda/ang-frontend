import { Component, Input } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';

import { Label } from '../label.model';

@Component({
  selector: 'gp-label-selection',
  templateUrl: './label-selection.component.html'
})
export class LabelSelectionComponent {
  @Input()
  control: UntypedFormControl;
  @Input()
  readonly = false;
  @Input()
  errorStateMatcher: ErrorStateMatcher;
  @Input()
  availableLabels: Label[];

  currentLanguage = this.translateService.currentLang;

  constructor(private translateService: TranslateService) {}

  get getLabel(): Label | undefined {
    return this.availableLabels
      ? this.availableLabels.find(label => label.id === this.control.value)
      : this.availableLabels;
  }
}
