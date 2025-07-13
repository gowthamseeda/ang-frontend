import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Country } from '../../../../geography/country/country.model';
import { UserService } from '../../../../iam/user/user.service';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { UserSettings } from '../../model/user-settings.model';
import { UserSettingsService } from '../../services/user-settings.service';

@Component({
  selector: 'gp-edit-user-settings',
  templateUrl: './edit-user-settings.component.html',
  styleUrls: ['./edit-user-settings.component.scss']
})
export class EditUserSettingsComponent implements OnInit, OnDestroy {
  countries: Country[];
  userSettingForm: UntypedFormGroup;
  userSettings: UserSettings;
  userDefaultCountryId?: string | null;

  private unsubscribe = new Subject<void>();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private snackbarService: SnackBarService,
    private userService: UserService,
    private userSettingService: UserSettingsService
  ) {}

  ngOnInit(): void {
    this.initUserSettingsForm();
    this.initUserSettings();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  canDeactivate(): boolean {
    return this.userSettingForm.pristine;
  }

  updateUserSettings(): void {
    const defaultCountryId = this.userSettingForm.get('countryId')?.value;
    const searchOutletByDefaultCountry = this.userSettingForm.get(
      'searchOutletByDefaultCountry'
    )?.value;
    const searchOutletByActiveOutlet = this.userSettingForm.get(
      'searchOutletByActiveOutlet'
    )?.value;
    const doNotShowMultiSelectConfirmationDialog = this.userSettingForm.get(
      'doNotShowMultiSelectConfirmationDialog'
    )?.value;

    this.userSettingService
      .updateUserSettings(
        defaultCountryId,
        searchOutletByDefaultCountry,
        searchOutletByActiveOutlet,
        doNotShowMultiSelectConfirmationDialog
      )
      .subscribe(
        () => {
          this.userSettingForm.markAsPristine();
          this.snackbarService.showInfo('USER_SETTINGS_UPDATE_SUCCESS');
        },
        error => {
          this.snackbarService.showError(error);
        }
      );
  }

  reset(): void {
    this.ngOnInit();
  }

  getCountryId(): string | null | undefined {
    return this.userSettings?.defaultCountry
      ? this.userSettings?.defaultCountry
      : this.userDefaultCountryId;
  }

  private initUserSettings(): void {
    combineLatest([this.userSettingService.get(), this.userService.getDefaultCountryId()])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([userSettings, countryId]) => {
        this.userSettings = userSettings;
        this.userDefaultCountryId = countryId;
        this.patchForm();
      });
  }

  private initUserSettingsForm(): void {
    this.userSettingForm = this.formBuilder.group({
      countryId: new UntypedFormControl({ value: null }),
      searchOutletByDefaultCountry: new UntypedFormControl({ value: true }),
      searchOutletByActiveOutlet: new UntypedFormControl({ value: true }),
      doNotShowMultiSelectConfirmationDialog: new UntypedFormControl({ value: false })
    });
  }

  private patchForm(): void {
    this.userSettingForm.patchValue({
      countryId: this.getCountryId(),
      searchOutletByDefaultCountry: this.userSettings.searchOutletByDefaultCountry,
      searchOutletByActiveOutlet: this.userSettings.searchOutletByActiveOutlet,
      doNotShowMultiSelectConfirmationDialog: this.userSettings.doNotShowMultiSelectConfirmationDialog
    });
  }
}
