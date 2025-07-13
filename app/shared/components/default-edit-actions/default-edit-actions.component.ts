import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface DefaultEditActions {
  hasChange: EventEmitter<boolean>;
  hasValidChange?: EventEmitter<boolean>;

  save(): void;

  reset?(): void;
}

@Component({
  selector: 'gp-default-edit-actions',
  templateUrl: './default-edit-actions.component.html',
  styleUrls: ['./default-edit-actions.component.scss']
})
export class DefaultEditActionsComponent {
  private _saveButtonDisabled: boolean;

  @Input() set saveButtonDisabled(value: boolean) {
    this._saveButtonDisabled = value;
  }

  @Input() cancelButtonDisabled: boolean;
  @Input() saveButtonRouterLink?: string;
  @Input() saveButtonTranslationKey = 'SAVE';
  @Input() cancelButtonTranslationKey = 'CANCEL';
  @Input() showDoNotShowAgainCheckBox = false;
  @Input() permissions?: string[];
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() doNotShowAgainCheckBoxChange = new EventEmitter();

  get saveButtonDisabled(): boolean {
    return this._saveButtonDisabled;
  }

  emitSave(): void {
    this.saveButtonDisabled = true;
    this.save.emit();
  }

  emitDoNotShowAgainCheckBoxChange() : void {
    this.doNotShowAgainCheckBoxChange.emit();
  }
}
