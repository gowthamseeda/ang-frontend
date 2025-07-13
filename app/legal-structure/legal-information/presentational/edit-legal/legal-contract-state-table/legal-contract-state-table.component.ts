import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { LegalContract } from '../../../model/legal-information.model';

export interface LegalContractSelection {
  text: string;
  value: string | boolean;
}

@Component({
  selector: 'gp-legal-contract-state-table',
  templateUrl: './legal-contract-state-table.component.html',
  styleUrls: ['./legal-contract-state-table.component.scss']
})
export class LegalContractStateTableComponent {
  @Input()
  contractStatusDowntimeEnabled = false;
  @Input()
  focusEnabled = false;
  @Input()
  formArray: UntypedFormArray;
  @Input()
  availableRequiredSelections: LegalContractSelection[] = [];
  @Input()
  availableLanguageSelections: LegalContractSelection[] = [];
  @Input()
  availableBrandSelections: LegalContractSelection[] = [];
  @Input()
  availableCompanyRelationSelections: LegalContractSelection[] = [];
  @Output()
  contractRemoved = new EventEmitter<LegalContract>();
  @Output()
  contractUpdated = new EventEmitter<LegalContract>();

  columns = [
    'contract-brand',
    'contract-company-relation',
    'contract-required',
    'contract-entry-per-language',
    'contract-actions'
  ];

  columnsFocusDisabled = [
    'contract-brand',
    'contract-required',
    'contract-entry-per-language',
    'contract-actions'
  ];

  constructor() {}

  removeIconClicked(legalContractControl: UntypedFormGroup): void {
    const control = legalContractControl.get('id') as UntypedFormControl;
    if (control && control.enabled) {
      this.contractRemoved.emit(legalContractControl.value);
    }
  }

  get legalContracts(): UntypedFormArray {
    return this.formArray;
  }

  corporateDisclosureChanged(legalContractControl: UntypedFormGroup): void {
    this.contractUpdated.emit(legalContractControl.value);
  }

  contractStateChanged(legalContractControl: UntypedFormGroup): void {
    this.contractUpdated.emit(legalContractControl.value);
  }

  languageChanged(legalContractControl: UntypedFormGroup): void {
    this.contractUpdated.emit(legalContractControl.value);
  }

  brandSelectionChanged(legalContractControl: UntypedFormGroup): void {
    this.contractUpdated.emit(legalContractControl.value);
  }

  companyRelationSelectionChanged(legalContractControl: UntypedFormGroup): void {
    this.contractUpdated.emit(legalContractControl.value);
  }

  contractRequiredSelectionChange(legalContractControl: UntypedFormGroup): void {
    const languageIdControl = legalContractControl.get('languageId') as UntypedFormControl;
    const contractStateControl = legalContractControl.get('contractState') as UntypedFormControl;
    const disclosureControl = legalContractControl.get('corporateDisclosure') as UntypedFormControl;
    const legalContract: LegalContract = legalContractControl.value;

    if (legalContract?.required) {
      languageIdControl?.enable();
      contractStateControl?.enable();
      disclosureControl?.enable();
    } else {
      languageIdControl?.reset();
      contractStateControl?.reset();
      disclosureControl?.reset();

      languageIdControl?.disable();
      contractStateControl?.disable();
      disclosureControl?.disable();
    }
    this.contractUpdated.emit(legalContract);
  }
}
