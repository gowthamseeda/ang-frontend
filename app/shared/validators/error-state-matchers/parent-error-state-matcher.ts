import { UntypedFormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class ParentErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl): boolean {
    return (
      (control.invalid || ((control.parent?.invalid ?? false) && control.value.length === 0)) &&
      control.touched
    );
  }
}
