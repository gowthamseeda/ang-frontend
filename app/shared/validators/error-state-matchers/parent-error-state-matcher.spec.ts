import { FormBuilder, FormControl, FormGroup, ValidationErrors } from '@angular/forms';

import { ParentErrorStateMatcher } from './parent-error-state-matcher';

class FakeValidator {
  static isValid(): ValidationErrors | null {
    return null;
  }

  static isInvalid(): ValidationErrors | null {
    return { invalid: true };
  }
}

describe('ParentErrorStateMatcher', () => {
  let errorStateMatcher: ParentErrorStateMatcher;
  let formGroup: FormGroup;
  let formControl: FormControl;

  beforeEach(() => {
    errorStateMatcher = new ParentErrorStateMatcher();

    formGroup = new FormBuilder().group({
      legalName: ''
    });
    formGroup.controls['legalName'].markAsTouched();

    formControl = <FormControl>formGroup.controls['legalName'];
  });

  describe('isErrorState()', () => {
    it('should indicate an error if the formGroup is invalid and the field has no value but was touched', () => {
      formGroup.setValidators(FakeValidator.isInvalid);
      formGroup.updateValueAndValidity();
      expect(errorStateMatcher.isErrorState(formControl)).toBeTruthy();
    });

    it('should indicate no error if the formGroup is valid', () => {
      formGroup.setValidators(FakeValidator.isValid);
      formGroup.updateValueAndValidity();
      expect(errorStateMatcher.isErrorState(formControl)).toBeFalsy();
    });

    it('should indicate no error if the formGroup is invalid but the field has a value', () => {
      formGroup.setValidators(FakeValidator.isInvalid);
      formGroup.controls['legalName'].setValue('any value');
      formGroup.updateValueAndValidity();
      expect(errorStateMatcher.isErrorState(formControl)).toBeFalsy();
    });
  });
});
