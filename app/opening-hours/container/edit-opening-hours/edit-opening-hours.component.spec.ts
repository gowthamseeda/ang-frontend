import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import localeEn from '@angular/common/locales/en';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { NgxPermissionsAllowStubDirective } from 'ngx-permissions';
import { of } from 'rxjs';

import { appConfigMock } from '../../../app-config.mock';
import { AppConfigProvider } from '../../../app-config.service';
import { BrandService } from '../../../services/brand/brand.service';
import { TranslateDataPipe } from '../../../shared/pipes/translate-data/translate-data.pipe';
import { NavigationService } from '../../../shared/services/navigation/navigation.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import { OpeningHoursConverterService } from '../../services/opening-hours-converter.service';
import { OpeningHoursPermissionService } from '../../services/opening-hours-permission.service';
import { OpeningHoursActionService } from '../../store/action-service';
import { getInitialState } from '../../store/opening-hours-state.mock';
import { selectOpeningHoursState } from '../../store/reducers';

import { LocaleService } from './../../../shared/services/locale/locale.service';
import {
  EditOpeningHoursComponent,
  weekStartMonday,
  weekStartSaturday,
  weekStartSunday
} from './edit-opening-hours.component';
import {UserService} from "../../../iam/user/user.service";
import {DataChangedNotificationService} from "../../../notifications/services/data-changed-notification.service";
import {FeatureToggleService} from "../../../shared/directives/feature-toggle/feature-toggle.service";
import {BusinessSiteTaskService} from "../../../tasks/shared/business-site-task.service";
import {OpeningHoursData} from "../../../tasks/task.model";
import { TaskDataService } from '../../../tasks/task/store/task-data.service';
class ActivatedRouteStub {
  queryParams = of({
    productCategoryId: 1,
    serviceId: 120,
    serviceCharacteristicId: 1
  });
}

const appConfig = appConfigMock;

describe('EditOpeningHoursComponent', () => {
  let component: EditOpeningHoursComponent;
  let fixture: ComponentFixture<EditOpeningHoursComponent>;
  let taskDataServiceSpy: Spy<TaskDataService>;
  let store: MockStore;
  let snackbarService: Spy<SnackBarService>;
  let permissionService: OpeningHoursPermissionService;
  let converterService: Spy<OpeningHoursConverterService>;
  let localeService: LocaleService;
  let brandService: BrandService;
  const initialState = getInitialState();
  let userSettingsServiceSpy: Spy<UserSettingsService>;
  let navigationService: NavigationService;
  let actionService: Spy<OpeningHoursActionService>;
  let appConfigProviderSpy: Spy<AppConfigProvider>;
  let featureToggleServiceSpy: Spy<FeatureToggleService>;
  let userServiceSpy: Spy<UserService>;
  let dataChangedNotificationServiceSpy: Spy<DataChangedNotificationService>
  let businessSiteTaskServiceSpy: Spy<BusinessSiteTaskService>

  beforeEach(waitForAsync(() => {
    actionService = createSpyFromClass(OpeningHoursActionService);
    snackbarService = createSpyFromClass(SnackBarService);
    converterService = createSpyFromClass(OpeningHoursConverterService);
    userSettingsServiceSpy = createSpyFromClass(UserSettingsService);
    userSettingsServiceSpy.getLanguageId.nextWith('en');
    featureToggleServiceSpy = createSpyFromClass(FeatureToggleService);
    featureToggleServiceSpy.isFeatureEnabled.nextWith(false);
    userServiceSpy = createSpyFromClass(UserService);
    userServiceSpy.getRoles.nextWith([])
    dataChangedNotificationServiceSpy = createSpyFromClass(DataChangedNotificationService)
    dataChangedNotificationServiceSpy.getOpeningHoursNotification.nextWith([])
    businessSiteTaskServiceSpy = createSpyFromClass(BusinessSiteTaskService)
    businessSiteTaskServiceSpy.getByOutletId.nextWith([])
    appConfigProviderSpy = createSpyFromClass(AppConfigProvider);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [
        EditOpeningHoursComponent,
        NgxPermissionsAllowStubDirective,
        TranslateDataPipe
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: SnackBarService, useValue: snackbarService },
        { provide: TaskDataService, useValue: taskDataServiceSpy },
        { provide: UserSettingsService, useValue: userSettingsServiceSpy },
        { provide: FeatureToggleService, useValue: featureToggleServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: DataChangedNotificationService, useValue: dataChangedNotificationServiceSpy },
        { provide: BusinessSiteTaskService, useValue: businessSiteTaskServiceSpy},
        {
          provide: BrandService,
          useValue: {
            getAllIds: jest.fn()
          }
        },
        {
          provide: OpeningHoursConverterService,
          useValue: converterService
        },
        {
          provide: OpeningHoursPermissionService,
          useValue: {
            isAllowed: jest.fn(),
            isSaveAllowed: jest.fn(),
            getRestrictedBrands: jest.fn(),
            getRestrictedProductGroups: jest.fn()
          }
        },
        {
          provide: LocaleService,
          useValue: {
            currentTranslationLocale: jest.fn()
          }
        },
        {
          provide: NavigationService,
          useValue: {
            navigateAbsoluteTo: jest.fn()
          }
        },
        {
          provide: ActivatedRoute,
          useClass: ActivatedRouteStub
        },
        {
          provide: OpeningHoursActionService,
          useValue: actionService
        },
        {
          provide: AppConfigProvider,
          useValue: appConfigProviderSpy
        }
      ],
      imports: [TestingModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    permissionService = TestBed.inject(OpeningHoursPermissionService);
    brandService = TestBed.inject(BrandService);
    localeService = TestBed.inject(LocaleService);
    navigationService = TestBed.inject(NavigationService);

    jest.spyOn(brandService, 'getAllIds').mockReturnValue(of([]));
    jest.spyOn(permissionService, 'isAllowed').mockReturnValue(of(true));
    jest.spyOn(permissionService, 'getRestrictedBrands').mockReturnValue(of([]));
    jest.spyOn(permissionService, 'getRestrictedProductGroups').mockReturnValue(of([]));
    jest.spyOn(localeService, 'currentTranslationLocale').mockReturnValue(of('de-DE'));
    registerLocaleData(localeDeExtra, 'de-DE');
    jest.spyOn(navigationService, 'navigateAbsoluteTo');
    jest.spyOn(appConfigProviderSpy, 'getAppConfig').mockReturnValue(appConfig);

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectOpeningHoursState, initialState);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOpeningHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(store).toBeTruthy();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit should', () => {
    test('return Sunday as first day of week when English locale is used', () => {
      jest.spyOn(localeService, 'currentTranslationLocale').mockReturnValue(of('en'));
      registerLocaleData(localeEn, 'en');
      component.ngOnInit();

      expect(component.localizedWeekDays).toBe(weekStartSunday);
    });

    test('return Monday as first day of week when German locale is used', () => {
      jest.spyOn(localeService, 'currentTranslationLocale').mockReturnValue(of('de'));
      registerLocaleData(localeDe, 'de');
      component.ngOnInit();

      expect(component.localizedWeekDays).toBe(weekStartMonday);
    });

    test('return Saturday as first day of week when Arabian locale is used', () => {
      jest.spyOn(localeService, 'currentTranslationLocale').mockReturnValue(of('ar'));
      registerLocaleData(localeAr, 'ar');
      component.ngOnInit();

      expect(component.localizedWeekDays).toBe(weekStartSaturday);
    });
  });

  describe('canDeactivate', () => {
    it('should return true if no data change in form', () => {
      component.savingStatus.updated = false;

      const canDeactivate = component.canDeactivate();
      expect(canDeactivate).toBeTruthy();
    });

    it('should return false if save and cancel buttons are enabled', () => {
      component.savingStatus.updated = true;
      component.isFormValid = true;
      component.isVerificationTaskPresent = true;

      const canDeactivate = component.canDeactivate();
      expect(canDeactivate).toBeFalsy();
    });
  });

  describe('cancelButtonClicked', () => {
    it('should dispatch reload stores', () => {
      jest.spyOn(actionService, 'dispatchLoadOpeningHours');
      component.businessSiteId = 'GS0000002';
      component.cancelButtonClicked();

      expect(actionService.dispatchLoadOpeningHours).toHaveBeenCalled();
      expect(actionService.dispatchLoadOpeningHours).toHaveBeenCalledWith('GS0000002', 1, 120, 1);
    });
  });

  describe('populateDataChangeTaskOpeningHour', () => {
    it('should populate weekdaysOpeningHours correctly', () => {
      jest.spyOn(component, 'appendDataChangeTasks');
      component.openingHourDiffList = [
        { id: 1, productCategoryId: 1, productGroupId: 'PC', serviceId: 123, brandId: 'brand1', day: 'MO', diff: { new: {
              closed: false, times: [
                {begin: '09:00', end: '11:00'}, {begin: '13:00', end: '15:00'}
              ]
            }, old: {
              closed: false, times: [
                {begin: '09:00', end: '11:00'}, {begin: '13:00', end: '15:00'}, {begin: '16:00', end: '17:00'}
              ]
            }
          }
        }
      ];

      component.populateDataChangeTaskOpeningHour(['brand1']);

      expect(component.weekdaysOpeningHours.length).toBeGreaterThan(0);
      expect(component.weekdaysOpeningHours[0].weekDay).toBe(1);
    });

    it('should not populate weekdaysOpeningHours if openingHourDiffList is empty', () => {
      component.openingHourDiffList = [];

      component.populateDataChangeTaskOpeningHour(['brand1']);

      expect(component.weekdaysOpeningHours.length).toBe(0);
    });
  });

  describe('combineOpeningHoursData', () => {
    it('should combine opening hours data correctly', () => {
      const data: OpeningHoursData[] = [
        { id: 1, productCategoryId: 1, serviceId: 123, brandId: 'brand1', day: 'MO', productGroupId: 'group1', diff: {new: {
        closed: false, times: [
          {begin: '09:00', end: '11:00'}, {begin: '13:00', end: '15:00'}
        ]
      }, old: {
        closed: false, times: [
          {begin: '09:00', end: '11:00'}, {begin: '13:00', end: '15:00'}, {begin: '16:00', end: '17:00'}
        ]
      } }},
        { id: 2, productCategoryId: 1, serviceId: 123, brandId: 'brand1', day: 'MO', productGroupId: 'group2', diff: { new: {
              closed: false, times: [
                {begin: '09:00', end: '11:00'}, {begin: '13:00', end: '15:00'}
              ]
            }, old: {
              closed: false, times: [
                {begin: '09:00', end: '11:00'}, {begin: '13:00', end: '15:00'}, {begin: '16:00', end: '17:00'}
              ]
            } } }
      ];

      const combinedData = component.combineOpeningHoursData(data);

      expect(combinedData.length).toBe(1);
      expect(combinedData[0].productGroupId).toBe('group1,group2');
    });

    it('should return empty array if input data is empty', () => {
      const data = [];

      const combinedData = component.combineOpeningHoursData(data);

      expect(combinedData.length).toBe(0);
    });
  });
  describe('initDataChangeTasks', () => {
    it('should not retrieve tasks if taskRetrieved is true', () => {
      jest.spyOn(component, 'appendDataChangeTasks');
      component.taskRetrieved = true;
      component.initDataChangeTasks();

      expect(businessSiteTaskServiceSpy.getByOutletId).not.toHaveBeenCalled();
    });
    it('should retrieve tasks and append data change tasks', () => {
      jest.spyOn(component, 'appendDataChangeTasks');
      jest.spyOn(businessSiteTaskServiceSpy, 'getByOutletId').mockReturnValue(of([1, 2, 3]));
      component.is4RetailEnabled = true;
      component.businessSiteId = 'GS0000002';
      component.isBSR = true;
      component.initDataChangeTasks();
      expect(businessSiteTaskServiceSpy.getByOutletId).toHaveBeenCalledWith('GS0000002');
      expect(component.taskRetrieved).toBe(true);
    });
  });
});
