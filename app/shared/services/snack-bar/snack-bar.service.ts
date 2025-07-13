import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

import { ApiError } from '../api/api.service';

@Injectable()
export class SnackBarService {
  constructor(private snackBar: MatSnackBar, private translateService: TranslateService) {
  }

  showInfo(message: string): void {
    this.translateService.get(message).subscribe((translation: string) => {
      this.openSnackBar(translation, 9000);
    });
  }

  showInfoWithData(message: string, data: string): void {
    this.translateService.get(message).subscribe((translation: string) => {
      this.openSnackBar(`${translation}\n${data}`, 9000);
    });
  }

  showInfoPermanent(message: string): void {
    this.translateService.get(message).subscribe((translation: string) => {
      this.openSnackBar(translation);
    });
  }

  showError(error: Error | ApiError): void {
    this.translateService.get(error.message).subscribe((translation: string) => {
      let snackBarMessage =
        error instanceof ApiError && error.traceId
          ? `${translation} [${error.traceId}]`
          : translation;
      snackBarMessage = this.displayMessageWithLengthLimit(snackBarMessage);

      this.openSnackBar(snackBarMessage);
    });
  }

  displayMessageWithLengthLimit(message: string): string {
    const lengthLimit = 500;
    let displayMessage = message.substring(0, lengthLimit);
    if (message.length > lengthLimit) {
      displayMessage = displayMessage + '...';
    }
    return displayMessage;
  }

  private openSnackBar(message: string, duration?: number): void {
    const config = {};
    if (duration) {
      config['duration'] = duration;
    }
    this.snackBar.open(message, 'OK', config);
  }
}
