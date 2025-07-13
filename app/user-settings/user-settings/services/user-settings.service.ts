import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { finalize, map, switchMap, take } from 'rxjs/operators';

import { ApiService } from '../../../shared/services/api/api.service';
import { UserSettings } from '../model/user-settings.model';
import { UserAgreement } from "../model/user-agreement.model";

export const userSettingsUrl = '/user-settings/api/v1/current-user/settings';
export const userSecurityAgreementUrl = '/user-settings/api/v1/user-security-agreement/'
export const updateUserSecurityAgreementUrl = '/user-settings/api/v1/user-security-agreement'

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  private userSettings = new ReplaySubject<UserSettings>(1);

  constructor(private apiService: ApiService) {
    this.fetchUserSettings();
  }

  get(): Observable<UserSettings> {
    return this.userSettings.asObservable();
  }

  getLanguageId(): Observable<string | undefined> {
    return this.get().pipe(map(userSettings => userSettings.languageId));
  }

  getDefaultCountryId(): Observable<string | null | undefined> {
    return this.get().pipe(
      map(userSettings => {
        return userSettings.defaultCountry;
      })
    );
  }

  getSearchOutletByDefaultCountryFlag(): Observable<boolean | null | undefined> {
    return this.get().pipe(
      map(userSettings => {
        return userSettings.searchOutletByDefaultCountry;
      })
    );
  }

  updateAndFetch(changes: UserSettings): Observable<any> {
    return this.get().pipe(
      take(1),
      switchMap(userSettings => {
        return this.update({ ...userSettings, ...changes }).pipe(
          finalize(() => this.fetchUserSettings())
        );
      })
    );
  }

  update(userSettings: UserSettings): Observable<any> {
    return this.apiService.put(userSettingsUrl, userSettings);
  }

  updateUserSettings(
    defaultCountryId: string | null,
    searchOutletByDefaultCountry: boolean,
    searchOutletByActiveOutlet: boolean,
    doNotShowMultiSelectConfirmationDialog: boolean
  ): Observable<any> {
    return this.updateAndFetch({
      defaultCountry: defaultCountryId,
      searchOutletByDefaultCountry: searchOutletByDefaultCountry,
      searchOutletByActiveOutlet: searchOutletByActiveOutlet,
      doNotShowMultiSelectConfirmationDialog: doNotShowMultiSelectConfirmationDialog
    });
  }

  updateUserDefaultLanguage(languageId: string): Observable<any> {
    return this.getDefaultCountryId().pipe(
      take(1),
      switchMap(defaultCountryId => {
        return this.updateAndFetch({
          languageId: languageId,
          defaultCountry: defaultCountryId
        });
      })
    );
  }

  updateUserShowMarginalColumn(showMarginalColumn: boolean): Observable<any> {
    return this.getDefaultCountryId().pipe(
      take(1),
      switchMap(defaultCountryId => {
        return this.updateAndFetch({
          showMarginalColumn: showMarginalColumn,
          defaultCountry: defaultCountryId
        });
      })
    );
  }

  updateUserDoNotShowMultiSelectConfirmationDialog(doNotShowMultiSelectConfirmationDialog: boolean): Observable<any> {
    return this.updateAndFetch({
      doNotShowMultiSelectConfirmationDialog: doNotShowMultiSelectConfirmationDialog
    });
  }

  private fetchUserSettings(): void {
    this.apiService.get<UserSettings>(userSettingsUrl).subscribe(
      result => this.userSettings.next(result),
      () => this.userSettings.next({})
    );
  }

  fetchUserAgreementStatus(
    userId: string
  ): Observable<boolean> {
    return this.apiService.get<boolean>(userSecurityAgreementUrl + `${userId}/exist`)
  }

  updateSecurityAgreement(
    userAgreement: UserAgreement
  ): Observable<any> {
    return this.apiService.put(updateUserSecurityAgreementUrl, userAgreement)
  }
}
