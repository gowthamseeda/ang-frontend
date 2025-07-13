import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import localeDeExtra from '@angular/common/locales/extra/de';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { NgxPermissionsAllowStubDirective } from 'ngx-permissions';
import { BehaviorSubject, of } from 'rxjs';
import { appConfigMock } from '../../../app-config.mock';
import { AppConfigProvider } from '../../../app-config.service';
import { BrandService } from '../../../services/brand/brand.service';
import { OfferedServiceMock } from '../../../services/offered-service/offered-service.mock';
import { OfferedService } from '../../../services/offered-service/offered-service.model';
import { OfferedServiceService } from '../../../services/offered-service/offered-service.service';
import { ServiceMock } from '../../../services/service/models/service.mock';
import { ServiceService } from '../../../services/service/services/service.service';
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

import { RouterTestingModule } from '@angular/router/testing';
import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { LegalStructureRoutingService } from '../../../legal-structure/legal-structure-routing.service';
import { getOutletFormMock } from '../../../legal-structure/outlet/edit-outlet/edit-outlet.component.spec';
import { OutletService } from '../../../legal-structure/shared/services/outlet.service';
import { MultiSelectDataService } from '../../../services/service/services/multi-select-service-data.service';
import { MultiSelectDataServiceMock } from '../../../services/service/services/multi-select-service-data.service.mock';
import { LocaleService } from '../../../shared/services/locale/locale.service';
import { BusinessSiteTaskService } from '../../../tasks/shared/business-site-task.service';
import { DistributionLevelsService } from '../../../traits/distribution-levels/distribution-levels.service';
import {
  OpeningHoursMultiEditComponent,
  weekStartMonday,
  weekStartSaturday,
  weekStartSunday
} from './opening-hours-multi-edit.component';
import {TaskFooterEvent} from "../../../tasks/task.model";
import { OfferedServiceDataService } from 'app/services/offered-service/store/offered-service-data.service';

class ActivatedRouteStub {
  queryParams = of({
    productCategoryId: 1,
    serviceId: 120,
    serviceCharacteristicId: 1
  });
}

class LegalStructureRoutingServiceStub {
  outletIdChanges = new BehaviorSubject<string>('GS0000001');
}

const appConfig = appConfigMock;

describe('OpeningHoursMultiEditComponent', () => {
  let component: OpeningHoursMultiEditComponent;
  let fixture: ComponentFixture<OpeningHoursMultiEditComponent>;
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
  let matDialogSpy: Spy<MatDialog>;

  const legalStructureRoutingServiceStub = new LegalStructureRoutingServiceStub();
  let outletServiceSpy: Spy<OutletService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let distributionLevelsServiceSpy: Spy<DistributionLevelsService>;
  let businessSiteTaskServiceSpy: Spy<BusinessSiteTaskService>;
  let offeredServiceServiceSpy: Spy<OfferedServiceService>;
  let serviceServiceSpy: Spy<ServiceService>;
  let offeredServiceDataService: OfferedServiceDataService;
  const offeredService: OfferedService[] = OfferedServiceMock.asList();
  const service = ServiceMock.asList();

  beforeEach(waitForAsync(() => {
    actionService = createSpyFromClass(OpeningHoursActionService);
    snackbarService = createSpyFromClass(SnackBarService);
    converterService = createSpyFromClass(OpeningHoursConverterService);
    userSettingsServiceSpy = createSpyFromClass(UserSettingsService);
    userSettingsServiceSpy.get.nextWith({languageId: 'en', doNotShowMultiSelectConfirmationDialog: false });
    outletServiceSpy = createSpyFromClass(OutletService);
    serviceServiceSpy = createSpyFromClass(ServiceService);
    matDialogSpy = createSpyFromClass(MatDialog);
    outletServiceSpy.getOrLoadBusinessSite.nextWith(getOutletFormMock().value);
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.businessSite.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.country.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.observableDistributionLevels.mockReturnValue(
      userAuthorizationServiceSpy
    );
    userAuthorizationServiceSpy.verify.nextWith(true);
    distributionLevelsServiceSpy = createSpyFromClass(DistributionLevelsService);
    distributionLevelsServiceSpy.get.nextWith([]);
    serviceServiceSpy.selectAllBy.nextWith(service);
    serviceServiceSpy.isLoading.nextWith(false);

    businessSiteTaskServiceSpy = createSpyFromClass(BusinessSiteTaskService);
    businessSiteTaskServiceSpy.existsOpenDataChangeFor.nextWith(false);
    businessSiteTaskServiceSpy.existsOpenVerificationTaskFor.nextWith(false);
    offeredServiceServiceSpy = createSpyFromClass(OfferedServiceService);
    offeredServiceServiceSpy.getAll.nextWith(offeredService);
    serviceServiceSpy = createSpyFromClass(ServiceService);
    serviceServiceSpy.selectAllBy.nextWith(service);

    appConfigProviderSpy = createSpyFromClass(AppConfigProvider);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [
        OpeningHoursMultiEditComponent,
        NgxPermissionsAllowStubDirective,
        TranslateDataPipe
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: SnackBarService, useValue: snackbarService },
        { provide: UserSettingsService, useValue: userSettingsServiceSpy },
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
        },
        { provide: MultiSelectDataService, useClass: MultiSelectDataServiceMock },
        { provide: LegalStructureRoutingService, useValue: legalStructureRoutingServiceStub },
        { provide: ServiceService, useValue: serviceServiceSpy },
        { provide: OutletService, useValue: outletServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy },
        {
          provide: UserAuthorizationService,
          useValue: {
            isAuthorizedFor: userAuthorizationServiceSpy
          }
        },
        { provide: DistributionLevelsService, useValue: distributionLevelsServiceSpy },
        { provide: BusinessSiteTaskService, useValue: businessSiteTaskServiceSpy },
        { provide: ServiceService, useValue: serviceServiceSpy },
        { provide: OfferedServiceService, useValue: offeredServiceServiceSpy },
        { provide: OfferedServiceDataService,
          useValue: {
            createOfferedService: jest.fn()
          }
        }
      ],
      imports: [TestingModule, TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    permissionService = TestBed.inject(OpeningHoursPermissionService);
    brandService = TestBed.inject(BrandService);
    localeService = TestBed.inject(LocaleService);
    navigationService = TestBed.inject(NavigationService);
    offeredServiceDataService = TestBed.inject(OfferedServiceDataService);

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
    fixture = TestBed.createComponent(OpeningHoursMultiEditComponent);
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

    it('should initialize isEditable with true is user is permitted', done => {
      userAuthorizationServiceSpy.verify.nextWith(true);

      component.isEditable.subscribe(isEditable => {
        expect(isEditable).toBeTruthy();
        done();
      });
    });

    it('should initialize isEditable with false is user is not permitted', done => {
      userAuthorizationServiceSpy.verify.nextWith(false);

      component.isEditable.subscribe(isEditable => {
        expect(isEditable).toBeFalsy();
        done();
      });
    });
  });

  describe('canDeactivate', () => {
    it('should return true if no data change in form', () => {
      component.savingStatus.updated = false;
    });
  });

  describe('cancelButtonClicked', () => {
    it('should dispatch reload stores', () => {
      jest.spyOn(component, 'onSelectedSpecialHourClose');
      jest.spyOn(component, 'initOpeningHourMultiEdit');

      component.cancelButtonClicked();

      expect(component.onSelectedSpecialHourClose).toHaveBeenCalled();
      expect(component.initialHours).toBeUndefined();
      expect(component.initOpeningHourMultiEdit).toHaveBeenCalled();
    });
  });

  describe('saveOpeningHours', () => {
    it('should call actionServices Special Opening hours functions when first day or second day is selected', () => {
      const mockEvent: TaskFooterEvent = {};
      const mockData = {firstDaySelected: true, secondDaySelected: true, selectedServices: [], event: mockEvent};
      component.saveOpeningHours(mockData);
      expect(actionService.dispatchCloseSelectedSpecialOpeningHours).toHaveBeenCalled();
      expect(actionService.dispatchRemoveUnchangedSpecialOpeningHours).toHaveBeenCalled();
      expect(actionService.dispatchMultiEditOpeningHoursSubmit).toHaveBeenCalled();
    });
    it('should call actionServices to submit the opening hours data', () => {
      const mockEvent: TaskFooterEvent = {};
      const mockData = {firstDaySelected: false, secondDaySelected: false, selectedServices: [], event: mockEvent};
      component.saveOpeningHours(mockData);
      expect(actionService.dispatchCloseSelectedSpecialOpeningHours).toHaveBeenCalledTimes(0);
      expect(actionService.dispatchRemoveUnchangedSpecialOpeningHours).toHaveBeenCalledTimes(0);
      expect(actionService.dispatchMultiEditOpeningHoursSubmit).toHaveBeenCalled();
    });
  });

  describe('promptCopyToCompanyDialog', () => {
    it('should call prompt copy to company dialog', done => {
      component.selectedOutletIdsToCopy = []
      const openDialogSpy = spyOn(matDialogSpy, 'open')
        .and
        .returnValue({ afterClosed: () => of(['GS007']) });

      component.openCopyToCompanyDialog();
      expect(openDialogSpy).toHaveBeenCalled();
      expect(component.selectedOutletIdsToCopy).toContain('GS007')
      done()
    });
  });

  describe('saveButtonClicked', () => {
    it('should call createOfferedService and saveOpeningHours when save', async () => {
      jest.spyOn(offeredServiceDataService, 'createOfferedService').mockReturnValue(of(undefined));
      spyOn(component, 'saveOpeningHours');
      const mockEvent: TaskFooterEvent = {};

      await component.createOfferedServiceAndSaveOpeningHours(
        [], true, true, [], mockEvent
      );

      expect(offeredServiceDataService.createOfferedService).toHaveBeenCalled();
      expect(component.saveOpeningHours).toHaveBeenCalled();
    });
  });

});
