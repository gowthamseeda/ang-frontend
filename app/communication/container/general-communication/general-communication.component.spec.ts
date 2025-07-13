import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createSpyFromClass, provideAutoSpy, Spy } from 'jest-auto-spies';
import { BehaviorSubject, of } from 'rxjs';

import { appConfigMock } from '../../../app-config.mock';
import { AppConfigProvider } from '../../../app-config.service';
import { brandProductGroupIdMock } from '../../../contracts/model/brand-product-group-id.mock';
import { LanguageService } from '../../../geography/language/language.service';
import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { LegalStructureRoutingService } from '../../../legal-structure/legal-structure-routing.service';
import { getOutletFormMock } from '../../../legal-structure/outlet/edit-outlet/edit-outlet.component.spec';
import { OutletService } from '../../../legal-structure/shared/services/outlet.service';
import { BrandProductGroupsData } from '../../../services/shared/components/brand-product-groups-data-table/brand-product-groups-data-table.component';
import { ProgressBarService } from '../../../shared/services/progress-bar/progress-bar.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { BusinessSiteTaskService } from '../../../tasks/shared/business-site-task.service';
import { DistributionLevelsService } from '../../../traits/distribution-levels/distribution-levels.service';
import { getBrandCodeResourceMock } from '../../../traits/shared/brand-code/brand-code.mock';
import { BrandCodeService } from '../../../traits/shared/brand-code/brand-code.service';
import { CommunicationService } from '../../communication.service';
import { CommunicationChannelsChange } from '../../model/communication-channel.model';
import { generalCommunicationDataMock } from '../../model/communication-data.mock';
import { CommunicationData, GeneralCommunicationData } from '../../model/communication-data.model';
import { CommunicationFieldType } from '../../model/communication-field-type';
import { communicationFieldMock } from '../../model/communication-field.mock';
import { offeredServiceMock } from '../../model/offered-service.mock';
import { SocialMediaChannelsPipe } from '../../pipe/social-media-channels/social-media-channels.pipe';
import { StandardCommunicationChannelsPipe } from '../../pipe/standard-communication-channels/standard-communication-channels.pipe';
import { SpokenLanguageStubComponent } from '../spoken-language/spoken-language.component.spec';

import { GeneralCommunicationComponent } from './general-communication.component';
import { TaskMock } from '../../../tasks/task.mock';

class ActivatedRouteStub {
  queryParams = of({
    productCategoryId: offeredServiceMock[0].productCategoryId,
    serviceId: offeredServiceMock[0].serviceId
  });
}

class LegalStructureRoutingServiceStub {
  outletIdChanges = new BehaviorSubject<string>('GS1');
}

class CommunicationServiceStub {
  generalCommunicationDataOfOutlet = [
    generalCommunicationDataMock[0],
    generalCommunicationDataMock[1],
    generalCommunicationDataMock[2]
  ];
  getGeneralCommunicationDataOfOutlet = () => of(this.generalCommunicationDataOfOutlet);
  getCommunicationFields = () =>
    of([communicationFieldMock[0], communicationFieldMock[1], communicationFieldMock[2]]);
  getSpokenLanguageIdsOfOutlet = () => of(['de']);

  updateGeneralCommunicationData() {}

  updateSpokenLanguageIdsOfOutlet() {}
}

const appConfig = appConfigMock;

describe('GeneralCommunicationComponent', () => {
  let component: GeneralCommunicationComponent;
  let fixture: ComponentFixture<GeneralCommunicationComponent>;
  const communicationServiceStub = new CommunicationServiceStub();
  const legalStructureRoutingServiceStub = new LegalStructureRoutingServiceStub();
  let outletServiceSpy: Spy<OutletService>;
  let distributionLevelServiceSpy: Spy<DistributionLevelsService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let brandCodeServiceSpy: Spy<BrandCodeService>;
  let businessSiteTaskServiceSpy: Spy<BusinessSiteTaskService>;
  let languageServiceSpy: Spy<LanguageService>;
  let appConfigProviderSpy: Spy<AppConfigProvider>;
  const brandCodesMock = getBrandCodeResourceMock();

  beforeEach(async () => {
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.brand.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.productGroup.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.businessSite.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.country.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.distributionLevels.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.verify.nextWith(false);

    appConfigProviderSpy = createSpyFromClass(AppConfigProvider);
    appConfigProviderSpy.getAppConfig.mockReturnValue(appConfig);

    await TestBed.configureTestingModule({
      declarations: [
        GeneralCommunicationComponent,
        SpokenLanguageStubComponent,
        SocialMediaChannelsPipe,
        StandardCommunicationChannelsPipe
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
        provideAutoSpy(SnackBarService),
        provideAutoSpy(BusinessSiteTaskService),
        provideAutoSpy(OutletService),
        provideAutoSpy(DistributionLevelsService),
        provideAutoSpy(BrandCodeService),
        provideAutoSpy(SnackBarService),
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: CommunicationService, useValue: communicationServiceStub },
        { provide: LegalStructureRoutingService, useValue: legalStructureRoutingServiceStub },
        {
          provide: UserAuthorizationService,
          useValue: {
            isAuthorizedFor: userAuthorizationServiceSpy
          }
        },
        {
          provide: AppConfigProvider,
          useValue: appConfigProviderSpy
        },
        provideAutoSpy(LanguageService)
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    outletServiceSpy = TestBed.inject<any>(OutletService);
    outletServiceSpy.getOrLoadBusinessSite.nextWith(getOutletFormMock().value);
    distributionLevelServiceSpy = TestBed.inject<any>(DistributionLevelsService);
    distributionLevelServiceSpy.getDistributionLevelsOfOutlet.nextWith([]);
    brandCodeServiceSpy = TestBed.inject<any>(BrandCodeService);
    brandCodeServiceSpy.getBrandCodesOfOutlet.nextWith([brandCodesMock[0]]);
    businessSiteTaskServiceSpy = TestBed.inject<any>(BusinessSiteTaskService);
    businessSiteTaskServiceSpy.existsOpenDataChangeFor.nextWith(false);
    businessSiteTaskServiceSpy.existsOpenVerificationTaskFor.nextWith(false);
    languageServiceSpy = TestBed.inject<any>(LanguageService);
    languageServiceSpy.getTwoLetterLanguages.nextWith([]);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralCommunicationComponent);
    component = fixture.componentInstance;
    component.saveButtonDisabled = true;
    component.cancelButtonDisabled = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize groupedBrandProductGroups from brand codes', done => {
      const expected = {
        MB: [{ brandId: 'MB', productGroupId: 'PRODUCTGROUPLESS' }],
        BRANDLESS: [{ brandId: 'BRANDLESS', productGroupId: 'PRODUCTGROUPLESS' }]
      };
      component.groupedBrandProductGroups.subscribe(groupedBrandProductGroups => {
        expect(groupedBrandProductGroups).toEqual(expected);
        done();
      });
    });

    it('should initialize general communication data rows', done => {
      const expected = [
        {
          brandProductGroupIds: [{ brandId: 'MB', productGroupId: 'PRODUCTGROUPLESS' }],
          data: [generalCommunicationDataMock[0], generalCommunicationDataMock[1]]
        },
        {
          brandProductGroupIds: [{ brandId: 'BRANDLESS', productGroupId: 'PRODUCTGROUPLESS' }],
          data: [generalCommunicationDataMock[2]]
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

    it('should call tasks API when authorized for business site', done => {
      userAuthorizationServiceSpy.verify.nextWith(true);

      component.isEditable.subscribe(() => {
        expect(businessSiteTaskServiceSpy.existsOpenDataChangeFor).toHaveBeenCalled();
        done();
      });
    });

    it('should not call tasks API when unauthorized for business site', done => {
      component.isEditable.subscribe(() => {
        expect(businessSiteTaskServiceSpy.existsOpenDataChangeFor).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('upsertCommunicationDataOfOutlet', () => {
    it('should change communication data for a valid communication channels change', () => {
      const expected = [
        generalCommunicationDataMock[0],
        generalCommunicationDataMock[1],
        generalCommunicationDataMock[2]
      ];
      expected[0].value = 'newValue';
      expected[1].value = 'newValue';
      const changedCommunicationChannelsMock = [
        {
          id: generalCommunicationDataMock[0].communicationFieldId,
          format: communicationFieldMock[0].format,
          value: 'newValue'
        },
        {
          id: generalCommunicationDataMock[1].communicationFieldId,
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
          id: generalCommunicationDataMock[0].communicationFieldId,
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
          id: generalCommunicationDataMock[0].communicationFieldId,
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
          id: generalCommunicationDataMock[0].communicationFieldId,
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
          id: generalCommunicationDataMock[0].communicationFieldId,
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
    it('should update communication data of outlet', () => {
      const changedCommunicationData = {
        brandId: 'MB',
        communicationFieldId: 'INSTAGRAM',
        value: 'http://instagram.com/GS20000001-1'
      };
      const expected = [
        generalCommunicationDataMock[0],
        generalCommunicationDataMock[1],
        changedCommunicationData
      ];
      const communicationDataRows: BrandProductGroupsData<GeneralCommunicationData[]>[] = [
        {
          data: [
            generalCommunicationDataMock[0],
            generalCommunicationDataMock[1],
            changedCommunicationData
          ],
          brandProductGroupIds: [brandProductGroupIdMock[0]]
        }
      ];

      component.mergeCommunicationDataOfOutlet(communicationDataRows);
      // @ts-ignore private
      const actualCommunicationData = component.communicationDataOfOutlet;

      expect(actualCommunicationData).toEqual(expected);
    });

    it('should remove communication data of outlet', () => {
      const expected = [generalCommunicationDataMock[0], generalCommunicationDataMock[1]];
      const communicationDataRows: BrandProductGroupsData<CommunicationData[]>[] = [
        {
          data: [generalCommunicationDataMock[0], generalCommunicationDataMock[1]],
          brandProductGroupIds: [brandProductGroupIdMock[0]]
        }
      ];

      component.mergeCommunicationDataOfOutlet(communicationDataRows);
      // @ts-ignore private
      const actualCommunicationData = component.communicationDataOfOutlet;

      expect(actualCommunicationData).toEqual(expected);
    });

    it('should add communication data of outlet', () => {
      const expected = [
        generalCommunicationDataMock[0],
        generalCommunicationDataMock[1],
        generalCommunicationDataMock[3]
      ];
      const communicationDataRows: BrandProductGroupsData<GeneralCommunicationData[]>[] = [
        {
          data: [generalCommunicationDataMock[0], generalCommunicationDataMock[1]],
          brandProductGroupIds: [brandProductGroupIdMock[0]]
        },
        {
          data: [generalCommunicationDataMock[3]],
          brandProductGroupIds: [brandProductGroupIdMock[2]]
        }
      ];

      component.mergeCommunicationDataOfOutlet(communicationDataRows);
      // @ts-ignore private
      const actualCommunicationData = component.communicationDataOfOutlet;

      expect(actualCommunicationData).toEqual(expected);
    });

    it('should set correct state for save and cancel buttons', () => {
      const changedCommunicationData = {
        communicationFieldId: 'INSTAGRAM',
        value: 'http://instagram.com/GS20000001-1'
      };

      const communicationDataRows: BrandProductGroupsData<GeneralCommunicationData[]>[] = [
        {
          data: [
            generalCommunicationDataMock[0],
            generalCommunicationDataMock[1],
            changedCommunicationData
          ],
          brandProductGroupIds: [brandProductGroupIdMock[0]]
        }
      ];

      component.mergeCommunicationDataOfOutlet(communicationDataRows);
      expect(component.saveButtonDisabled).toEqual(false);
      expect(component.cancelButtonDisabled).toEqual(false);
    });
  });

  describe('save', () => {
    it('should save communication and spoken language data', () => {
      spyOn(communicationServiceStub, 'updateGeneralCommunicationData').and.returnValue(of({}));
      spyOn(communicationServiceStub, 'updateSpokenLanguageIdsOfOutlet').and.returnValue(of({}));
      spyOn(
        component.spokenLanguageComponent,
        'isUserAuthorizedForSpokenLanguageChange'
      ).and.returnValue(true);
      spyOn(component.spokenLanguageComponent, 'saveObservable');
      component.save();

      expect(communicationServiceStub.updateGeneralCommunicationData).toHaveBeenCalledWith([
        generalCommunicationDataMock[0],
        generalCommunicationDataMock[1],
        generalCommunicationDataMock[2]
      ]);

      expect(component.spokenLanguageComponent.saveObservable).toHaveBeenCalledTimes(1);
    });

    it('should save communication data even if saving spoken language data fails', () => {
      spyOn(communicationServiceStub, 'updateGeneralCommunicationData').and.returnValue(of({}));
      spyOn(
        component.spokenLanguageComponent,
        'isUserAuthorizedForSpokenLanguageChange'
      ).and.returnValue(true);
      /*spyOn(component.spokenLanguageComponent, 'saveObservable').mockReturnValue(
        of(new Error('error'));
      );*/
      spyOn(component.spokenLanguageComponent, 'saveObservable').and.returnValue(
        of({ id: 'ID', status: 'error' })
      );
      component.save();

      expect(communicationServiceStub.updateGeneralCommunicationData).toHaveBeenCalledWith([
        generalCommunicationDataMock[0],
        generalCommunicationDataMock[1],
        generalCommunicationDataMock[2]
      ]);

      expect(component.spokenLanguageComponent.saveObservable).toHaveBeenCalledTimes(1);
    });

    it('should set correct state for save and cancel buttons', () => {
      component.saveButtonDisabled = false;
      component.cancelButtonDisabled = false;
      spyOn(communicationServiceStub, 'updateGeneralCommunicationData').and.returnValue(of({}));
      spyOn(communicationServiceStub, 'updateSpokenLanguageIdsOfOutlet').and.returnValue(of({}));
      component.save();

      expect(component.saveButtonDisabled).toEqual(true);
      expect(component.cancelButtonDisabled).toEqual(true);
    });

    it('should evaluate task is present as true when existsOpenDataChangeFor', done => {
      userAuthorizationServiceSpy.verify.nextWith(true);
      businessSiteTaskServiceSpy.existsOpenDataChangeFor.nextWith(true);
      fixture.detectChanges();
      component.isTaskPresent.subscribe(isTaskPresent => {
        expect(isTaskPresent).toEqual(true);
        done();
      });
    });

    it('should return true when aggregate verification task exists', done => {
      businessSiteTaskServiceSpy.existsOpenVerificationTaskFor.nextWith(false);
      businessSiteTaskServiceSpy.getOpenStatusForDataVerificationTask.nextWith([
        TaskMock.asList()[0]
      ]);
      component.isAllVerificationTaskPresent(of(true)).subscribe(result => {
        expect(result).toEqual(true);
        done();
      });
    });

    it('should return true when data cluster verification task exists', done => {
      businessSiteTaskServiceSpy.existsOpenVerificationTaskFor.nextWith(true);
      businessSiteTaskServiceSpy.getOpenStatusForDataVerificationTask.nextWith([]);
      component.isAllVerificationTaskPresent(of(true)).subscribe(result => {
        expect(result).toEqual(true);
        done();
      });
    });

    it('should return false when all verification task not exists', done => {
      businessSiteTaskServiceSpy.existsOpenVerificationTaskFor.nextWith(false);
      businessSiteTaskServiceSpy.getOpenStatusForDataVerificationTask.nextWith([]);
      component.isAllVerificationTaskPresent(of(true)).subscribe(result => {
        expect(result).toEqual(false);
        done();
      });
    });
  });

  describe('outletNavigationClicked', () => {
    it('should reset brand product groups data table', done => {
      component.brandProductGroupsCommunicationData.subscribe(() => {
        expect(component.tableEnabled).toBeTruthy();
        done();
      });
      component.outletNavigationClicked();
    });

    it('should set correct state for save ,cancel buttons and canDeactivate', () => {
      component.saveButtonDisabled = false;
      component.cancelButtonDisabled = false;
      component.outletNavigationClicked();

      expect(component.saveButtonDisabled).toEqual(true);
      expect(component.cancelButtonDisabled).toEqual(true);
      expect(component.canDeactivate()).toEqual(true);
    });
  });

  describe('reset', () => {
    it('should reset brand product groups data table', done => {
      component.brandProductGroupsCommunicationData.subscribe(() => {
        expect(component.tableEnabled).toBeTruthy();
        done();
      });
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
    test('should evaluate as true if brandId is BRANDLESS', done => {
      const brandPg = [
        {
          brandId: 'BRANDLESS',
          productGroupId: 'PRODUCTGROUPLESS'
        }
      ];
      component.isUserPermittedFor(brandPg).subscribe(isPermitted => {
        expect(isPermitted).toBeTruthy();
        expect(component.tableEnabled).toBeTruthy();
        done();
      });
    });

    test('should evaluate as false if user is not permitted for brand', done => {
      userAuthorizationServiceSpy.verify.nextWith(false);
      const brandPg = [
        {
          brandId: 'MB',
          productGroupId: 'PRODUCTGROUPLESS'
        }
      ];
      component.isUserPermittedFor(brandPg).subscribe(isPermitted => {
        expect(isPermitted).toBeFalsy();
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
});
