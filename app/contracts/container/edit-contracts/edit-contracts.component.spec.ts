import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateService } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { BehaviorSubject, of } from 'rxjs';

import { appConfigMock } from '../../../app-config.mock';
import { AppConfigProvider } from '../../../app-config.service';
import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { UserService } from '../../../iam/user/user.service';
import { LegalStructureRoutingService } from '../../../legal-structure/legal-structure-routing.service';
import { getOutletMock } from '../../../legal-structure/shared/models/outlet.mock';
import { OutletService } from '../../../legal-structure/shared/services/outlet.service';
import { ServiceMock } from '../../../services/service/models/service.mock';
import { ServiceService } from '../../../services/service/services/service.service';
import { BrandProductGroupsData } from '../../../services/shared/components/brand-product-groups-data-table/brand-product-groups-data-table.component';
import { TranslateDataPipe } from '../../../shared/pipes/translate-data/translate-data.pipe';
import { TranslatePipeMock } from '../../../testing/pipe-mocks/translate';
import { DistributionLevelsService } from '../../../traits/distribution-levels/distribution-levels.service';
import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import { ContractsService } from '../../contracts.service';
import { Address } from '../../model/address.model';
import { brandProductGroupIdMock } from '../../model/brand-product-group-id.mock';
import { BrandProductGroupId } from '../../model/brand-product-group-id.model';
import { BusinessSite } from '../../model/business-site.model';
import { contractMock } from '../../model/contract.mock';
import { offeredServiceMock } from '../../model/offered-service.mock';

import { EditContractsComponent } from './edit-contracts.component';

const outlet = getOutletMock();
const serviceEntities = ServiceMock.asList();
const offeredServicesMock = offeredServiceMock;
const appConfig = appConfigMock;

offeredServicesMock[0].validity = {
  application: true,
  valid: false
};

class ActivatedRouteStub {
  queryParams = of({
    productCategoryId: offeredServicesMock[0].productCategoryId,
    serviceId: offeredServicesMock[0].serviceId
  });

  params = of({
    id: outlet.id
  });
}

class LegalStructureRoutingServiceStub {
  outletIdChanges = new BehaviorSubject<string>('GS1');
}

describe('EditContractsComponent', () => {
  let component: EditContractsComponent;
  let fixture: ComponentFixture<EditContractsComponent>;
  let translateServiceSpy: Spy<TranslateService>;
  let userServiceSpy: Spy<UserService>;
  let outletServiceSpy: Spy<OutletService>;
  let distributionLevelServiceSpy: Spy<DistributionLevelsService>;
  let contractsServiceSpy: Spy<ContractsService>;
  let routerSpy: Spy<Router>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  const legalStructureRoutingServiceStub = new LegalStructureRoutingServiceStub();
  let userSettingsServiceSpy: Spy<UserSettingsService>;
  let serviceServiceSpy: Spy<ServiceService>;
  let appConfigProviderSpy: Spy<AppConfigProvider>;

  beforeEach(() => {
    userServiceSpy = createSpyFromClass(UserService);
    userServiceSpy.getCountryRestrictions.nextWith(['DE']);
    userSettingsServiceSpy = createSpyFromClass(UserSettingsService);
    userSettingsServiceSpy.getLanguageId.nextWith('en');
    serviceServiceSpy = createSpyFromClass(ServiceService);
    serviceServiceSpy.fetchBy.mockReturnValue(of(serviceEntities[0]));
    serviceServiceSpy.selectBy.mockReturnValue(of(serviceEntities[0]));

    contractsServiceSpy = createSpyFromClass(ContractsService);
    contractsServiceSpy.getContractsOfContractor.nextWith([contractMock[0], contractMock[1]]);
    contractsServiceSpy.getContractor.nextWith(contractMock[0].contractor);
    contractsServiceSpy.getOfferedServicesOfContractor.nextWith(offeredServicesMock);

    distributionLevelServiceSpy = createSpyFromClass(DistributionLevelsService);
    distributionLevelServiceSpy.getDistributionLevelsOfOutlet.nextWith([]);

    outletServiceSpy = createSpyFromClass(OutletService);
    outletServiceSpy.getOrLoadBusinessSite.nextWith(outlet);

    translateServiceSpy = createSpyFromClass(TranslateService);
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.brand.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.productGroup.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.verify.nextWith(true);
    routerSpy = createSpyFromClass(Router);

    appConfigProviderSpy = createSpyFromClass(AppConfigProvider);
    appConfigProviderSpy.getAppConfig.mockReturnValue(appConfig);

    TestBed.resetTestingModule();

    TestBed.overrideComponent(EditContractsComponent, {
      set: {
        providers: [{ provide: ContractsService, useValue: contractsServiceSpy }]
      }
    });

    TestBed.configureTestingModule({
      declarations: [EditContractsComponent, TranslatePipeMock, TranslateDataPipe],
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: UserSettingsService, useValue: userSettingsServiceSpy },
        { provide: ServiceService, useValue: serviceServiceSpy },
        { provide: OutletService, useValue: outletServiceSpy },
        { provide: DistributionLevelsService, useValue: distributionLevelServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        {
          provide: UserAuthorizationService,
          useValue: {
            isAuthorizedFor: userAuthorizationServiceSpy
          }
        },
        { provide: LegalStructureRoutingService, useValue: legalStructureRoutingServiceStub },
        {
          provide: AppConfigProvider,
          useValue: appConfigProviderSpy
        },
        provideMockStore()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should init country restrictions', done => {
      component.countryRestrictions.subscribe(countryRestrictions => {
        expect(countryRestrictions).toEqual(['DE']);
        done();
      });
    });

    it('should init contractor', () => {
      expect(component.contractor.id).toEqual(contractMock[0].contractor.id);
    });

    it('should init contractees', done => {
      const expected = [
        {
          data: contractMock[0].contractee,
          brandProductGroupIds: [brandProductGroupIdMock[0]]
        }
      ];

      component.contractees.subscribe(contractees => {
        expect(contractees).toEqual(expected);
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
        }
      ];

      component.brandProductGroupValidities.subscribe(brandProductGroupValidities => {
        expect(brandProductGroupValidities).toEqual(expected);
        done();
      });
    });
  });

  describe('mergeContracts', () => {
    const anyBrandProductGroupId = { brandId: 'MB', productGroupId: 'TRUCK' };

    it('should upsert and delete contracts', () => {
      const changedContracts: BrandProductGroupsData<BusinessSite & Address>[] = [
        { data: contractMock[0].contractee, brandProductGroupIds: [anyBrandProductGroupId] },
        { data: contractMock[1].contractee, brandProductGroupIds: [] }
      ];
      component.mergeContracts(changedContracts);
      expect(contractsServiceSpy.upsertContracts).toHaveBeenCalled();
      expect(contractsServiceSpy.deleteContracts).toHaveBeenCalled();
    });

    it('should upsert contracts only', () => {
      const changedContracts: BrandProductGroupsData<BusinessSite & Address>[] = [
        { data: contractMock[0].contractee, brandProductGroupIds: [anyBrandProductGroupId] },
        { data: contractMock[1].contractee, brandProductGroupIds: [anyBrandProductGroupId] }
      ];
      component.mergeContracts(changedContracts);
      expect(contractsServiceSpy.deleteContracts).not.toHaveBeenCalled();
      expect(contractsServiceSpy.upsertContracts).toHaveBeenCalledTimes(2);
    });

    it('should delete contracts only', () => {
      const changedContracts: BrandProductGroupsData<BusinessSite & Address>[] = [
        { data: contractMock[0].contractee, brandProductGroupIds: [] },
        { data: undefined, brandProductGroupIds: [anyBrandProductGroupId] }
      ];
      component.mergeContracts(changedContracts);
      expect(contractsServiceSpy.upsertContracts).not.toHaveBeenCalled();
      expect(contractsServiceSpy.deleteContracts).toHaveBeenCalledTimes(2);
    });
  });

  describe('save', () => {
    it('should save contracts of contractor', () => {
      component.save();
      expect(contractsServiceSpy.saveContracts).toHaveBeenCalledWith(contractMock[0].contractor.id);
    });
  });

  describe('deleteContractPartner', () => {
    it('should delete a contract partner', () => {
      const brandProductGroupIds = [{ brandId: 'MB', productGroupId: 'PC' }];
      component.deleteContractPartner(brandProductGroupIds);

      expect(contractsServiceSpy.deleteContracts).toHaveBeenCalled();
    });
  });

  describe('navigateToContractPartnerOutlet', () => {
    it('should navigate to a contract partner outlet', () => {
      const windowSpy = spyOn(window, 'open');
      const url = `app/outlet/${outlet.id}`;
      component.navigateToContractPartnerOutlet(outlet.id);
      expect(windowSpy).toHaveBeenCalledWith(expect.stringContaining(url), '_blank');
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

  describe('isUserPermittedFor', () => {
    it('should return true if brand and product group permissions exist', done => {
      const brandProductGroup: BrandProductGroupId[] = [{ brandId: 'MB', productGroupId: 'PC' }];

      component.isUserPermittedFor(brandProductGroup).subscribe(result => {
        expect(result).toEqual(true);
        done();
      });
    });

    it('should return false if one of two permissions do not exist', done => {
      userAuthorizationServiceSpy.verify.nextWith(false);

      const brandProductGroup: BrandProductGroupId[] = [{ brandId: 'MB', productGroupId: 'PC' }];

      component.isUserPermittedFor(brandProductGroup).subscribe(result => {
        expect(result).toEqual(false);
        done();
      });
    });
  });

  describe('getContextId', () => {
    it('should return the contextId', () => {
      const rowIndex = 0;
      const contextId = component.getContextId(rowIndex);
      const expectedId = 'ContractPartner-' + offeredServicesMock[0].serviceId + rowIndex;

      expect(contextId).toBe(expectedId);
    });
  });
});
