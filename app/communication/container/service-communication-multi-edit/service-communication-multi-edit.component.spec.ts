import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { appConfigMock } from '../../../app-config.mock';
import { AppConfigProvider } from '../../../app-config.service';
import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { LegalStructureRoutingService } from '../../../legal-structure/legal-structure-routing.service';
import { getOutletFormMock } from '../../../legal-structure/outlet/edit-outlet/edit-outlet.component.spec';
import { OutletService } from '../../../legal-structure/shared/services/outlet.service';
import { OfferedServiceMock } from '../../../services/offered-service/offered-service.mock';
import { OfferedService } from '../../../services/offered-service/offered-service.model';
import { OfferedServiceService } from '../../../services/offered-service/offered-service.service';
import { ServiceMock } from '../../../services/service/models/service.mock';
import { MultiSelectDataService } from '../../../services/service/services/multi-select-service-data.service';
import { MultiSelectDataServiceMock } from '../../../services/service/services/multi-select-service-data.service.mock';
import { ServiceService } from '../../../services/service/services/service.service';
import { TranslateDataPipe } from '../../../shared/pipes/translate-data/translate-data.pipe';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { BusinessSiteTaskService } from '../../../tasks/shared/business-site-task.service';
import { TestingModule } from '../../../testing/testing.module';
import { DistributionLevelsService } from '../../../traits/distribution-levels/distribution-levels.service';
import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import {
  CommunicationService,
  ServiceCommunicationUpdateItemResponse,
  ServiceCommunicationUpdateResponse
} from '../../communication.service';
import { serviceCommunicationDataMock } from '../../model/communication-data.mock';
import { offeredServiceMock } from '../../model/offered-service.mock';
import { ServiceCommunicationMultiEditComponent } from './service-communication-multi-edit.component';

const appConfig = appConfigMock;

class ActivatedRouteStub {
  queryParams = new BehaviorSubject({
    productCategoryId: offeredServiceMock[0].productCategoryId,
    serviceId: offeredServiceMock[0].serviceId
  });
}

class LegalStructureRoutingServiceStub {
  outletIdChanges = new BehaviorSubject<string>('GS0000001');
}

describe('ServiceCommunicationMultiEditComponent', () => {
  let component: ServiceCommunicationMultiEditComponent;
  let fixture: ComponentFixture<ServiceCommunicationMultiEditComponent>;
  let appConfigProviderSpy: Spy<AppConfigProvider>;
  let outletServiceSpy: Spy<OutletService>;
  let distributionLevelServiceSpy: Spy<DistributionLevelsService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  const legalStructureRoutingServiceStub = new LegalStructureRoutingServiceStub();
  let userSettingsServiceSpy: Spy<UserSettingsService>;
  let communicationServiceSpy: Spy<CommunicationService>;
  const activatedRouteStub = new ActivatedRouteStub();
  let snackBarServiceSpy: Spy<SnackBarService>;
  let serviceServiceSpy: Spy<ServiceService>;
  let matDialogSpy: Spy<MatDialog>;
  let businessSiteTaskServiceSpy: Spy<BusinessSiteTaskService>;
  let offeredServiceServiceSpy: Spy<OfferedServiceService>;
  const service = ServiceMock.asList();
  const offeredService: OfferedService[] = OfferedServiceMock.asList();

  beforeEach(() => {
    appConfigProviderSpy = createSpyFromClass(AppConfigProvider);
    appConfigProviderSpy.getAppConfig.mockReturnValue(appConfig);
    outletServiceSpy = createSpyFromClass(OutletService);
    distributionLevelServiceSpy = createSpyFromClass(DistributionLevelsService);
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userSettingsServiceSpy = createSpyFromClass(UserSettingsService);
    communicationServiceSpy = createSpyFromClass(CommunicationService);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    serviceServiceSpy = createSpyFromClass(ServiceService);
    matDialogSpy = createSpyFromClass(MatDialog);
    businessSiteTaskServiceSpy = createSpyFromClass(BusinessSiteTaskService);
    outletServiceSpy.getOrLoadBusinessSite.nextWith(getOutletFormMock().value);
    distributionLevelServiceSpy.getDistributionLevelsOfOutlet.nextWith([]);
    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.businessSite.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.country.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.distributionLevels.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.brand.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.productGroup.mockReturnValue(userAuthorizationServiceSpy);
    userSettingsServiceSpy.get.nextWith({languageId: 'en', doNotShowMultiSelectConfirmationDialog: false });
    serviceServiceSpy.selectAllBy.nextWith(service);
    serviceServiceSpy.isLoading.nextWith(false);
    offeredServiceServiceSpy = createSpyFromClass(OfferedServiceService);
    offeredServiceServiceSpy.getAll.nextWith(offeredService);
    communicationServiceSpy.getOfferedServicesOfOutlet.mockReturnValue(of(offeredServiceMock));
    communicationServiceSpy.getServiceCommunicationDataOfOutlet.mockReturnValue(
      of([
        serviceCommunicationDataMock[0],
        serviceCommunicationDataMock[1],
        serviceCommunicationDataMock[2]
      ])
    );

    TestBed.configureTestingModule({
      declarations: [ServiceCommunicationMultiEditComponent, TranslateDataPipe],
      imports: [TestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AppConfigProvider, useValue: appConfigProviderSpy },
        { provide: OutletService, useValue: outletServiceSpy },
        { provide: DistributionLevelsService, useValue: distributionLevelServiceSpy },
        {
          provide: UserAuthorizationService,
          useValue: {
            isAuthorizedFor: userAuthorizationServiceSpy
          }
        },
        { provide: LegalStructureRoutingService, useValue: legalStructureRoutingServiceStub },
        { provide: UserSettingsService, useValue: userSettingsServiceSpy },
        { provide: MultiSelectDataService, useClass: MultiSelectDataServiceMock },
        { provide: CommunicationService, useValue: communicationServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: ServiceService, useValue: serviceServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: BusinessSiteTaskService, useValue: businessSiteTaskServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceCommunicationMultiEditComponent);
    component = fixture.componentInstance;
    component.saveButtonDisabled = true;
    component.cancelButtonDisabled = true;
    component.serviceIds = [1];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize isTaskPresent with true when a task exists', done => {
      userAuthorizationServiceSpy.verify.nextWith(true);
      businessSiteTaskServiceSpy.existsOpenDataChangeFor.nextWith(true);

      component.isTaskPresent.subscribe(isTaskPresent => {
        expect(isTaskPresent).toBeTruthy();
        done();
      });
    });

    it('should initialize isTaskPresent with false when no task exists', done => {
      userAuthorizationServiceSpy.verify.nextWith(true);
      businessSiteTaskServiceSpy.existsOpenDataChangeFor.nextWith(false);

      component.isTaskPresent.subscribe(isTaskPresent => {
        expect(isTaskPresent).toBeFalsy();
        done();
      });
    });
  });

  describe('cancel', () => {
    it('should set pristine to true, init communication data and set all button to default', () => {
      component.offeredServices = new Observable(observer => {
        observer.next([]);
      });

      spyOn(component, 'disableSaveButton');
      spyOn(component, 'disableCancelButton');
      spyOn(component, 'initCommunicationData');

      component.reset();

      expect(component.initCommunicationData).toHaveBeenCalled();
      expect(component.disableSaveButton).toHaveBeenCalled();
      expect(component.disableCancelButton).toHaveBeenCalled();
      expect(component.isPristine).toBeTruthy();
    });
  });

  describe('save Communications', () => {
    beforeEach(() => {
      spyOn(component, 'showFailedResults');
      spyOn(component, 'showSuccessResults');
    });

    it('should show snackbar service to show fail when update service communication have error', () => {
      const mockFailData: ServiceCommunicationUpdateItemResponse = {
        offeredServiceId: 'OfferedServiceId',
        communicationFieldId: 'CommunicationFieldId',
        messages: ['failedMessage1', 'failedMessage2'],
      };

      const mockResult: ServiceCommunicationUpdateResponse = {
        success: [],
        fail: [mockFailData]
      };
      const mockData = ['communicationData1'];
      const mockData2 = ['communicationData2'];
      const mockData3 = ['noChangedCommunicationData'];
      spyOn(communicationServiceSpy, 'updateServiceCommunicationData').and.returnValue(of(mockResult))

      component.saveCommunications(mockData, mockData2, mockData3);
      expect(component.showFailedResults).toHaveBeenCalled();
    });
    it('should show snackbar service to show success when update service communication success', () => {
      const mockSuccessData: ServiceCommunicationUpdateItemResponse = {
        offeredServiceId: 'OfferedServiceId',
        communicationFieldId: 'CommunicationFieldId',
        messages: ['successMessage1', 'successMessage2'],
      };

      const mockResult: ServiceCommunicationUpdateResponse = {
        success: [mockSuccessData],
        fail: []
      };
      const mockData = ['communicationData1'];
      const mockData2 = ['communicationData2'];
      const mockData3 = ['noChangedCommunicationData'];
      spyOn(communicationServiceSpy, 'updateServiceCommunicationData').and.returnValue(of(mockResult))

      component.saveCommunications(mockData, mockData2, mockData3);
      expect(component.showSuccessResults).toHaveBeenCalled();
    });it('should show snackbar service to show error when update service communication error', () => {
      communicationServiceSpy.updateServiceCommunicationData.throwWith('');
      const mockData = ['communicationData1'];
      const mockData2 = ['communicationData2'];
      const mockData3 = ['noChangedCommunicationData'];

      component.saveCommunications(mockData, mockData2, mockData3);
      expect(snackBarServiceSpy.showError).toHaveBeenCalled();
    });
  });

  describe('showSuccessResults', () => {
    it('should call snackbar to display request success message when called with no change communication', () => {
      const mockSuccessData: ServiceCommunicationUpdateItemResponse = {
        offeredServiceId: 'OfferedServiceId',
        communicationFieldId: 'CommunicationFieldId',
        messages: ['successMessage1', 'successMessage2'],
      };

      const mockData = ['noChangedCommunicationData'];

      component.showSuccessResults([mockSuccessData], mockData);
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalled();
    });
    it('should call snackbar to display data success message when called without no change communication', () => {
      const mockSuccessData: ServiceCommunicationUpdateItemResponse = {
        offeredServiceId: 'OfferedServiceId',
        communicationFieldId: 'CommunicationFieldId',
        messages: ['successMessage1', 'successMessage2'],
      };

      const mockData= null;

      component.showSuccessResults([mockSuccessData], mockData);
      expect(snackBarServiceSpy.showInfoWithData).toHaveBeenCalled();
    });
  });

  describe('showFailedResults', () => {
    it('should call snackbar to display fail message when called', () => {
      const mockFailData: ServiceCommunicationUpdateItemResponse = {
        offeredServiceId: 'OfferedServiceId',
        communicationFieldId: 'CommunicationFieldId',
        messages: ['failedMessage1', 'failedMessage2'],
      };

      component.showFailedResults([mockFailData]);
      expect(snackBarServiceSpy.displayMessageWithLengthLimit).toHaveBeenCalled();
    });
  });
});
