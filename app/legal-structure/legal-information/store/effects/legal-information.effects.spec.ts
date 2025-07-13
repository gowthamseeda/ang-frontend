import { TestBed, waitForAsync } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { BusinessSiteStoreService } from '../../../businessSite/services/business-site-store.service';
import { getOutletMock } from '../../../shared/models/outlet.mock';
import { Outlet } from '../../../shared/models/outlet.model';
import { getLegalInformationResponse } from '../../model/legal-information-response.mock';
import { LegalInformationApiService } from '../../services/legal-information-api.service';
import { LegalInformationActions, SaveLegalInformationPayload } from '../actions';

import { LegalInformationEffects } from './legal-information.effects';

describe('legal information effect Suite', () => {
  let effects: LegalInformationEffects;
  let actions: Observable<any>;
  let legalStructureStoreService: BusinessSiteStoreService;
  let legalInformationApiService: LegalInformationApiService;
  let snackBarService: SnackBarService;

  const outlet: Outlet = getOutletMock();
  const legalInformationApiGetResponse = getLegalInformationResponse(outlet.companyId, outlet.id);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LegalInformationEffects,
        provideMockActions(() => actions),
        {
          provide: BusinessSiteStoreService,
          useValue: {
            getOutlet: jest.fn()
          }
        },
        {
          provide: LegalInformationApiService,
          useValue: {
            loadLegalInformation: jest.fn(),
            saveLegalInformation: jest.fn()
          }
        },
        {
          provide: SnackBarService,
          useValue: {
            showInfo: jest.fn(),
            showError: jest.fn()
          }
        }
      ]
    });

    effects = TestBed.inject(LegalInformationEffects);
    actions = TestBed.inject(Actions);
    legalStructureStoreService = TestBed.inject(BusinessSiteStoreService);
    legalInformationApiService = TestBed.inject(LegalInformationApiService);
    snackBarService = TestBed.inject(SnackBarService);
  });

  test(
    'should be created',
    waitForAsync(() => {
      expect(effects).toBeTruthy();
    })
  );

  describe('loadLegalInformation action should', () => {
    const triggerAction = LegalInformationActions.loadLegalInformation({
      outletId: outlet.id,
      companyId: outlet.companyId
    });

    test('lead to loadLegalInformationSuccess action if all requests succeed', () => {
      actions = hot('-a', { a: triggerAction });

      const outletServiceResponse = cold('--b', { b: outlet });
      jest.spyOn(legalStructureStoreService, 'getOutlet').mockReturnValue(outletServiceResponse);

      const legalInformationApiResponse = cold('---c|', {
        c: legalInformationApiGetResponse
      });
      jest
        .spyOn(legalInformationApiService, 'loadLegalInformation')
        .mockReturnValue(legalInformationApiResponse);

      const loadLegalInformationSuccessAction = LegalInformationActions.loadLegalInformationSuccess(
        {
          businessSiteId: legalInformationApiGetResponse.businessSiteId,
          businessSiteLegalInfo: { nationalTaxNumber: legalInformationApiGetResponse.taxNo ?? '' },
          companyLegalInfo: {
            companyVatNumber: legalInformationApiGetResponse.vatNo ?? '',
            legalFooter: legalInformationApiGetResponse.legalFooter ?? '',
            legalFooterAdditionalTranslations:
              legalInformationApiGetResponse.legalFooterTranslations ?? {}
          }
        }
      );
      const expected = cold('-----e', { e: loadLegalInformationSuccessAction });

      expect(effects.loadLegalInformation).toBeObservable(expected);
    });

    test('lead to loadLegalInformationFailure action if request fails', () => {
      actions = hot('-a', { a: triggerAction });

      const outletServiceResponse = cold('--b', { b: outlet });
      jest.spyOn(legalStructureStoreService, 'getOutlet').mockReturnValue(outletServiceResponse);
      const error = new Error('error');
      const legalInformationApiResponse = cold(' -#|', {}, error);
      jest
        .spyOn(legalInformationApiService, 'loadLegalInformation')
        .mockReturnValue(legalInformationApiResponse);

      const loadLegalInformationFailureAction = LegalInformationActions.loadLegalInformationFailure(
        {
          error: error
        }
      );
      const expected = cold('--e', { e: loadLegalInformationFailureAction });

      expect(effects.loadLegalInformation).toBeObservable(expected);
    });
  });

  describe('saveLegalInformation action should', () => {
    const legalInfo: SaveLegalInformationPayload = {
      correlationId: 1,
      businessSiteId: legalInformationApiGetResponse.businessSiteId,
      companyId: legalInformationApiGetResponse.companyId,
      companyVatNumber: legalInformationApiGetResponse.vatNo
        ? legalInformationApiGetResponse.vatNo
        : '',
      nationalTaxNumber: legalInformationApiGetResponse.taxNo
        ? legalInformationApiGetResponse.taxNo
        : '',
      legalFooter: legalInformationApiGetResponse.legalFooter
        ? legalInformationApiGetResponse.legalFooter
        : '',
      legalFooterAdditionalTranslations: legalInformationApiGetResponse.legalFooterTranslations
        ? legalInformationApiGetResponse.legalFooterTranslations
        : {}
    };

    const triggerAction = LegalInformationActions.saveLegalInformation(legalInfo);

    test('lead to saveLegalInformationSuccess action if save succeeds', () => {
      actions = hot('-a', { a: triggerAction });

      const legalInformationApiResponse = cold('--b|', {
        b: { id: legalInformationApiGetResponse.businessSiteId }
      });
      jest
        .spyOn(legalInformationApiService, 'saveLegalInformation')
        .mockReturnValue(legalInformationApiResponse);

      const saveSuccessAction = LegalInformationActions.saveLegalInformationSuccess({
        businessSiteId: legalInformationApiGetResponse.businessSiteId,
        correlationId: 1,
        companyId: legalInformationApiGetResponse.companyId
      });
      const expected = cold('----c', { c: saveSuccessAction });

      expect(effects.saveLegalInformation).toBeObservable(expected);
      expect(snackBarService).toBeTruthy();
    });

    test('lead to saveLegalInformationFailure action if save fails', () => {
      actions = hot('-a', { a: triggerAction });

      const error = new Error('error');
      const legalInformationApiResponse = cold('--#', {}, error);
      jest
        .spyOn(legalInformationApiService, 'saveLegalInformation')
        .mockReturnValue(legalInformationApiResponse);

      const saveFailureAction = LegalInformationActions.saveLegalInformationFailure({
        error: error
      });
      const expected = cold('---(b|)', { b: saveFailureAction });

      expect(effects.saveLegalInformation).toBeObservable(expected);
    });
  });
});
