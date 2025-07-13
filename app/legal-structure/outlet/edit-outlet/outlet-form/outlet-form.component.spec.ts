import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { TranslateDataPipe } from '../../../../shared/pipes/translate-data/translate-data.pipe';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import { ActiveLanguageService } from '../../../shared/components/language-toggle/active-language.service';
import { getOutletMock } from '../../../shared/models/outlet.mock';
import { MessageService } from '../../../shared/services/message.service';

import { OutletFormComponent } from './outlet-form.component';
import { DataChangedNotificationService } from '../../../../notifications/services/data-changed-notification.service';
import { UserService } from '../../../../iam/user/user.service';
import { BusinessSiteTaskService } from '../../../../tasks/shared/business-site-task.service';
import { FeatureToggleService } from '../../../../shared/directives/feature-toggle/feature-toggle.service';
import { AffectedBusinessSites } from '../../../shared/components/status/status.component';
import {BaseData4rService} from "../../base-data-4r.service";
import {of} from "rxjs";

function getFormMock() {
  return new UntypedFormBuilder().group({});
}

const mockStreetNotiData = { businessSiteId: 'GS01', changedField: 'STREET', taskStatus: 'DECLINED', date: new Date(), readStatus: false }
const mockAdditionalStreetNotiData = { businessSiteId: 'GS01', changedField: 'ADDITIONAL_ADDRESS_STREET', taskStatus: 'APPROVED', date: new Date(), readStatus: false }
const mockPOZipCodeNotiData = { businessSiteId: 'GS01', changedField: 'PO_BOX_ZIP_CODE', taskStatus: 'DECLINED', date: new Date(), readStatus: false }
const mockLatitudeNotiData = { businessSiteId: 'GS01', changedField: 'LATITUDE', taskStatus: 'APPROVED', date: new Date(), readStatus: false }
const mockStreetNumberNotiData = { businessSiteId: 'GS01', changedField: 'STREET_NUMBER', taskStatus: 'DIRECT_CHANGE', date: new Date(), readStatus: false }

describe('OutletFormComponent', () => {
  let component: OutletFormComponent;
  let fixture: ComponentFixture<OutletFormComponent>;

  let messageServiceSpy: Spy<MessageService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let activeLanguageServiceSpy: Spy<ActiveLanguageService>;
  let dataChangedNotificationServiceSpy: Spy<DataChangedNotificationService>;
  let userServiceSpy: Spy<UserService>;
  let businessSiteTaskServiceSpy: Spy<BusinessSiteTaskService>;
  let featureToggleServiceSpy: Spy<FeatureToggleService>;
  let baseData4rServiceSpy: Spy<BaseData4rService>;

  beforeEach(waitForAsync(() => {
    messageServiceSpy = createSpyFromClass(MessageService);
    messageServiceSpy.get.nextWith({});
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.verify.nextWith(true);
    activeLanguageServiceSpy = createSpyFromClass(ActiveLanguageService);
    activeLanguageServiceSpy.get.nextWith({ isDefaultLanguage: true });
    dataChangedNotificationServiceSpy = createSpyFromClass(DataChangedNotificationService);
    dataChangedNotificationServiceSpy.get.nextWith([mockStreetNotiData, mockAdditionalStreetNotiData, mockPOZipCodeNotiData, mockLatitudeNotiData, mockStreetNumberNotiData]);
    dataChangedNotificationServiceSpy.read.nextWith("")
    userServiceSpy = createSpyFromClass(UserService);
    userServiceSpy.getRoles.nextWith([]);
    businessSiteTaskServiceSpy = createSpyFromClass(BusinessSiteTaskService);
    businessSiteTaskServiceSpy.getByOutletId.nextWith([]);
    featureToggleServiceSpy = createSpyFromClass(FeatureToggleService);
    featureToggleServiceSpy.isFeatureEnabled.nextWith(true);
    baseData4rServiceSpy = createSpyFromClass(BaseData4rService);
    baseData4rServiceSpy.isOpenVerificationTaskByAggregateField.mockReturnValue(of(true));
    TestBed.configureTestingModule({
      declarations: [OutletFormComponent, TranslatePipeMock, TranslateDataPipe],
      providers: [
        UntypedFormBuilder,
        { provide: MessageService, useValue: messageServiceSpy },
        {
          provide: UserAuthorizationService,
          useValue: { isAuthorizedFor: userAuthorizationServiceSpy }
        },
        { provide: ActiveLanguageService, useValue: activeLanguageServiceSpy },
        { provide: DataChangedNotificationService, useValue: dataChangedNotificationServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: BusinessSiteTaskService, useValue: businessSiteTaskServiceSpy },
        { provide: FeatureToggleService, useValue: featureToggleServiceSpy },
        { provide: BaseData4rService, useValue: baseData4rServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletFormComponent);
    component = fixture.componentInstance;
    component.parentForm = getFormMock();
    component.outlet = getOutletMock();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {

    it('should set all loading to false', fakeAsync(() => {
      component.ngOnInit()

      tick(2000);

      expect(component.is4RNotificationLoading).toBeFalsy()
    }))

    it('should disable translation parent form if parent form is disable', () => {
      component.parentForm.disable()

      component.ngOnInit()

      expect(component.translationsParentForms.disabled).toBeTruthy()
    })

    it('should not disable translation parent form if parent form is not disable', () => {
      component.ngOnInit()

      expect(component.translationsParentForms.disabled).toBeFalsy()
    })

    it('should init translation form if active language is found and not default language', () => {
      activeLanguageServiceSpy.get.nextWith({ isDefaultLanguage: false, languageId: 'de' })

      component.ngOnInit()

      expect(component.translationsParentForms.contains('de')).toBeTruthy()
    })

    it('should retrieve notifications', () => {
      userServiceSpy.getRoles.nextWith(['GSSNPLUS.BusinessSiteResponsible']);
      dataChangedNotificationServiceSpy.read.nextWith('')

      component.ngOnInit()

      expect(component.addressDataNotifications).toContain(mockStreetNotiData)
      expect(component.allNotification).toContain(mockStreetNotiData)
      expect(component.additionalAddressDataNotifications).toContain(mockAdditionalStreetNotiData)
      expect(component.allNotification).toContain(mockAdditionalStreetNotiData)
      expect(component.poBoxDataNotifications).toContain(mockPOZipCodeNotiData)
      expect(component.allNotification).toContain(mockPOZipCodeNotiData)
      expect(component.gpsDataNotifications).toContain(mockLatitudeNotiData)
      expect(component.allNotification).toContain(mockLatitudeNotiData)
      expect(component.is4RNotificationLoading).toBeFalsy()
    })

    it('should subscribe to dataChangeViewClicked and call scrollToDataChangedElement', () => {
      const scrollToDataChangedElementSpy = spyOn<any>(component, 'scrollToDataChangedElement');
      component.ngOnInit();

      component.dataChangeViewClicked.emit();

      expect(scrollToDataChangedElementSpy).toHaveBeenCalled();
    });

    it('should call read endpoint and emit value if direct change notification is more than 0', () => {
      userServiceSpy.getRoles.nextWith(['GSSNPLUS.BusinessSiteResponsible']);
      spyOn(component.isDataChanged, 'emit');

      component.ngOnInit();

      expect(dataChangedNotificationServiceSpy.read).toBeCalledWith(
        component.outlet.id,
        component.outlet.companyId,
        ['STREET_NUMBER'],
        "DIRECT_CHANGE"
      )

      expect(component.isDataChanged.emit).toBeCalledWith(true)
    })
  })

  describe('addressStreetDataRequired()', () => {
    it('should give true if address data is required (gps values are empty)', () => {
      component.parentForm = new UntypedFormBuilder().group({
        gps: new UntypedFormBuilder().group({
          latitude: [''],
          longitude: ['']
        })
      });
      expect(component.addressStreetDataRequired()).toBeTruthy();
    });

    it('should give false if address data is not required (gps values are not empty)', () => {
      component.parentForm = new UntypedFormBuilder().group({
        gps: new UntypedFormBuilder().group({
          latitude: ['43.1233'],
          longitude: ['9.23444']
        })
      });
      expect(component.addressStreetDataRequired()).toBeFalsy();
    });

    it('should give true if address data is required (form not present)', () => {
      component.parentForm = new UntypedFormBuilder().group({})

      expect(component.addressStreetDataRequired()).toBeTruthy();
    })
  });

  describe('setAffectedBusinessSites', () => {
    it('should set affected & rejecting business site', () => {
      const mockAffectedBusinessSites: AffectedBusinessSites = {
        businessSitesRequestStartOperationDateChange: ['GS01', 'GS03'],
        businessSitesPreventCompanyToChangeStartOperationDate: ['GS02', 'GS04']
      };

      component.setAffectedBusinessSites(mockAffectedBusinessSites)

      expect(component.affectedBusinessSites).toEqual(mockAffectedBusinessSites.businessSitesRequestStartOperationDateChange)
      expect(component.rejectingBusinessSites).toEqual(mockAffectedBusinessSites.businessSitesPreventCompanyToChangeStartOperationDate)
    });
  });
});
