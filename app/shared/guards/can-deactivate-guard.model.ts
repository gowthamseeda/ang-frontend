import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export interface CanDeactivateComponent {
  canDeactivate: () => Observable<boolean> | boolean;
  isDeactivated?: (deactivated: boolean) => void;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanDeactivateComponent> {
  message: string;

  constructor(protected translateService: TranslateService) {
    this.message = '';
  }

  canDeactivate(component: CanDeactivateComponent): boolean {
    if (!component.canDeactivate()) {
      this.translateService
        .get('DISCARD_CHANGES_QUESTION')
        .subscribe((translation: string) => (this.message = translation));

      const response = confirm(this.message);
      if (component.isDeactivated) {
        component.isDeactivated(response);
      }
      return response;
    }
    return true;
  }
}
