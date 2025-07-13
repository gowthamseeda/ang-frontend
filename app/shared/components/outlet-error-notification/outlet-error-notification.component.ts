import { Component, Input, OnChanges } from '@angular/core';
import { ObservableInput } from 'ngx-observable-input';
import { Observable } from 'rxjs';

import { DuplicateKeyTypes } from './duplicate-key-types.model';

@Component({
  selector: 'gp-outlet-error-notification',
  templateUrl: './outlet-error-notification.component.html',
  styleUrls: ['./outlet-error-notification.component.scss']
})
export class OutletErrorNotificationComponent implements OnChanges {
  @Input()
  @ObservableInput()
  businessSiteId: Observable<string>;
  @Input()
  set registeredOfficeId(registeredOfficeId: string) {
    this.companysRegisteredOfficeId = registeredOfficeId;
  }

  companysRegisteredOfficeId: string;
  errors: Map<string, boolean> = new Map<string, boolean>();

  constructor() {}

  ngOnChanges(): void {
    this.errors.clear();
  }

  setError(type: string, value: boolean): void {
    if (value) {
      this.errors.set(type, true);
      return;
    }
    this.errors.delete(type);
  }

  hasError(type: string): boolean {
    return !!this.errors.get(type);
  }

  hasDuplicateKeyErrors(): boolean {
    return (
      Object.keys(DuplicateKeyTypes).filter(duplicateKeyType => !!this.errors.get(duplicateKeyType))
        .length > 0
    );
  }
}
