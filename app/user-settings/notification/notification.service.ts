import { Injectable } from '@angular/core';

import { ApiService } from '../../shared/services/api/api.service';

class ReadConfirmations {
  readConfirmations: ReadConfirmation[];
}

class ReadConfirmation {
  notificationId: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  complete = false;
  readConfirmations: { [notificationId: string]: boolean } = {};

  constructor(private apiService: ApiService) {
    this.initReadConfirmations();
  }

  initReadConfirmations(): void {
    this.complete = false;
    this.apiService
      .get('/user-settings/api/v1/read-confirmations')
      .subscribe((data: ReadConfirmations) => {
        data.readConfirmations.forEach((confirmation: ReadConfirmation) => {
          this.readConfirmations[confirmation.notificationId] = true;
        });
        this.complete = true;
      });
  }

  isReadConfirmed(notificationId: string): boolean {
    if (
      this.complete &&
      (!this.readConfirmations[notificationId] || this.readConfirmations[notificationId] === false)
    ) {
      return false;
    }

    return true;
  }

  confirmRead(notificationId: string): void {
    this.readConfirmations[notificationId] = true;
    this.apiService
      .post('/user-settings/api/v1/confirm-read', { notificationId: notificationId })
      .subscribe(
        () => {
          this.initReadConfirmations();
        },
        () => {
          console.warn('Could not save read confirmation for notification "%s"', notificationId);
        }
      );
  }
}
