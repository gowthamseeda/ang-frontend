import { Component, Input } from '@angular/core';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'gp-link-out-to-outlet',
  templateUrl: './link-out-to-outlet.component.html'
})
export class LinkOutToOutletComponent {
  linkOut = '';

  @Input()
  set outletId(outletId: string) {
    const origin = window.location.origin;
    const relativeUrl = `/outlet/${outletId}`;

    if (!!environment.settings.baseUrl) {
      const baseUrl = environment.settings.baseUrl;
      this.linkOut = `${origin}${baseUrl}app${relativeUrl}`;
    } else {
      this.linkOut = `${origin}/app${relativeUrl}`;
    }
  }
}
