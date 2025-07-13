import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideAutoSpy, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { BusinessSiteStoreService } from '../../businessSite/services/business-site-store.service';
import { getOutletMock } from '../../shared/models/outlet.mock';
import * as fromLegalStructure from '../../store';

import { LegalInformationActions } from './actions';
import { LegalInformationStoreGuard } from './legal-information-store.guard';

const outlet = getOutletMock();

describe('legal information store guard suite', () => {
  let guard: LegalInformationStoreGuard;
  let store: MockStore<fromLegalStructure.State>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let businessSiteStoreServiceSpy: Spy<BusinessSiteStoreService>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        LegalInformationStoreGuard,
        provideMockStore(),
        provideAutoSpy(UserAuthorizationService, {
          gettersToSpyOn: ['isAuthorizedFor']
        }),
        provideAutoSpy(BusinessSiteStoreService)
      ]
    });

    guard = TestBed.inject(LegalInformationStoreGuard);
    store = TestBed.inject(MockStore);
    userAuthorizationServiceSpy = TestBed.inject<any>(UserAuthorizationService);
    businessSiteStoreServiceSpy = TestBed.inject<any>(BusinessSiteStoreService);

    userAuthorizationServiceSpy.accessorSpies.getters.isAuthorizedFor.mockReturnThis();
    userAuthorizationServiceSpy.permissions.mockReturnThis();
    userAuthorizationServiceSpy.country.mockReturnThis();

    businessSiteStoreServiceSpy.getOutlet.mockReturnValue(of(outlet));
  });

  describe('canActivate', () => {
    test('dispatches only loadLegalInformation action if user is not authorized', done => {
      userAuthorizationServiceSpy.verify.mockReturnValue(of(false));
      const expected = LegalInformationActions.loadLegalInformation({
        outletId: outlet.id,
        companyId: outlet.companyId
      });
      const spy = jest.spyOn(store, 'dispatch');
      store.refreshState();
      guard.dispatchAction(outlet.id).subscribe(() => {
        done();
      });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(expected);
    });

    test('dispatches actions loadLegalInformation and loadContractStatus if user is authorized', done => {
      userAuthorizationServiceSpy.verify.mockReturnValue(of(true));
      const expectedLegalInfo = LegalInformationActions.loadLegalInformation({
        outletId: outlet.id,
        companyId: outlet.companyId
      });
      const expectedContractStatus = LegalInformationActions.loadLegalInformation({
        outletId: outlet.id,
        companyId: outlet.companyId
      });
      const spy = jest.spyOn(store, 'dispatch');
      store.refreshState();
      guard.dispatchAction(outlet.id).subscribe(() => {
        done();
      });
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(expectedLegalInfo);
      expect(spy).toHaveBeenCalledWith(expectedContractStatus);
    });
  });
});
