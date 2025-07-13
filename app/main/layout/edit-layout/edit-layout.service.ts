import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';

@Injectable()
export class EditLayoutService {
  marginalColumnDisabled = false;
  marginalColumnShown = false;
  marginVisible: Subject<boolean> = new Subject<boolean>();

  constructor(private userSettingsService: UserSettingsService) {
    this.loadMarginalColumnShown();
  }

  toggleMarginalColumn(): void {
    if (!this.marginalColumnDisabled) {
      this.marginalColumnShown = !this.marginalColumnShown;
      this.userSettingsService.updateUserShowMarginalColumn(this.marginalColumnShown).subscribe();
      this.marginVisible.next(this.marginalColumnVisible());
    }
  }

  marginalColumnVisible(): boolean {
    return !this.marginalColumnDisabled && this.marginalColumnShown;
  }

  isMarginalColumnExpandable(): boolean {
    return !this.marginalColumnDisabled && !this.marginalColumnShown;
  }

  private loadMarginalColumnShown(): void {
    this.userSettingsService.get().subscribe(userSettings => {
      this.marginalColumnShown = !!userSettings.showMarginalColumn;
      this.marginVisible.next(this.marginalColumnVisible());
    });
  }
}
