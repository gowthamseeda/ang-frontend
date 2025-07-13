import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { BehaviorSubject, of } from 'rxjs';

import { appConfigMock } from '../../../app-config.mock';
import { AppConfigProvider } from '../../../app-config.service';
import { brandProductGroupIdMock } from '../../../contracts/model/brand-product-group-id.mock';
import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { LegalStructureRoutingService } from '../../../legal-structure/legal-structure-routing.service';
import { getOutletFormMock } from '../../../legal-structure/outlet/edit-outlet/edit-outlet.component.spec';
import { OutletService } from '../../../legal-structure/shared/services/outlet.service';
import { ServiceService } from '../../../services/service/services/service.service';
import { TranslateDataPipe } from '../../../shared/pipes/translate-data/translate-data.pipe';
import { ProgressBarService } from '../../../shared/services/progress-bar/progress-bar.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { BusinessSiteTaskService } from '../../../tasks/shared/business-site-task.service';
import { DistributionLevelsService } from '../../../traits/distribution-levels/distribution-levels.service';
import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import { CommunicationService } from '../../communication.service';
import { BrandProductGroupId } from '../../model/brand-product-group-id.model';
import { CommunicationChannelsChange } from '../../model/communication-channel.model';
import { serviceCommunicationDataMock } from '../../model/communication-data.mock';
import { CommunicationFieldType } from '../../model/communication-field-type';
import { communicationFieldMock } from '../../model/communication-field.mock';
import { offeredServiceMock } from '../../model/offered-service.mock';
import { SocialMediaChannelsPipe } from '../../pipe/social-media-channels/social-media-channels.pipe';
import { StandardCommunicationChannelsPipe } from '../../pipe/standard-communication-channels/standard-communication-channels.pipe';

import { ServiceCommunicationComponent } from './service-communication.component';
import { FeatureToggleService } from '../../../shared/directives/feature-toggle/feature-toggle.service';
import { UserService } from '../../../iam/user/user.service';
import { DataChangedNotificationService } from '../../../notifications/services/data-changed-notification.service';
import { DataCluster, Type, Status } from '../../../tasks/task.model';

class ActivatedRouteStub {
  queryParams = new BehaviorSubject({
    productCategoryId: offeredServiceMock[0].productCategoryId,
    serviceId: offeredServiceMock[0].serviceId
  });
}

class LegalStructureRoutingServiceStub {
  outletIdChanges = new BehaviorSubject<string>('GS0000001');
}

const appConfig = appConfigMock;

describe('ServiceCommunicationComponent', () => {
  let component: ServiceCommunicationComponent;
  let fixture: ComponentFixture<ServiceCommunicationComponent>;
  let communicationServiceSpy: Spy<CommunicationService>;
  const activatedRouteStub = new ActivatedRouteStub();
  const legalStructureRoutingServiceStub = new LegalStructureRoutingServiceStub();
  let snackBarServiceSpy: Spy<SnackBarService>;
  let serviceServiceSpy: Spy<ServiceService>;
  let outletServiceSpy: Spy<OutletService>;
  let distributionLevelServiceSpy: Spy<DistributionLevelsService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let businessSiteTaskServiceSpy: Spy<BusinessSiteTaskService>;
  let userSettingsServiceSpy: Spy<UserSettingsService>;
  let appConfigProviderSpy: Spy<AppConfigProvider>;
  let featureToggleServiceSpy: Spy<FeatureToggleService>;
  let userServiceSpy: Spy<UserService>;
  let dataChangedNotificationServiceSpy: Spy<DataChangedNotificationService>;

  beforeEach(() => {
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    serviceServiceSpy = createSpyFromClass(ServiceService);
    serviceServiceSpy.fetchBy.mockReturnValue(of(serviceCommunicationDataMock[0]));
    serviceServiceSpy.selectBy.mockReturnValue(of(serviceCommunicationDataMock[0]));
    outletServiceSpy = createSpyFromClass(OutletService);
    outletServiceSpy.getOrLoadBusinessSite.nextWith(getOutletFormMock().value);
    distributionLevelServiceSpy = createSpyFromClass(DistributionLevelsService);
    distributionLevelServiceSpy.getDistributionLevelsOfOutlet.nextWith([]);
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.businessSite.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.country.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.distributionLevels.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.brand.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.productGroup.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.verify.nextWith(false);
    businessSiteTaskServiceSpy = createSpyFromClass(BusinessSiteTaskService);
    businessSiteTaskServiceSpy.existsOpenDataChangeFor.nextWith(true);
    businessSiteTaskServiceSpy.existsOpenVerificationTaskFor.nextWith(true);
    userSettingsServiceSpy = createSpyFromClass(UserSettingsService);
    userSettingsServiceSpy.getLanguageId.mockReturnValue('en');
    communicationServiceSpy = createSpyFromClass(CommunicationService);
    communicationServiceSpy.getServiceCommunicationDataOfOutlet.mockReturnValue(
      of([
        serviceCommunicationDataMock[0],
        serviceCommunicationDataMock[1],
        serviceCommunicationDataMock[2]
      ])
    );
    communicationServiceSpy.getCommunicationFields.mockReturnValue(
      of([communicationFieldMock[0], communicationFieldMock[1], communicationFieldMock[2]])
    );
    communicationServiceSpy.getOfferedServicesOfOutlet.mockReturnValue(of(offeredServiceMock));

    appConfigProviderSpy = createSpyFromClass(AppConfigProvider);
    appConfigProviderSpy.getAppConfig.mockReturnValue(appConfig);

    featureToggleServiceSpy = createSpyFromClass(FeatureToggleService);
    featureToggleServiceSpy.isFeatureEnabled.nextWith(false);

    userServiceSpy = createSpyFromClass(UserService);
    userServiceSpy.getRoles.nextWith([])

    dataChangedNotificationServiceSpy = createSpyFromClass(DataChangedNotificationService);

    TestBed.configureTestingModule({
      declarations: [
        ServiceCommunicationComponent,
        SocialMediaChannelsPipe,
        StandardCommunicationChannelsPipe,
        TranslateDataPipe
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        ProgressBarService,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: CommunicationService, useValue: communicationServiceSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: ServiceService, useValue: serviceServiceSpy },
        { provide: OutletService, useValue: outletServiceSpy },
        { provide: DistributionLevelsService, useValue: distributionLevelServiceSpy },
        {
          provide: UserAuthorizationService,
          useValue: {
            isAuthorizedFor: userAuthorizationServiceSpy
          }
        },
        { provide: LegalStructureRoutingService, useValue: legalStructureRoutingServiceStub },
        { provide: BusinessSiteTaskService, useValue: businessSiteTaskServiceSpy },
        { provide: UserSettingsService, useValue: userSettingsServiceSpy },
        {
          provide: AppConfigProvider,
          useValue: appConfigProviderSpy
        },
        {
          provide: UserService,
          useValue: userServiceSpy
        },
        { provide: FeatureToggleService, useValue: featureToggleServiceSpy },
        { provide: DataChangedNotificationService, useValue: dataChangedNotificationServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceCommunicationComponent);
    component = fixture.componentInstance;
    component['initUserRole'] = jest.fn(() => of(true));
    jest.spyOn(component, 'onQueryParamChange');
    component.saveButtonDisabled = true;
    component.cancelButtonDisabled = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit and initializeComponent', () => {
    it('should initialize outletId and offeredServicesOfOutlet', () => {
      component.ngOnInit();

      expect(component.outletId).toBeDefined();
      expect(component.offeredServicesOfOutlet).toBeDefined();
    });
    
    it('should set openDataChangeTask, taskType, and communicationDiffList when open DATA_CHANGE task exists', () => {
      component.is4RetailEnabled = true;
      component.isMTR = true;
      component.isBSR = false;
      component.taskRetrieved = false;
      component.currentOutletId = 'GS0000001';

      const commDiff = {
        communicationDataDiff: [
          {
            offeredServiceId: 'offered1',
            serviceName: 'Service 1',
            serviceNameTranslations: { en: 'Service 1' },
            brandId: 'B1',
            productGroupId: 'PG1',
            communicationFieldId: 'FIELD1',
            diff: { old: 'oldValue', new: 'newValue' }
          }
        ]
      };

      const openTask = {
        type: Type.DATA_CHANGE,
        status: Status.OPEN,
        dataCluster: DataCluster.COMMUNICATION_CHANNELS,
        diff: commDiff,
        taskId: 123
      };

      businessSiteTaskServiceSpy.getByOutletId.mockReturnValue(of([openTask]));
      component.initDataChangeTasks();
      expect(businessSiteTaskServiceSpy.getByOutletId).toHaveBeenCalledWith('GS0000001');
      expect(component.openDataChangeTask.taskId).toBe(123);
      expect(component.taskType).toBe(Type.DATA_CHANGE);
      expect(component.communicationDiffList.length).toBe(1);
      expect(component.communicationDiffList[0].offeredServiceId).toBe('offered1');
      expect(component.taskRetrieved).toBe(true);
    }); 
  });

  describe('ngOnInit', () => {
    it('should initialize groupedBrandProductGroups from offered services', done => {
      const expected = { MB: [brandProductGroupIdMock[0], brandProductGroupIdMock[1]] };
      component.groupedBrandProductGroups.subscribe(groupedBrandProductGroups => {
        expect(groupedBrandProductGroups).toEqual(expected);
        done();
      });
    });

    it('should initialize communication data rows', done => {
      const expected = [
        {
          brandProductGroupIds: [brandProductGroupIdMock[0]],
          data: [serviceCommunicationDataMock[0], serviceCommunicationDataMock[1]]
        },
        {
          brandProductGroupIds: [brandProductGroupIdMock[1]],
          data: undefined
        }
      ];
      component.brandProductGroupsCommunicationData.subscribe(
        brandProductGroupsCommunicationData => {
          expect(brandProductGroupsCommunicationData).toEqual(expected);
          done();
        }
      );
    });

    it('should initialize isEditable with true when no task exists', done => {
      userAuthorizationServiceSpy.verify.nextWith(true);
      businessSiteTaskServiceSpy.existsOpenDataChangeFor.nextWith(false);

      component.isEditable.subscribe(isEditable => {
        expect(isEditable).toEqual(true);
        done();
      });
    });

    it('should initialize isEditable with false when a task exists', done => {
      userAuthorizationServiceSpy.verify.nextWith(true);
      businessSiteTaskServiceSpy.existsOpenDataChangeFor.nextWith(true);

      component.isEditable.subscribe(isEditable => {
        expect(isEditable).toEqual(false);
        done();
      });
    });

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

    it('should initialize brand product group validity', done => {
      const expected = [
        {
          brandId: 'MB',
          productGroupId: 'PC',
          validity: {
            application: true,
            valid: false
          }
        },
        {
          brandId: 'MB',
          productGroupId: 'VAN',
          validity: {
            application: false,
            valid: true
          }
        }
      ];

      component.brandProductGroupValidities.subscribe(brandProductGroupValidities => {
        expect(brandProductGroupValidities).toEqual(expected);
        done();
      });
    });

    it('should not call tasks API when unauthorized for business site', done => {
      component.isEditable.subscribe(() => {
        expect(businessSiteTaskServiceSpy.existsOpenDataChangeFor).not.toHaveBeenCalled();
        done();
      });
    });

    it('should call tasks API when authorized for business site', done => {
      userAuthorizationServiceSpy.verify.nextWith(true);

      component.isEditable.subscribe(() => {
        expect(businessSiteTaskServiceSpy.existsOpenDataChangeFor).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('upsertCommunicationDataOfOutlet', () => {
    it('should change communication data for a valid communication channels change', () => {
      const expected = [
        serviceCommunicationDataMock[0],
        serviceCommunicationDataMock[1],
        serviceCommunicationDataMock[2]
      ];
      expected[0].value = 'newValue';
      expected[1].value = 'newValue';
      const changedCommunicationChannelsMock = [
        {
          id: serviceCommunicationDataMock[0].communicationFieldId,
          format: communicationFieldMock[0].format,
          value: 'newValue'
        },
        {
          id: serviceCommunicationDataMock[1].communicationFieldId,
          format: communicationFieldMock[1].format,
          value: 'newValue'
        }
      ];

      component.upsertCommunicationDataOfOutlet(
        { invalid: false, value: changedCommunicationChannelsMock } as CommunicationChannelsChange,
        CommunicationFieldType.STANDARD,
        brandProductGroupIdMock
      );
      // @ts-ignore private
      const actualCommunicationData = component.communicationDataOfOutlet;

      expect(actualCommunicationData).toEqual(expected);
    });

    it('should not change anything for an invalid communication channels change', () => {
      // @ts-ignore private
      const initialCommunicationData = Object.assign(component.communicationDataOfOutlet);
      component.upsertCommunicationDataOfOutlet(
        { invalid: true } as CommunicationChannelsChange,
        CommunicationFieldType.STANDARD,
        brandProductGroupIdMock
      );
      // @ts-ignore private
      const actualCommunicationData = component.communicationDataOfOutlet;

      expect(initialCommunicationData).toEqual(actualCommunicationData);
    });

    it('should set correct state for save and cancel buttons for valid data', () => {
      const changedCommunicationChannelsMock = [
        {
          id: serviceCommunicationDataMock[0].communicationFieldId,
          format: communicationFieldMock[0].format,
          value: 'newValue'
        }
      ];

      component.upsertCommunicationDataOfOutlet(
        { invalid: false, value: changedCommunicationChannelsMock } as CommunicationChannelsChange,
        CommunicationFieldType.STANDARD,
        brandProductGroupIdMock
      );
      expect(component.saveButtonDisabled).toEqual(false);
      expect(component.cancelButtonDisabled).toEqual(false);
    });

    it('should set correct state for save and cancel button if not all sub-components have validated successful', () => {
      const changedCommunicationChannelsMock = [
        {
          id: serviceCommunicationDataMock[0].communicationFieldId,
          format: communicationFieldMock[0].format,
          value: 'newValue'
        }
      ];

      component.upsertCommunicationDataOfOutlet(
        { invalid: true, value: changedCommunicationChannelsMock } as CommunicationChannelsChange,
        CommunicationFieldType.STANDARD,
        brandProductGroupIdMock
      );

      expect(component.saveButtonDisabled).toEqual(true);
      expect(component.cancelButtonDisabled).toEqual(false);
    });

    it('should set correct state for save and cancel button even if some sub-components are valid', () => {
      const changedCommunicationChannelsMock = [
        {
          id: serviceCommunicationDataMock[0].communicationFieldId,
          format: communicationFieldMock[0].format,
          value: 'newValue'
        }
      ];

      component.upsertCommunicationDataOfOutlet(
        { invalid: true, value: changedCommunicationChannelsMock } as CommunicationChannelsChange,
        CommunicationFieldType.STANDARD,
        brandProductGroupIdMock
      );

      component.upsertCommunicationDataOfOutlet(
        { invalid: false, value: changedCommunicationChannelsMock } as CommunicationChannelsChange,
        CommunicationFieldType.SOCIAL_MEDIA,
        brandProductGroupIdMock
      );

      expect(component.saveButtonDisabled).toEqual(true);
      expect(component.cancelButtonDisabled).toEqual(false);
    });

    it('should set correct state for save and cancel button during multiple user changes', () => {
      const changedCommunicationChannelsMock = [
        {
          id: serviceCommunicationDataMock[0].communicationFieldId,
          format: communicationFieldMock[0].format,
          value: 'newValue'
        }
      ];

      // No changes made yet -> Both buttons disabled
      expect(component.saveButtonDisabled).toEqual(true);
      expect(component.cancelButtonDisabled).toEqual(true);

      component.upsertCommunicationDataOfOutlet(
        { invalid: true, value: changedCommunicationChannelsMock } as CommunicationChannelsChange,
        CommunicationFieldType.STANDARD,
        brandProductGroupIdMock
      );

      // Change to standard communication channels made, but they are invalid -> Save button disabled
      expect(component.saveButtonDisabled).toEqual(true);
      expect(component.cancelButtonDisabled).toEqual(false);

      component.upsertCommunicationDataOfOutlet(
        { invalid: false, value: changedCommunicationChannelsMock } as CommunicationChannelsChange,
        CommunicationFieldType.SOCIAL_MEDIA,
        brandProductGroupIdMock
      );

      // Change to social media communication channels made, but standard communication channels are still invalid
      // -> Save button still disabled
      expect(component.saveButtonDisabled).toEqual(true);
      expect(component.cancelButtonDisabled).toEqual(false);

      component.upsertCommunicationDataOfOutlet(
        { invalid: false, value: changedCommunicationChannelsMock } as CommunicationChannelsChange,
        CommunicationFieldType.STANDARD,
        brandProductGroupIdMock
      );

      // Changes to standard communication channels corrected -> Save button enabled
      expect(component.saveButtonDisabled).toEqual(false);
      expect(component.cancelButtonDisabled).toEqual(false);
    });
  });

 describe('mergeCommunicationDataOfOutlet', () => {
  it('should remove communication data matching current query params', () => {
    (component as any).communicationDataOfOutlet = [
      { offeredServiceId: 'OFFERED1', communicationFieldId: 'TEL', value: '111' }, 
      { offeredServiceId: 'OFFERED2', communicationFieldId: 'TEL', value: '222' }  
    ];
    
    component['offeredServices'] = [
      { id: 'OFFERED1', serviceId: 1, serviceCharacteristicId: 1, productCategoryId: 1, brandId: 'BRAND1', productGroupId: 'PG1' },
      { id: 'OFFERED2', serviceId: 2, serviceCharacteristicId: 2, productCategoryId: 2, brandId: 'BRAND2', productGroupId: 'PG2' }
    ];
    (component as any).currentQueryParams = {
      serviceId: 1,
      serviceCharacteristicId: 1,
      productCategoryId: 1
    };
    
    // @ts-ignore: test private method
    component.removeCommunicationDataOfCurrentPage();
    
    expect(component['communicationDataOfOutlet']).toEqual([
      { offeredServiceId: 'OFFERED2', communicationFieldId: 'TEL', value: '222' }
    ]);
  });

  it('should not remove any data if no match', () => {
    // @ts-ignore: allow access to private property for testing
    (component as any).communicationDataOfOutlet = [
      { offeredServiceId: 'OFFERED2', communicationFieldId: 'TEL', value: '222' }
    ];
    (component as any).currentQueryParams = {
      serviceId: 1,
      serviceCharacteristicId: 1,
      productCategoryId: 1
    };

    // @ts-ignore: test private method
    component.removeCommunicationDataOfCurrentPage();
    
    expect((component as any)['communicationDataOfOutlet']).toEqual([
      { offeredServiceId: 'OFFERED2', communicationFieldId: 'TEL', value: '222' }
      ]);
    });    
  });

  describe('save', () => {
    beforeEach(() => {
      jest.spyOn(communicationServiceSpy, 'updateServiceCommunicationData').mockReturnValue(of({}));
    });

    it('should save communication data', () => {
      component.save();

      expect(communicationServiceSpy.updateServiceCommunicationData).toHaveBeenCalledWith(
        [
          serviceCommunicationDataMock[0],
          serviceCommunicationDataMock[1],
          serviceCommunicationDataMock[2]
        ],
        undefined
      );
    });

    it('should save communication data with taskData', () => {
      const taskData = { dueDate: '', comment: 'test' };

      component.save({
        taskId: 1,
        payload: taskData
      });
      const expectedMock1 = {
        ...serviceCommunicationDataMock[0],
        taskData
      };
      const expectedMock2 = {
        ...serviceCommunicationDataMock[1],
        taskData
      };
      const expectedMock3 = {
        ...serviceCommunicationDataMock[2],
        taskData
      };

      expect(communicationServiceSpy.updateServiceCommunicationData).toHaveBeenCalledWith(
        [expectedMock1, expectedMock2, expectedMock3],
        undefined
      );
    });

    it('should set correct state for save and cancel buttons', () => {
      component.saveButtonDisabled = false;
      component.cancelButtonDisabled = false;
      component.save();

      expect(component.saveButtonDisabled).toEqual(true);
      expect(component.cancelButtonDisabled).toEqual(true);
    });
  });

  describe('reset', () => {
    it('should reset brand product groups data table', done => {
      component.brandProductGroupsCommunicationData.subscribe(
        brandProductGroupsCommunicationData => {
          expect(component.tableEnabled).toBeTruthy();
          done();
        }
      );
      component.reset();
    });

    it('should set correct state for save and cancel buttons', () => {
      component.saveButtonDisabled = false;
      component.cancelButtonDisabled = false;
      component.reset();

      expect(component.saveButtonDisabled).toEqual(true);
      expect(component.cancelButtonDisabled).toEqual(true);
    });
  });

  describe('isUserPermittedFor', () => {
    it('should return true if brand and product group permissions exist', done => {
      userAuthorizationServiceSpy.verify.nextWith(true);
      const brandProductGroup: BrandProductGroupId[] = [{ brandId: 'MB', productGroupId: 'PC' }];

      component.isUserPermittedFor(brandProductGroup).subscribe(result => {
        expect(result).toEqual(true);
        done();
      });
    });
  });

  describe('canDeactivate', () => {
    it('should return true if save and cancel buttons are disabled', () => {
      component.saveButtonDisabled = true;
      component.cancelButtonDisabled = true;

      const canDeactivate = component.canDeactivate();
      expect(canDeactivate).toBeTruthy();
    });

    it('should return false if save and cancel buttons are enabled', () => {
      component.saveButtonDisabled = false;
      component.cancelButtonDisabled = false;

      const canDeactivate = component.canDeactivate();
      expect(canDeactivate).toBeFalsy();
    });
  });

  describe('should handle param change', () => {
    it('should re-init data on query params change', () => {
      const spy = jest.spyOn(component, 'initData');

      activatedRouteStub.queryParams.next({
        productCategoryId: offeredServiceMock[0].productCategoryId,
        serviceId: offeredServiceMock[0].serviceId + 1
      });

      expect(spy).toHaveBeenCalled();
    });

    it('should re-init data on outlet ID change', () => {
      const spy = jest.spyOn(component, 'initData');

      legalStructureRoutingServiceStub.outletIdChanges.next('GS0000002');

      expect(spy).toHaveBeenCalled();
    });
  });
});
