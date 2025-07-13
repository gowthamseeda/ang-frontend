import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ObjectStatus } from 'app/shared/services/api/objectstatus.model';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ApiError } from '../../../../shared/services/api/api.service';
import { ContractStatusApiService } from '../../../../traits/contract-status/contract-status-api.service';
import { ContractStatusResponse } from '../../../../traits/contract-status/contract-status.model';
import {
  ContractStatusActions,
  LoadLegalInformationPayload,
  SaveContractStatusPayload
} from '../actions';
import { ContractState, LegalContractStatus } from '../state.model';

@Injectable()
export class ContractStatusEffects {
  loadContractStatus = createEffect(() =>
    this.actions.pipe(
      ofType(ContractStatusActions.loadContractStatus),
      switchMap((payload: LoadLegalInformationPayload) =>
        this.contractStatusApiService.loadContractStatus(payload.outletId).pipe(
          map((contractStatusResponse: ContractStatusResponse) =>
            ContractStatusActions.loadContractStatusSuccess({
              legalContracts: (contractStatusResponse.items ?? []).map((contract, index) => ({
                id: index,
                brandId: contract.brandId,
                companyRelationId: contract.companyRelationId,
                required: contract.required,
                languageId: contract.languageId,
                contractState: contract.status ?? '',
                corporateDisclosure: contract.disclosures ?? '',
                status: LegalContractStatus.DEFAULT
              }))
            })
          ),
          catchError((error: ApiError) =>
            of(ContractStatusActions.loadContractStatusFailure({ error: error }))
          )
        )
      )
    )
  );

  saveContractStatus = createEffect(() =>
    this.actions.pipe(
      ofType(ContractStatusActions.saveContractStatus),
      switchMap((saveContractStatusPayload: SaveContractStatusPayload) =>
        forkJoin([
          of(saveContractStatusPayload.correlationId),
          this.contractStatusApiService.updateContractStatus(
            saveContractStatusPayload.businessSiteId,
            {
              items: saveContractStatusPayload.contractStatus.map((contract: ContractState) => ({
                brandId: contract.brandId ?? '',
                companyRelationId: contract.companyRelationId ?? '',
                required: contract.required ?? false,
                languageId: contract.languageId,
                status: contract.contractState ?? '',
                disclosures: contract.corporateDisclosure ?? ''
              }))
            }
          )
        ])
      ),
      switchMap((data: [number, ObjectStatus]) => {
        const [correlationId] = data;
        return of(
          ContractStatusActions.saveContractStatusSuccess({ correlationId: correlationId })
        );
      }),
      catchError((error: ApiError) => {
        return of(ContractStatusActions.saveContractStatusFailure({ error: error }));
      })
    )
  );

  constructor(
    private actions: Actions,
    private contractStatusApiService: ContractStatusApiService
  ) {}
}
