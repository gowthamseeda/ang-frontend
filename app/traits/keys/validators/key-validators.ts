import { AbstractControl, ValidationErrors } from '@angular/forms';

export class KeyValidators {
  static alphaNumericExceptDot(c: AbstractControl): ValidationErrors | null {
    const ALPHA_NUMERIC_EXCEPT_DOT_REGEXP = /^[a-zA-Z0-9.]*$/;
    return ALPHA_NUMERIC_EXCEPT_DOT_REGEXP.test(c.value) ? null : { alphaNumericExceptDot: true };
  }

  static alphaNumericExceptHyphen(c: AbstractControl): ValidationErrors | null {
    const ALPHA_NUMERIC_EXCEPT_DOT_REGEXP = /^[a-zA-Z0-9-]*$/;
    return ALPHA_NUMERIC_EXCEPT_DOT_REGEXP.test(c.value)
      ? null
      : { alphaNumericExceptHyphen: true };
  }
}
