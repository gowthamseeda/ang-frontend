import { TestBed, waitForAsync } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideAutoSpy, Spy } from 'jest-auto-spies';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { ContractStatusApiService } from '../../../../traits/contract-status/contract-status-api.service';
import { getContractStatusResponse } from '../../../../traits/contract-status/contract-status-response.mock';
import { getOutletMock } from '../../../shared/models/outlet.mock';
import { Outlet } from '../../../shared/models/outlet.model';
import { getLegalInformationResponse } from '../../model/legal-information-response.mock';
import {
  getLegalContract_MB_NotRequired,
  getLegalContract_MB_Required_De,
  getLegalContract_SMT_Required_De
} from '../../model/legal-information.mock';
import { ContractStatusActions, SaveContractStatusPayload } from '../actions';
import { LegalContractStatus } from '../state.model';

import { ContractStatusEffects } from './contract-status.effects';

describe('contract status effect suite', () => {
  let effects: ContractStatusEffects;
  let actions: Observable<any>;
  let contractStatusApiServiceSpy: Spy<ContractStatusApiService>;

  const outlet: Outlet = getOutletMock();
  const legalInformation = getLegalInformationResponse(outlet.companyId, outlet.id);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContractStatusEffects,
        provideMockActions(() => actions),
        provideAutoSpy(ContractStatusApiService)
      ]
    });

    effects = TestBed.inject(ContractStatusEffects);
    actions = TestBed.inject(Actions);
    contractStatusApiServiceSpy = TestBed.inject<any>(ContractStatusApiService);
  });

  test(
    'should be created',
    waitForAsync(() => {
      expect(effects).toBeTruthy();
    })
  );

  describe('loadContractStatus action should', () => {
    const triggerAction = ContractStatusActions.loadContractStatus({
      outletId: outlet.id,
      companyId: outlet.companyId
    });

    test('lead to loadContractStatusSuccess action if api call succeed', () => {
      actions = hot('-a', { a: triggerAction });

      const contractStatusResponse = getContractStatusResponse();
      const contractStatusApiResponse = cold('---b|', {
        b: contractStatusResponse
      });
      contractStatusApiServiceSpy.loadContractStatus.mockReturnValue(contractStatusApiResponse);

      const loadContractStatusSuccessAction = ContractStatusActions.loadContractStatusSuccess({
        legalContracts: contractStatusResponse.items
          ? contractStatusResponse.items.map((contract, index) => {
              return {
                id: index,
                brandId: contract.brandId,
                companyRelationId: contract.companyRelationId,
                required: contract.required,
                languageId: contract.languageId,
                contractState: contract.status ?? '',
                corporateDisclosure: contract.disclosures ?? '',
                status: LegalContractStatus.DEFAULT
              };
            })
          : []
      });
      const expected = cold('----c', { c: loadContractStatusSuccessAction });

      expect(effects.loadContractStatus).toBeObservable(expected);
    });

    test('lead to loadContractStatusFailure action if api call fails', () => {
      actions = hot('-a', { a: triggerAction });

      const error = new Error('error');
      const contractStatusApiResponse = cold(' -#|', {}, error);
      contractStatusApiServiceSpy.loadContractStatus.mockReturnValue(contractStatusApiResponse);

      const loadContractStatusFailureAction = ContractStatusActions.loadContractStatusFailure({
        error: error
      });
      const expected = cold('--b', { b: loadContractStatusFailureAction });

      expect(effects.loadContractStatus).toBeObservable(expected);
    });
  });

  describe('saveContractStatus action should', () => {
    const contractRemoved = {
      ...getLegalContract_MB_NotRequired(),
      status: LegalContractStatus.REMOVED
    };
    const contractUpdated = {
      ...getLegalContract_MB_Required_De(),
      status: LegalContractStatus.UPDATED
    };
    const contractCreated = {
      ...getLegalContract_SMT_Required_De(),
      status: LegalContractStatus.CREATED
    };
    const legalInfo: SaveContractStatusPayload = {
      correlationId: 2,
      businessSiteId: legalInformation.businessSiteId,
      contractStatus: [contractUpdated, contractRemoved, contractCreated]
    };
    const triggerAction = ContractStatusActions.saveContractStatus(legalInfo);

    test('lead to saveContractStatusSuccess action if save succeeds', () => {
      actions = hot('-a', { a: triggerAction });

      const updateContractStatusApiResponse = cold('--c|', {
        c: { id: contractUpdated.id, status: 'UPDATED' }
      });
      contractStatusApiServiceSpy.updateContractStatus.mockReturnValue(
        updateContractStatusApiResponse
      );

      const saveContractStatusSuccess = ContractStatusActions.saveContractStatusSuccess({
        correlationId: 2
      });
      const expected = cold('----(e)', { e: saveContractStatusSuccess });

      expect(effects.saveContractStatus).toBeObservable(expected);
    });

    test('lead to saveContractStatusFailure action if save fails', () => {
      actions = hot('-a', { a: triggerAction });
      const error = new Error('error');

      const updateContractStatusApiResponse = cold('--#', {}, error);
      contractStatusApiServiceSpy.updateContractStatus.mockReturnValue(
        updateContractStatusApiResponse
      );

      const saveFailureAction = ContractStatusActions.saveContractStatusFailure({
        error: error
      });
      const expected = cold('---(d|)', { d: saveFailureAction });

      expect(effects.saveContractStatus).toBeObservable(expected);
    });
  });
});
