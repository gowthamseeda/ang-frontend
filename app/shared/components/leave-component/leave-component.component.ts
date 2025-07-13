import { Component, HostListener, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'gp-message-on-leave',
  template: ''
})
export class LeaveComponent {
  @Input()
  showMessage = true;

  message: string;

  constructor(protected translateService: TranslateService) {
    this.message = '';
  }

  canDeactivate(): boolean {
    this.translateService
      .get('DISCARD_CHANGES_QUESTION')
      .subscribe((translation: string) => (this.message = translation));

    return this.showMessage;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification(event: any): void {
    if (!this.canDeactivate()) {
      this.translateService
        .get('DISCARD_CHANGES_QUESTION')
        .subscribe((translation: string) => (this.message = translation));

      event.returnValue = this.message;
    }
  }
}
