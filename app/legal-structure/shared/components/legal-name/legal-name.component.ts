import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { OutletService } from '../../services/outlet.service';
import { DataNotificationChangeFields } from "../../../../notifications/models/notifications.model";

@Component({
  selector: 'gp-legal-name',
  templateUrl: './legal-name.component.html',
  styleUrls: ['./legal-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegalNameComponent implements OnInit, OnChanges {
  @Input()
  parentForm: UntypedFormGroup;
  @Input()
  name: string;
  @Input()
  registeredOffice: boolean;
  @Input()
  countryId: string;
  @Input()
  required = false;
  @Input()
  dataNotificationChangeFields = new DataNotificationChangeFields()
  isDataChanged = false;

  constructor(private outletService: OutletService) {}

  ngOnInit(): void {
    this.legalNameFormControl();
    this.checkDataChanged()
  }

  ngOnChanges(changes: SimpleChanges) {
    this.checkDataChanged();
  }

  isControlEditable(): boolean {
    const formControl = this.parentForm.get('legalName');
    return (
      formControl !== null &&
      formControl.enabled &&
      (this.registeredOffice || this.outletService.isLegalNameEditableInCountry(this.countryId))
    );
  }

  private legalNameFormControl(): void {
    this.parentForm.addControl(
      'legalName',
      new UntypedFormControl(
        { value: this.name, disabled: this.parentForm.disabled },
        Validators.maxLength(256)
      )
    );
  }

  checkDataChanged() {
    this.isDataChanged = this.dataNotificationChangeFields.directChange.includes('LEGAL_NAME')
  }
}
