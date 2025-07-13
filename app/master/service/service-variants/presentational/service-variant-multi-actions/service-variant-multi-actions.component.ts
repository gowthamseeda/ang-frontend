import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface DefaultEditActions {
  hasChange: EventEmitter<boolean>;
  hasValidChange?: EventEmitter<boolean>;
  save(): void;
  reset?(): void;
}

@Component({
  selector: 'gp-service-variant-multi-actions',
  templateUrl: './service-variant-multi-actions.component.html',
  styleUrls: ['./service-variant-multi-actions.component.scss']
})
export class ServiceVariantMultiActionsComponent {
  @Input() viewButtonDisabled: boolean;
  @Input() deleteButtonDisabled: boolean;
  @Input() editButtonDisabled: boolean;
  @Input() viewButtonTranslationKey = 'VIEW';
  @Input() deleteButtonTranslationKey = 'DELETE';
  @Input() editButtonTranslationKey = 'EDIT';
  @Input() permissions?: string[];

  @Output() view = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() edit = new EventEmitter();

  emitView(): void {
    this.deleteButtonDisabled = true;
    this.view.emit();
  }

  emitDelete(): void {
    this.deleteButtonDisabled = true;
    this.delete.emit();
  }

  emitEdit(): void {
    this.deleteButtonDisabled = true;
    this.edit.emit();
  }
}
