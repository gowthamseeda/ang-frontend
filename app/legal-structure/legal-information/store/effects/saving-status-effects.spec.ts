import { TestBed, waitForAsync } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { TypedAction } from '@ngrx/store/src/models';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { ContractStatusApiService } from '../../../../traits/contract-status/contract-status-api.service';
import { ContractStatusActions, LegalInformationActions } from '../actions';

import { LegalInformationSavingStatusEffects } from './saving-status-effects';

describe('saving status effect suite', () => {
  let effects: LegalInformationSavingStatusEffects;
  let actions: Observable<any>;
  let saveLegalInfoAction: TypedAction<any>;
  let saveLegalInfoSuccessAction: TypedAction<any>;
  let saveContractSuccessAction: TypedAction<any>;
  let loadLegalInfoAction: TypedAction<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LegalInformationSavingStatusEffects,
        provideMockActions(() => actions),
        {
          provide: ContractStatusApiService,
          useValue: {
            loadContractStatus: jest.fn(),
            addContractStatus: jest.fn(),
            updateContractStatus: jest.fn(),
            removeContractStatus: jest.fn()
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

    effects = TestBed.inject(LegalInformationSavingStatusEffects);
    actions = TestBed.inject(Actions);

    saveLegalInfoAction = LegalInformationActions.saveLegalInformation({
      correlationId: 1,
      businessSiteId: '123',
      companyId: '345',
      companyVatNumber: '678',
      nationalTaxNumber: '890',
      legalFooter: 'Footer here',
      legalFooterAdditionalTranslations: {}
    });

    saveLegalInfoSuccessAction = LegalInformationActions.saveLegalInformationSuccess({
      businessSiteId: '123',
      correlationId: 1,
      companyId: '345'
    });

    saveContractSuccessAction = ContractStatusActions.saveContractStatusSuccess({
      correlationId: 1
    });
    loadLegalInfoAction = LegalInformationActions.loadLegalInformation({
      outletId: '123',
      companyId: '345'
    });
  });

  test(
    'should be created',
    waitForAsync(() => {
      expect(effects).toBeTruthy();
    })
  );

  describe('saveSuccessBoth should', () => {
    test('return loadLegalInfoAction if both legal information and contract status were saved.', () => {
      actions = hot('-a-(bc)', {
        a: saveLegalInfoAction,
        b: saveLegalInfoSuccessAction,
        c: saveContractSuccessAction
      });

      const expected = cold('---d', { d: loadLegalInfoAction });
      expect(effects.saveSuccessBoth).toBeObservable(expected);
    });
  });

  describe('saveSuccessLegalInfoOnly should', () => {
    test('return loadLegalInfoAction if only legal information was saved.', () => {
      actions = hot('-a', { a: { ...saveLegalInfoSuccessAction, correlationId: -1 } });
      const expected = cold('-b', { b: loadLegalInfoAction });
      expect(effects.saveSuccessLegalInfoOnly).toBeObservable(expected);
    });
  });
});
