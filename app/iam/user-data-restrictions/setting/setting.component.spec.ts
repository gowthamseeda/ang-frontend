import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TranslatePipeMock } from '../../../testing/pipe-mocks/translate';
import { getUserDataRestrictionsMock } from '../services/user-data-restrictions/user-data-restrictions.mock';
import { UserDataRestrictionsService } from '../services/user-data-restrictions/user-data-restrictions.service';

import { SettingComponent } from './setting.component';

describe('SettingComponent', () => {
  let component: SettingComponent;
  let fixture: ComponentFixture<SettingComponent>;
  let userDataRestrictionsServiceSpy: Spy<UserDataRestrictionsService>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(
    waitForAsync(() => {
      userDataRestrictionsServiceSpy = createSpyFromClass(UserDataRestrictionsService);
      userDataRestrictionsServiceSpy.get.nextWith(getUserDataRestrictionsMock());
      snackBarServiceSpy = createSpyFromClass(SnackBarService);

      TestBed.configureTestingModule({
        declarations: [SettingComponent, TranslatePipeMock],
        imports: [NoopAnimationsModule, RouterTestingModule.withRoutes([])],
        providers: [
          UntypedFormBuilder,
          { provide: UserDataRestrictionsService, useValue: userDataRestrictionsServiceSpy },
          { provide: SnackBarService, useValue: snackBarServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should resolve tenant data restriction values on init', () => {
      const expected = ['GSSNPLUS'];
      expect(component.tenantDataRestrictionValues).toEqual(expected);
    });

    it('should resolve language data restriction values on init', () => {
      const expected = ['fr-FR'];
      expect(component.languageDataRestrictionValues).toEqual(expected);
    });

    it('should resolve country data restriction values on init', () => {
      const expectedCountryDataRestrictionValues = ['FR'];
      expect(component.countryDataRestrictionValues).toEqual(expectedCountryDataRestrictionValues);
    });

    it('should resolve brand data restriction values on init', () => {
      const expectedBrandDataRestrictionValues = ['SMT'];
      expect(component.brandDataRestrictionValues).toEqual(expectedBrandDataRestrictionValues);
    });

    it('should resolve distribution level data restriction values on init', () => {
      const expectedDistributionLevelDataRestrictionValues = ['RETAILER'];
      expect(component.distributionLevelDataRestrictionValues).toEqual(
        expectedDistributionLevelDataRestrictionValues
      );
    });

    it('should resolve business site data restriction values on init', () => {
      const expectedBusinessSiteDataRestrictionValues = ['GS1234567'];
      expect(component.businessSiteDataRestrictionValues).toEqual(
        expectedBusinessSiteDataRestrictionValues
      );
    });

    it('should resolve service data restriction values on init', () => {
      const expectedServiceDataRestrictionValues = ['801'];
      expect(component.serviceDataRestrictionValues).toEqual(expectedServiceDataRestrictionValues);
    });

    it('should set error flag to true in case something goes wrong', () => {
      userDataRestrictionsServiceSpy.get.throwWith('some error');

      expect(component.isError).toBeTruthy();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      userDataRestrictionsServiceSpy.update.nextWith({});
      component.onSubmit();
    });

    it('should update the user data restrictions', () => {
      expect(userDataRestrictionsServiceSpy.update).toHaveBeenCalled();
    });

    it('should give a success message', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('DATARESTRICTIONS_SUCCESS');
    });

    it('should give an error message', () => {
      const error = new Error('Error!');
      userDataRestrictionsServiceSpy.update.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });
});
