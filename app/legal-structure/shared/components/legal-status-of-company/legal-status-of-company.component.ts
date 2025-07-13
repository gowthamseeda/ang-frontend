import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'gp-legal-status-of-company',
  templateUrl: './legal-status-of-company.component.html',
  styleUrls: ['./legal-status-of-company.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegalStatusOfCompanyComponent implements OnInit {
  @Input()
  parentForm: UntypedFormGroup;
  @Input()
  affiliate: boolean;
  @Input()
  registeredOffice: boolean;
  @Input()
  readonly = false;

  constructor() {}

  ngOnInit(): void {
    this.initAffiliateFormControl();
  }

  private initAffiliateFormControl(): void {
    this.parentForm.addControl(
      'affiliate',
      new UntypedFormControl({ value: this.affiliate, disabled: this.isDisabled() })
    );
  }

  private isDisabled(): boolean {
    if (this.parentForm.disabled) {
      return true;
    }
    return (!this.registeredOffice && this.affiliate) || this.readonly;
  }
}
