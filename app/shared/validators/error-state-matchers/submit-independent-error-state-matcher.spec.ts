import { FormControl } from '@angular/forms';

import { SubmitIndependentErrorStateMatcher } from './submit-independent-error-state-matcher';

describe('SubmitIndependentErrorStateMatcher', () => {
  let errorStateMatcher: SubmitIndependentErrorStateMatcher;
  let formControl: FormControl;

  beforeEach(() => {
    errorStateMatcher = new SubmitIndependentErrorStateMatcher();

    formControl = new FormControl('');
  });

  describe('isErrorState()', () => {
    it('should indicate an error if the form control is invalid and is dirty', () => {
      formControl.setValidators(() => ({ invalid: true }));
      formControl.updateValueAndValidity();
      formControl.markAsDirty();
      expect(errorStateMatcher.isErrorState(formControl, null)).toBeTruthy();
    });

    it('should indicate an error if the form control is invalid and is touched', () => {
      formControl.setValidators(() => ({ invalid: true }));
      formControl.updateValueAndValidity();
      formControl.markAsTouched();
      expect(errorStateMatcher.isErrorState(formControl, null)).toBeTruthy();
    });

    it('should indicate no error if the form control is invalid and neither is dirty nor touched', () => {
      formControl.setValidators(() => ({ invalid: true }));
      formControl.updateValueAndValidity();
      expect(errorStateMatcher.isErrorState(formControl, null)).toBeFalsy();
    });

    it('should indicate no error if the form control is null', () => {
      expect(errorStateMatcher.isErrorState(null, null)).toBeFalsy();
    });
  });
});
