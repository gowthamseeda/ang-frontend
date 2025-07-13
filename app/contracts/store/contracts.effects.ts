import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { SnackBarService } from '../../shared/services/snack-bar/snack-bar.service';
import { ContractsDataService, UpdateContract } from '../contracts.data-service';

import { ContractsEffectActions, ContractsServiceActions } from './actions';
import { ContractState } from './reducers';
import * as contractsSelector from './selectors/contracts.selectors';

@Injectable()
export class ContractsEffects {
  loadContracts = createEffect(() =>
    this.actions.pipe(
      ofType(ContractsServiceActions.loadContracts),
      switchMap(({ contractorId }) =>
        this.contractsDataService.get(contractorId).pipe(
          map(contracts => ContractsEffectActions.loadContractsSuccess({ contracts })),
          catchError(error => of(ContractsEffectActions.loadContractsFailure({ error })))
        )
      )
    )
  );

  loadOfferedServices = createEffect(() =>
    this.actions.pipe(
      ofType(ContractsServiceActions.loadOfferedServices),
      switchMap(({ contractorId }) =>
        this.contractsDataService.getOfferedServices(contractorId).pipe(
          map(offeredServices =>
            ContractsEffectActions.loadOfferedServicesSuccess({ offeredServices })
          ),
          catchError(error => of(ContractsEffectActions.loadOfferedServicesFailure({ error })))
        )
      )
    )
  );

  loadContractee = createEffect(() =>
    this.actions.pipe(
      ofType(ContractsServiceActions.updateContracts),
      mergeMap(({ contractEntityIds, contracteeId }) =>
        this.contractsDataService.getContractee(contracteeId).pipe(
          map(contractee =>
            ContractsEffectActions.loadContracteeOfChangedContractsSuccess({
              contractEntityIds,
              contractee
            })
          ),
          catchError(error =>
            of(ContractsEffectActions.loadContracteeOfChangedContractsFailure({ error }))
          )
        )
      )
    )
  );

  loadContracteeOfContract = createEffect(() =>
    this.actions.pipe(
      ofType(ContractsServiceActions.addContracts),
      switchMap(({ contracts }) =>
        this.contractsDataService.getContractee(contracts[0].contracteeId).pipe(
          map(contractee =>
            ContractsEffectActions.loadContracteeOfNewContractsSuccess({
              contracts: contracts.map(contract => ({
                contractor: contract.contractor,
                contractee: contractee,
                offeredService: contract.offeredService
              }))
            })
          ),
          catchError(error =>
            of(ContractsEffectActions.loadContracteeOfNewContractsFailure({ error }))
          )
        )
      )
    )
  );

  saveContracts = createEffect(() =>
    this.actions.pipe(
      ofType(ContractsServiceActions.saveContracts),
      concatMap(action =>
        of(action).pipe(withLatestFrom(this.store.pipe(select(contractsSelector.selectAll))))
      ),
      switchMap(([{ contractorId }, contracts]) => {
        const contractsToUpdate: UpdateContract[] = contracts.map(contract => ({
          offeredServiceId: contract.offeredService.id,
          contracteeId: contract.contractee.id
        }));

        return this.contractsDataService.update(contractorId, contractsToUpdate).pipe(
          map(() => {
            this.snackBarService.showInfo('EDIT_CONTRACTS_SUCCESS');
            return ContractsEffectActions.saveContractsSuccess();
          }),
          catchError(error => {
            this.snackBarService.showError(error);
            return of(ContractsEffectActions.saveContractsFailure({ error }));
          })
        );
      })
    )
  );

  constructor(
    private actions: Actions,
    private store: Store<ContractState>,
    private contractsDataService: ContractsDataService,
    private snackBarService: SnackBarService
  ) {}
}
