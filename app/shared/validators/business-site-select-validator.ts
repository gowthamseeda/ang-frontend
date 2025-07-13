import { UntypedFormControl } from '@angular/forms';

export interface BusinessSiteIds {
  ids: string[];
}

export class BusinessSiteSelectValidator {
  static validateBusinessSiteId(businessSiteIds: BusinessSiteIds): any {
    return (control: UntypedFormControl) => {
      const value: string = control.value;
      if (value.length > 0) {
        const isValid = businessSiteIds.ids.includes(value);
        return isValid
          ? null
          : {
              validateBusinessSiteId: {
                valid: false
              }
            };
      }
    };
  }
}
