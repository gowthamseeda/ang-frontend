import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { UserService } from '../../../../iam/user/user.service';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../../testing/testing.module';
import { hansSettingsMock } from '../../model/user-settings.mock';
import { UserSettingsService } from '../../services/user-settings.service';

import { EditUserSettingsComponent } from './edit-user-settings.component';

describe('EditUserSettingsComponent', () => {
  let component: EditUserSettingsComponent;
  let fixture: ComponentFixture<EditUserSettingsComponent>;

  let snackBarServiceSpy: Spy<SnackBarService>;
  let userServiceSpy: Spy<UserService>;
  let userSettingsService: Spy<UserSettingsService>;

  beforeEach(async () => {
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    userServiceSpy = createSpyFromClass(UserService);
    userSettingsService = createSpyFromClass(UserSettingsService);

    userServiceSpy.getDefaultCountryId.nextWith('DE');
    userSettingsService.get.nextWith(hansSettingsMock);

    await TestBed.configureTestingModule({
      imports: [TestingModule, ReactiveFormsModule, TestingModule, MatSlideToggleModule],
      declarations: [EditUserSettingsComponent],
      providers: [
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: UserSettingsService, useValue: userSettingsService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should init countryId form control with value', () => {
      expect(component.userSettingForm.get('countryId')).toBeTruthy();
      expect(component.userSettingForm.get('countryId')?.value).toEqual('DE');
    });

    it('should init searchOutletByDefaultCountry form control with value', () => {
      expect(component.userSettingForm.get('searchOutletByDefaultCountry')).toBeTruthy();
      expect(component.userSettingForm.get('searchOutletByDefaultCountry')?.value).toBeTruthy();
    });

    it('should init searchOutletByActiveOutlet form control with value', () => {
      expect(component.userSettingForm.get('searchOutletByActiveOutlet')).toBeTruthy();
      expect(component.userSettingForm.get('searchOutletByActiveOutlet')?.value).toBeTruthy();
    });

    it('should init showMultiSelectConfirmationDialog form control with value', () => {
      expect(component.userSettingForm.get('doNotShowMultiSelectConfirmationDialog')).toBeTruthy();
      expect(component.userSettingForm.get('doNotShowMultiSelectConfirmationDialog')?.value).toBeFalsy();
    });
  });

  describe('user default country should be null if its undefined', () => {
    beforeEach(() => {
      const hansSettingsWithoutCountry = hansSettingsMock;
      hansSettingsWithoutCountry.defaultCountry = undefined;
      userSettingsService.get.nextWith(hansSettingsWithoutCountry);
    });

    it('should result in undefined', () => {
      expect(component.userSettings.defaultCountry).toBe(undefined);
    });
  });

  describe('updateUserSettings', () => {
    it('should update user setting from form value', () => {
      jest.spyOn(userSettingsService, 'updateUserSettings').mockReturnValue(of());

      const defaultCountryId = 'GB';
      const searchOutletByDefaultCountry = false;
      const searchOutletByActiveOutlet = false;
      const doNotShowMultiSelectConfirmationDialog = true;

      component.userSettingForm.patchValue({
        countryId: defaultCountryId,
        searchOutletByDefaultCountry: searchOutletByDefaultCountry,
        searchOutletByActiveOutlet: searchOutletByActiveOutlet,
        doNotShowMultiSelectConfirmationDialog: doNotShowMultiSelectConfirmationDialog
      });

      component.updateUserSettings();

      expect(userSettingsService.updateUserSettings).toHaveBeenCalledWith(
        defaultCountryId,
        searchOutletByDefaultCountry,
        searchOutletByActiveOutlet,
        doNotShowMultiSelectConfirmationDialog
      );
    });
  });
});
