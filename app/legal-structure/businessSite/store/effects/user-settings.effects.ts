import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { ApiError } from '../../../../shared/services/api/api.service';
import { UserSettingsService } from '../../../../user-settings/user-settings/services/user-settings.service';
import { OutletActions } from '../actions';
import { loadUserSettingsFailure, loadUserSettingsSuccess } from '../actions/user-settings.actions';

@Injectable()
export class UserSettingsEffects {
  loadUserSettings = createEffect(() =>
    this.actions.pipe(
      ofType(OutletActions.loadOutlet),
      switchMap(() => this.userSettingsService.getLanguageId()),
      switchMap((languageId: string) => {
        return of(
          loadUserSettingsSuccess({
            languageId: languageId
          })
        );
      }),
      catchError((error: ApiError) => {
        return of(loadUserSettingsFailure({ error }));
      })
    )
  );

  constructor(private actions: Actions, private userSettingsService: UserSettingsService) {}
}
