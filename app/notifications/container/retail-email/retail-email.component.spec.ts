import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureToggleService } from 'app/shared/directives/feature-toggle/feature-toggle.service';
import { Observable, of, throwError } from 'rxjs';

import { UserService } from '../../../iam/user/user.service';
import { ProductGroup } from '../../../services/product-group/product-group.model';
import { ProductGroupService } from '../../../services/product-group/product-group.service';
import { ApiError } from '../../../shared/services/api/api.service';
import { ObjectStatus } from '../../../shared/services/api/objectstatus.model';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { getLanguageListMock } from '../../../tpro/language/language.mock';
import { Language } from '../../../tpro/language/language.model';
import { LanguageService } from '../../../tpro/language/language.service';
import { EmailSettingService } from '../../services/email-setting.service';
import { EmailSetting } from '../../models/notifications.model';

import { RetailEmailComponent } from './retail-email.component';

const EMAIL_SETTING: EmailSetting = {
  countryId: 'DE',
  npmMail: 'denpmmail@test.com',
  countryDefaultLanguage: 'de-DE',
  mailFrom: 'demailfrom@test.com'
};

const EMAIL_SETTING_MULTIPLE_MAILS: EmailSetting = {
  countryId: 'DE',
  mailFrom: 'demailfrom@test.com',
  mailFroms: [
    { emailAddress: 'fromMBAG@test.com', focusGroupType: 'MBAG' },
    { emailAddress: 'fromDTAG@test.com', focusGroupType: 'DTAG' }
  ],
  npmMail: 'denpmmail@test.com',
  npmMails: [
    { emailAddress: 'mbag@gmail.com', focusGroupType: 'MBAG' },
    { emailAddress: 'dtag@gmail.com', focusGroupType: 'DTAG' }
  ],
  countryDefaultLanguage: 'de-DE'
};

const MULTIPLE_MAILS_FORM_GROUP = {
  countryId: 'DE',
  mailFrom: 'demailfrom@test.com',
  mbagMailFrom: 'fromMBAG@test.com',
  dtagMailFrom: 'fromDTAG@test.com',
  npmMail: 'denpmmail@test.com',
  mbagNpmMail: 'mbag@gmail.com',
  dtagNpmMail: 'dtag@gmail.com',
  countryDefaultLanguage: 'de-DE'
};

const PC_PRODUCT_GROUP = {
  id: 'PC',
  name: 'Passenger Car',
  shortName: 'PC'
};

const VAN_PRODUCT_GROUP = {
  id: 'VAN',
  name: 'Van',
  shortName: 'Van'
};

const BUS_PRODUCT_GROUP = {
  id: 'BUS',
  name: 'Busses',
  shortName: 'Bus'
};

const TRUCK_PRODUCT_GROUP = {
  id: 'TRUCK',
  name: 'Truck',
  shortName: 'Truck'
};

const UNIMOG_PRODUCT_GROUP = {
  id: 'UNIMOG',
  name: 'Unimog',
  shortName: 'Unimog'
};

class MockUserService {
  getCountryRestrictions(): Observable<string[]> {
    return of(['MY', 'DE']);
  }
}

class MockLanguageService {
  getAll(): Observable<Language[]> {
    return of(getLanguageListMock());
  }
}

class MockSnackBarService {
  showInfo(): void {}

  showError(): void {}
}

class MockEmailSettingService {
  get(): Observable<EmailSetting> {
    return of(EMAIL_SETTING);
  }

  update(): Observable<ObjectStatus> {
    return of({
      id: 'DE',
      status: 'UPDATED'
    });
  }

  delete(): Observable<ObjectStatus> {
    return of({
      id: 'DE',
      status: 'DELETED'
    });
  }
}

class MockFeatureToggleService {
  isFeatureEnabled(): Observable<boolean> {
    return of(false);
  }
  isFocusFeatureEnabled(): Observable<boolean> {
    return this.isFeatureEnabled();
  }
}

class MockProductGroupService {
  getAllForUserDataRestrictions(isFocusEnabled: boolean): Observable<ProductGroup[]> {
    return of([
      PC_PRODUCT_GROUP,
      VAN_PRODUCT_GROUP,
      BUS_PRODUCT_GROUP,
      TRUCK_PRODUCT_GROUP,
      UNIMOG_PRODUCT_GROUP
    ]);
  }
}

describe('RetailEmailComponent', () => {
  let component: RetailEmailComponent;
  let fixture: ComponentFixture<RetailEmailComponent>;
  let injectedUserService: UserService;
  let injectedLanguageService: LanguageService;
  let injectedEmailSettingService: EmailSettingService;
  let injectedSnackBarService: SnackBarService;
  let injectedFeatureToggleService: FeatureToggleService;
  let injectedProductGroupService: ProductGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RetailEmailComponent],
      imports: [TestingModule],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: LanguageService, useClass: MockLanguageService },
        { provide: SnackBarService, useClass: MockSnackBarService },
        { provide: EmailSettingService, useClass: MockEmailSettingService },
        { provide: FeatureToggleService, useClass: MockFeatureToggleService },
        { provide: ProductGroupService, useClass: MockProductGroupService }
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    injectedUserService = TestBed.inject(UserService);
    injectedLanguageService = TestBed.inject(LanguageService);
    injectedEmailSettingService = TestBed.inject(EmailSettingService);
    injectedSnackBarService = TestBed.inject(SnackBarService);
    injectedFeatureToggleService = TestBed.inject(FeatureToggleService);
    injectedProductGroupService = TestBed.inject(ProductGroupService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should handle on init', () => {
    it('should get languages and user country restrictions on init', () => {
      const spy1 = jest.spyOn(injectedLanguageService, 'getAll');
      const spy2 = jest
        .spyOn(injectedUserService, 'getCountryRestrictions')
        .mockReturnValue(of(['MY', 'DE']));
      component.ngOnInit();

      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });

    it('should get email setting if country data restriction exists', () => {
      jest.spyOn(injectedUserService, 'getCountryRestrictions').mockReturnValue(of(['MY', 'DE']));
      const spy = jest.spyOn(component, 'getEmailSetting');

      component.ngOnInit();

      expect(spy).toHaveBeenCalledWith('DE');
    });

    it('should not get email setting if country data restriction does not exist', () => {
      jest.spyOn(injectedUserService, 'getCountryRestrictions').mockReturnValue(of([]));
      const spy = jest.spyOn(component, 'getEmailSetting');

      component.ngOnInit();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('should handle get email setting', () => {
    it('should handle get email setting', () => {
      const spy1 = jest
        .spyOn(injectedEmailSettingService, 'get')
        .mockReturnValue(of(EMAIL_SETTING));
      const spy2 = jest.spyOn(component.formGroup, 'reset');

      component.getEmailSetting('DE');

      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalledWith(EMAIL_SETTING);
      expect(component.emailSetting).toBe(EMAIL_SETTING);
    });

    it('should handle get email setting when focus is on', () => {
      const spy1 = jest
        .spyOn(injectedEmailSettingService, 'get')
        .mockReturnValue(of(EMAIL_SETTING_MULTIPLE_MAILS));
      const spy2 = jest.spyOn(component.formGroup, 'reset');

      component.focusEnabled = true;
      component.getEmailSetting('DE');

      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalledWith(MULTIPLE_MAILS_FORM_GROUP);
      expect(component.emailSetting).toBe(EMAIL_SETTING_MULTIPLE_MAILS);
    });

    it('should handle get email setting not found', () => {
      const spy1 = jest
        .spyOn(injectedEmailSettingService, 'get')
        .mockReturnValue(throwError(new ApiError('', undefined, 404)));
      const spy2 = jest.spyOn(component.formGroup, 'reset');
      const spy3 = jest.spyOn(injectedSnackBarService, 'showError');

      component.getEmailSetting('DE');

      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalledWith({ countryId: 'DE' });
      expect(spy3).not.toHaveBeenCalled();
      expect(component.emailSetting).toStrictEqual({ countryId: 'DE' });
    });

    it('should handle get email setting error', () => {
      const spy1 = jest
        .spyOn(injectedEmailSettingService, 'get')
        .mockReturnValue(throwError(new ApiError('', undefined, 400)));
      const spy2 = jest.spyOn(component.formGroup, 'reset');
      const spy3 = jest.spyOn(injectedSnackBarService, 'showError');

      component.getEmailSetting('DE');

      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalledWith({ countryId: 'DE' });
      expect(spy3).toHaveBeenCalled();
      expect(component.emailSetting).toStrictEqual({ countryId: 'DE' });
    });
  });

  describe('should handle button click', () => {
    beforeEach(() => {
      jest
        .spyOn(injectedEmailSettingService, 'update')
        .mockReturnValue(of({ id: 'DE', status: 'UPDATED' }));
      jest
        .spyOn(injectedEmailSettingService, 'delete')
        .mockReturnValue(of({ id: 'DE', status: 'DELETED' }));
    });

    it('should reset form on cancel button clicked', () => {
      const spy = jest.spyOn(component.formGroup, 'reset');

      component.emailSetting = EMAIL_SETTING;
      component.cancelButtonClicked();

      expect(spy).toHaveBeenCalledWith(EMAIL_SETTING);
    });

    it('should reset form on cancel button clicked when focus is on', () => {
      const spy = jest.spyOn(component.formGroup, 'reset');

      component.focusEnabled = true;
      component.emailSetting = EMAIL_SETTING_MULTIPLE_MAILS;
      component.cancelButtonClicked();

      expect(spy).toHaveBeenCalledWith(MULTIPLE_MAILS_FORM_GROUP);
    });

    it('should update email setting on save button clicked ', () => {
      const spy = jest.spyOn(component, 'handleUpdateEmailSetting');

      const originalFormValues = { ...EMAIL_SETTING, ...{ mailFrom: '' } };
      const processedFormValues = {
        countryId: 'DE',
        npmMail: 'denpmmail@test.com',
        countryDefaultLanguage: 'de-DE'
      };

      component.emailSetting = EMAIL_SETTING;
      component.formGroup.patchValue(originalFormValues);
      component.saveButtonClicked();

      expect(spy).toHaveBeenCalledWith(
        injectedEmailSettingService.update(processedFormValues),
        processedFormValues
      );
      expect(spy).not.toHaveBeenCalledWith(
        injectedEmailSettingService.delete(processedFormValues.countryId),
        processedFormValues
      );
    });

    it('should update email setting on save button clicked when focus is on', () => {
      const spy = jest.spyOn(component, 'handleUpdateEmailSetting');
      const originalFormValues = { ...MULTIPLE_MAILS_FORM_GROUP, ...{ mailFrom: '' } };
      const processedFormValues = {
        countryId: 'DE',
        npmMail: 'denpmmail@test.com',
        npmMails: [
          { emailAddress: 'mbag@gmail.com', focusGroupType: 'MBAG' },
          { emailAddress: 'dtag@gmail.com', focusGroupType: 'DTAG' }
        ],
        mailFroms: [
          { emailAddress: 'fromMBAG@test.com', focusGroupType: 'MBAG' },
          { emailAddress: 'fromDTAG@test.com', focusGroupType: 'DTAG' }
        ],
        countryDefaultLanguage: 'de-DE'
      };

      component.focusEnabled = true;
      component.emailSetting = EMAIL_SETTING_MULTIPLE_MAILS;
      component.formGroup.patchValue(originalFormValues);
      component.saveButtonClicked();

      expect(spy).toHaveBeenCalledWith(
        injectedEmailSettingService.update(processedFormValues),
        processedFormValues
      );
      expect(spy).not.toHaveBeenCalledWith(
        injectedEmailSettingService.delete(processedFormValues.countryId),
        processedFormValues
      );
    });

    it('should delete email setting on save button clicked with empty form', () => {
      const spy = jest.spyOn(component, 'handleUpdateEmailSetting');

      const originalFormValues = {
        countryId: 'DE',
        npmMail: '',
        countryDefaultLanguage: '',
        mailFrom: ''
      };
      const processedFormValues = {
        countryId: 'DE'
      };

      component.emailSetting = EMAIL_SETTING;
      component.formGroup.patchValue(originalFormValues);
      component.saveButtonClicked();

      expect(spy).not.toHaveBeenCalledWith(
        injectedEmailSettingService.update(processedFormValues),
        processedFormValues
      );
      expect(spy).toHaveBeenCalledWith(
        injectedEmailSettingService.delete(processedFormValues.countryId),
        processedFormValues
      );
    });

    it('should delete email setting on save button clicked with empty form when focus is on', () => {
      const spy = jest.spyOn(component, 'handleUpdateEmailSetting');

      const originalFormValues = {
        ...MULTIPLE_MAILS_FORM_GROUP,
        ...{
          npmMail: '',
          mbagNpmMail: '',
          dtagNpmMail: '',
          countryDefaultLanguage: '',
          mailFrom: '',
          mbagMailFrom: '',
          dtagMailFrom: ''
        }
      };
      const processedFormValues = {
        countryId: 'DE'
      };

      component.focusEnabled = true;
      component.emailSetting = EMAIL_SETTING_MULTIPLE_MAILS;
      component.formGroup.patchValue(originalFormValues);
      component.saveButtonClicked();

      expect(spy).not.toHaveBeenCalledWith(
        injectedEmailSettingService.update(processedFormValues),
        processedFormValues
      );

      expect(spy).toHaveBeenCalledWith(
        injectedEmailSettingService.delete(processedFormValues.countryId),
        processedFormValues
      );
    });
  });

  describe('should handle update email setting', () => {
    it('should handle update email setting', () => {
      const spy1 = jest.spyOn(component.formGroup, 'reset');
      const spy2 = jest.spyOn(injectedSnackBarService, 'showInfo');

      component.emailSetting = { countryId: 'DE' };
      component.handleUpdateEmailSetting(of({ id: 'DE', status: 'UPDATED' }), EMAIL_SETTING);

      expect(spy1).toHaveBeenCalledWith(EMAIL_SETTING);
      expect(spy2).toHaveBeenCalled();
      expect(component.emailSetting).toBe(EMAIL_SETTING);
    });

    it('should handle update email setting error', () => {
      const spy1 = jest.spyOn(component.formGroup, 'reset');
      const spy2 = jest.spyOn(injectedSnackBarService, 'showError');

      component.emailSetting = { countryId: 'DE' };
      component.handleUpdateEmailSetting(throwError(new ApiError('')), EMAIL_SETTING);

      expect(spy1).not.toHaveBeenCalledWith(EMAIL_SETTING);
      expect(spy2).toHaveBeenCalled();
      expect(component.emailSetting).not.toBe(EMAIL_SETTING);
    });

    it('should handle update email setting when focus is on', () => {
      const spy1 = jest.spyOn(component.formGroup, 'reset');

      component.focusEnabled = true;
      component.emailSetting = { countryId: 'DE' };
      component.handleUpdateEmailSetting(
        of({ id: 'DE', status: 'UPDATED' }),
        EMAIL_SETTING_MULTIPLE_MAILS
      );

      expect(spy1).toHaveBeenCalledWith(MULTIPLE_MAILS_FORM_GROUP);
      expect(component.emailSetting).toBe(EMAIL_SETTING_MULTIPLE_MAILS);
    });
  });

  describe('should set show MBAG/DTAG based on user product group permissions', () => {
    it('should set showMBAG to true and showDTAG to true if user have PC and TRUCK product groups when FOCUS is ON', () => {
      jest.spyOn(injectedFeatureToggleService, 'isFocusFeatureEnabled').mockReturnValue(of(true));
      const productGroupSpy = spyOn(
        injectedProductGroupService,
        'getAllForUserDataRestrictions'
      ).and.callThrough();

      component.ngOnInit();

      expect(productGroupSpy).toHaveBeenCalled();
      expect(component.showMBAG).toBeTruthy();
      expect(component.showDTAG).toBeTruthy();
    });

    it('should set showMBAG to true and showDTAG to false if user have only PC product group when FOCUS is ON', () => {
      spyOn(injectedFeatureToggleService, 'isFocusFeatureEnabled').and.returnValue(of(true));
      const productGroupSpy = jest
        .spyOn(injectedProductGroupService, 'getAllForUserDataRestrictions')
        .mockReturnValue(of([PC_PRODUCT_GROUP]));

      component.ngOnInit();

      expect(productGroupSpy).toHaveBeenCalled();
      expect(component.showMBAG).toBeTruthy();
      expect(component.showDTAG).toBeFalsy();
    });

    it('should set showMBAG to false and showDTAG to true if user have only UNIMOG product group when FOCUS is ON', () => {
      jest.spyOn(injectedFeatureToggleService, 'isFocusFeatureEnabled').mockReturnValue(of(true));
      const productGroupSpy = jest
        .spyOn(injectedProductGroupService, 'getAllForUserDataRestrictions')
        .mockReturnValue(of([UNIMOG_PRODUCT_GROUP]));

      component.ngOnInit();

      expect(productGroupSpy).toHaveBeenCalled();
      expect(component.showMBAG).toBeFalsy();
      expect(component.showDTAG).toBeTruthy();
    });

    it('should set showMBAG to false and showDTAG to false if user dont have product group when FOCUS is ON', () => {
      jest.spyOn(injectedFeatureToggleService, 'isFocusFeatureEnabled').mockReturnValue(of(true));
      const productGroupSpy = jest
        .spyOn(injectedProductGroupService, 'getAllForUserDataRestrictions')
        .mockReturnValue(of([]));

      component.ngOnInit();

      expect(productGroupSpy).toHaveBeenCalled();
      expect(component.showMBAG).toBeFalsy();
      expect(component.showDTAG).toBeFalsy();
    });

    it('should not call get product restrictions when FOCUS is OFF', () => {
      const productGroupSpy = jest.spyOn(
        injectedProductGroupService,
        'getAllForUserDataRestrictions'
      );

      component.ngOnInit();

      expect(productGroupSpy).toHaveBeenCalledTimes(0);
    });
  });
});
