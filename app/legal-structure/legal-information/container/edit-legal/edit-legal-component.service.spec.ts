import { TestBed } from '@angular/core/testing';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideAutoSpy, Spy } from 'jest-auto-spies';
import { cold } from 'jest-marbles';
import { of } from 'rxjs';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { BrandService } from '../../../../services/brand/brand.service';
import { ProductGroupService } from '../../../../services/product-group/product-group.service';
import { BusinessSiteStoreService } from '../../../businessSite/services/business-site-store.service';
import { getOutletMock } from '../../../shared/models/outlet.mock';
import * as fromLegalStructure from '../../../store';
import { LegalInformation } from '../../model/legal-information.model';
import * as fromLegalInformation from '../../store/reducers';
import { selectLegalInformation } from '../../store/selectors';
import { getLegalInformationState_fully_initialized } from '../../store/state.mock';
import { LegalInformationState } from '../../store/state.model';

import { EditLegalComponentService } from './edit-legal-component.service';

describe('edit legal component service test suite', () => {
  let store: MockStore<fromLegalStructure.State>;
  let legalInformationService: EditLegalComponentService;
  let legalInformationSelector: MemoizedSelector<fromLegalStructure.State, LegalInformationState>;
  let outletStoreService: Spy<BusinessSiteStoreService>;
  let brandService: Spy<BrandService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;

  const productGroupServiceStub = {
    getAll: () => of([])
  };
  const outlet = getOutletMock();
  const legalInformationState = getLegalInformationState_fully_initialized();

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: ProductGroupService, useValue: productGroupServiceStub },
        EditLegalComponentService,
        provideMockStore(),
        provideAutoSpy(UserAuthorizationService),
        provideAutoSpy(BusinessSiteStoreService),
        provideAutoSpy(BrandService)
      ]
    });

    userAuthorizationServiceSpy = TestBed.inject<any>(UserAuthorizationService);
    userAuthorizationServiceSpy.verify.nextWith(true);

    store = TestBed.inject(MockStore);
    legalInformationService = TestBed.inject(EditLegalComponentService);
    legalInformationSelector = store.overrideSelector(
      selectLegalInformation,
      fromLegalInformation.initialState
    );
    outletStoreService = TestBed.inject<any>(BusinessSiteStoreService);
    brandService = TestBed.inject<any>(BrandService);
  });

  test('initializes successful', () => {
    expect(legalInformationService).toBeTruthy();
  });

  describe('getLegalInformation should', () => {
    const additionalTranslations = legalInformationState.companyLegalInfo
      ? new Map(
          Object.entries(legalInformationState.companyLegalInfo?.legalFooterAdditionalTranslations)
        )
      : new Map();
    const outletLegalInformationResult: LegalInformation = {
      company: {
        id: outlet.companyId,
        vatNumber: legalInformationState.companyLegalInfo?.companyVatNumber ?? '',
        legalFooter: {
          text: legalInformationState.companyLegalInfo?.legalFooter ?? '',
          additionalTranslations: additionalTranslations
        }
      },
      businessSite: {
        id: outlet.id,
        registeredOffice: outlet.registeredOffice ?? false,
        hasRequiredDistributionLevel: true,
        nationalTaxNumber: legalInformationState.businessSiteLegalInfo?.nationalTaxNumber ?? '',
        countryId: outlet.countryId,
        defaultLanguageId: outlet.defaultLanguageId ?? 'de-DE'
      },
      legalContracts: legalInformationState.contracts.map(contract => ({
        id: contract.id,
        brandId: contract.brandId,
        companyRelationId: contract.companyRelationId,
        required: contract.required,
        languageId: contract.languageId,
        contractState: contract.contractState ?? '',
        corporateDisclosure: contract.corporateDisclosure ?? '',
        status: contract.status
      })),
      viewStatus: legalInformationState.savingStatus.contentStatus
    };

    test('return legal information from state merged with outlet from outlet store', () => {
      legalInformationSelector.setResult(legalInformationState);
      store.refreshState();
      outletStoreService.getOutlet.nextWith(outlet);
      outletStoreService.getDistributionLevels.nextWith(['RETAILER', 'APPLICANT']);
      brandService.getAllForUserDataRestrictions.nextWith([{ id: 'MB', name: 'Mercedes-Benz' }]);

      const expected = cold('a', { a: outletLegalInformationResult });
      expect(legalInformationService.getLegalInformation()).toBeObservable(expected);
    });

    test('hasRequiredDistributionLevel should be false if outlet has not the required distribution level ', () => {
      legalInformationSelector.setResult(legalInformationState);
      store.refreshState();

      outletStoreService.getOutlet.nextWith(outlet);
      outletStoreService.getDistributionLevels.nextWith(['WHOLESALER']);
      brandService.getAllForUserDataRestrictions.nextWith([{ id: 'MB', name: 'Mercedes-Benz' }]);

      const expected = cold('a', {
        a: {
          ...outletLegalInformationResult,
          businessSite: {
            ...outletLegalInformationResult.businessSite,
            hasRequiredDistributionLevel: false
          }
        }
      });
      expect(legalInformationService.getLegalInformation()).toBeObservable(expected);
    });
  });
});
