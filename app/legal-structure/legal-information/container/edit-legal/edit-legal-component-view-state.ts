import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { combineLatest, ReplaySubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { FeatureToggleService } from '../../../../shared/directives/feature-toggle/feature-toggle.service';
import {
  LegalContract,
  LegalFooter,
  LegalInformation,
  LegalInformationPermissions
} from '../../model/legal-information.model';

export const LEGAL_FOOTER_DEFAULT_MAX_LENGTH = 2000;
export const LEGAL_FOOTER_TRANSLATION_MAX_LENGTH = 1300;
export const LEGAL_FOOTER_PATTERN = /(<([^>]+)>)/gi;

export const validateLegalFooterText: ValidatorFn = (
  control: UntypedFormControl
): ValidationErrors | null => control.value.match(LEGAL_FOOTER_PATTERN);

export const validateContractStatusMandatoryLanguage: ValidatorFn = (
  control: UntypedFormControl
): ValidationErrors | null => {
  const missingLanguage = control.value.required && !control.value.languageId;
  return missingLanguage ? { missingLanguage: { value: control.value } } : null;
};

export interface LegalContractFormGroup {
  id: UntypedFormControl;
  brandId: UntypedFormControl;
  companyRelationId: UntypedFormControl;
  required: UntypedFormControl;
  languageId: UntypedFormControl;
  contractState: UntypedFormControl;
  corporateDisclosure: UntypedFormControl;
}

export class EditLegalComponentViewState {
  initialized = false;
  private formGroup: UntypedFormGroup;
  private legalFooter: LegalFooter;
  private legalPermissions: LegalInformationPermissions;
  private language: string;
  private focusEnabled = new ReplaySubject<boolean>(1);
  private contractStatusDowntimeEnabled = new ReplaySubject<boolean>(1);

  constructor(
    private formBuilder: UntypedFormBuilder,
    private featureToggleService: FeatureToggleService
  ) {
    this.formGroup = this.formBuilder.group({
      companyId: this.formBuilder.control(''),
      businessSiteId: this.formBuilder.control(''),
      countryId: this.formBuilder.control(''),
      registeredOffice: this.formBuilder.control(false),
      hasRequiredDistributionLevel: this.formBuilder.control(false),
      defaultLanguageId: this.formBuilder.control(''),
      taxNumber: this.formBuilder.control(''),
      vatNumber: this.formBuilder.control(''),
      legalContracts: this.formBuilder.array([])
    });

    const legalFooterControl = this.formBuilder.control('', [validateLegalFooterText]);
    this.formGroup.setControl('legalFooter', legalFooterControl);
    legalFooterControl.disable();

    legalFooterControl.valueChanges
      .pipe(filter(() => this.isDefaultLanguage(this.language)))
      .subscribe((text: string) => (this.legalFooter.text = text));

    legalFooterControl.valueChanges
      .pipe(filter(() => !this.isDefaultLanguage(this.language)))
      .subscribe((text: string) =>
        this.legalFooter.additionalTranslations.set(this.language, text)
      );

    this.featureToggleService
      .isFocusFeatureEnabled()
      .pipe(
        map(focusEnabled => {
          this.focusEnabled.next(focusEnabled);
        })
      )
      .subscribe();

    this.featureToggleService
      .isFeatureEnabled('CONTRACT_STATUS_DOWNTIME')
      .pipe(
        map(isEnabled => {
          this.contractStatusDowntimeEnabled.next(isEnabled);
        })
      )
      .subscribe();
  }

  set legalInformation(legalInformation: LegalInformation) {
    this.legalFooter = legalInformation.company.legalFooter;

    this.formGroup.patchValue({
      companyId: legalInformation.company.id,
      businessSiteId: legalInformation.businessSite.id,
      countryId: legalInformation.businessSite.countryId,
      registeredOffice: legalInformation.businessSite.registeredOffice,
      hasRequiredDistributionLevel: legalInformation.businessSite.hasRequiredDistributionLevel,
      defaultLanguageId: legalInformation.businessSite.defaultLanguageId,
      taxNumber: legalInformation.businessSite.nationalTaxNumber,
      vatNumber: legalInformation.company.vatNumber,
      legalFooter: this.legalFooterText
    });

    this.initialized = true;
  }

  get legalInformation(): LegalInformation {
    const legalContractControls = this.formGroup.get('legalContracts') as UntypedFormArray;

    return {
      company: {
        id: this.formGroup.controls.companyId.value,
        vatNumber: this.formGroup.controls.vatNumber.value,
        legalFooter: this.legalFooter
      },
      businessSite: {
        id: this.formGroup.controls.businessSiteId.value,
        nationalTaxNumber: this.formGroup.controls.taxNumber.value,
        registeredOffice: this.formGroup.controls.registeredOffice.value,
        hasRequiredDistributionLevel: this.formGroup.controls.hasRequiredDistributionLevel.value,
        defaultLanguageId: this.formGroup.controls.defaultLanguageId.value,
        countryId: this.formGroup.controls.countryId.value
      },
      legalContracts: legalContractControls.getRawValue()
    };
  }

  set legalContracts(legalContracts: LegalContract[]) {
    this.formGroup.setControl(
      'legalContracts',
      legalContracts.reduce((contractArray, contract: LegalContract) => {
        const newGroup: LegalContractFormGroup = {
          id: new UntypedFormControl({ value: contract.id, disabled: true }),
          brandId: new UntypedFormControl(
            { value: contract.brandId, disabled: true },
            Validators.required
          ),
          companyRelationId: new UntypedFormControl({
            value: contract.companyRelationId || '',
            disabled: true
          }),
          required: new UntypedFormControl({ value: contract.required, disabled: true }),
          languageId: new UntypedFormControl({ value: contract.languageId, disabled: true }),
          contractState: new UntypedFormControl({ value: contract.contractState, disabled: true }),
          corporateDisclosure: new UntypedFormControl({
            value: contract.corporateDisclosure,
            disabled: true
          })
        };
        contractArray.push(
          this.formBuilder.group(newGroup, {
            validators: validateContractStatusMandatoryLanguage
          })
        );
        return contractArray;
      }, this.formBuilder.array([]))
    );
    this.enableContractsFrom(this.legalPermissions);
  }

  set permissions(permissions: LegalInformationPermissions) {
    this.legalPermissions = permissions;
    this.enableContractsFrom(permissions);
  }

  set activeLanguage(language: string) {
    this.language = language ? language : '';
    (this.formGroup.get('legalFooter') as UntypedFormControl).setValue(this.legalFooterText, {
      onlySelf: true,
      emitEvent: false
    });
  }

  get activeLanguage(): string {
    return this.language;
  }

  get formValid(): boolean {
    const formValid = this.formGroup.valid;
    const legalFooterMaxLengthValid =
      !this.legalFooterMaxLengthExceeded() &&
      !this.legalFooterAdditionalTranslationMaxLengthExceeded();
    return formValid && legalFooterMaxLengthValid;
  }

  get formChanged(): boolean {
    return !this.formGroup.pristine;
  }

  get businessSiteId(): string {
    return (this.formGroup.get('businessSiteId') as UntypedFormControl).value;
  }

  get countryId(): string {
    return (this.formGroup.get('countryId') as UntypedFormControl).value;
  }

  get defaultLanguageId(): string {
    return (this.formGroup.get('defaultLanguageId') as UntypedFormControl).value;
  }

  get registeredOffice(): boolean {
    return (this.formGroup.get('registeredOffice') as UntypedFormControl).value;
  }

  get legalFooterText(): string {
    const footerText = this.legalFooter
      ? this.language && this.language !== ''
        ? this.legalFooter.additionalTranslations.get(this.language)
        : this.legalFooter.text
      : '';
    return footerText ?? '';
  }

  get legalFooterMaxLength(): number {
    return this.isDefaultLanguage(this.language)
      ? LEGAL_FOOTER_DEFAULT_MAX_LENGTH
      : LEGAL_FOOTER_TRANSLATION_MAX_LENGTH;
  }

  get legalContractsCount(): number {
    return this.legalContractsControl.length;
  }

  get legalInformationControl(): UntypedFormGroup {
    return this.formGroup;
  }

  set legalInformationControl(legalInfo: UntypedFormGroup) {
    this.formGroup = legalInfo;
  }

  get legalContractsControl(): UntypedFormArray {
    return this.formGroup.get('legalContracts') as UntypedFormArray;
  }

  private legalFooterAdditionalTranslationMaxLengthExceeded(): boolean {
    let maxLengthExceeded = false;
    const additionalTranslations: Map<string, string> =
      this.legalInformation.company.legalFooter.additionalTranslations;
    additionalTranslations.forEach(translation => {
      if (translation.length > LEGAL_FOOTER_TRANSLATION_MAX_LENGTH) {
        maxLengthExceeded = true;
        return;
      }
    });
    return maxLengthExceeded;
  }

  private legalFooterMaxLengthExceeded(): boolean {
    return this.legalInformation.company.legalFooter.text.length > LEGAL_FOOTER_DEFAULT_MAX_LENGTH;
  }

  private isDefaultLanguage(language: string): boolean {
    return language === '' || language === this.defaultLanguageId;
  }

  private enableContractsFrom(permissions: LegalInformationPermissions): void {
    combineLatest([this.focusEnabled, this.contractStatusDowntimeEnabled])
      .pipe(
        map(([focusEnabled, contractStatusDowntimeEnabled]) => {
          const contractStatusPermitted = permissions?.editContractStatusIsAllowed;
          const contracts = this.formGroup.get('legalContracts') as UntypedFormArray;

          contracts.controls.forEach((contractFormGroup: UntypedFormGroup) => {
            const brandIdControl = contractFormGroup.get('brandId');
            const brandId = brandIdControl?.value;
            const brandFound = permissions?.restrictedToBrands.some(
              permittedBrand => permittedBrand.value === brandId
            );

            const brandPermitted = !brandId || brandFound;
            Object.keys(contractFormGroup.controls).forEach(key => {
              const control = contractFormGroup.controls[key];
              if (contractStatusPermitted && brandPermitted) {
                control.enable();
              } else {
                control.disable();
              }

              if (contractStatusDowntimeEnabled) {
                control.disable();
              }
            });
          });
        })
      )
      .subscribe();
  }
}
