import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, zip } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';

import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import {
  ContractStatusActions,
  FailurePayload,
  LegalInformationActions,
  SaveLegalInformationPayload,
  SaveLegalInformationSuccessPayload
} from '../actions';

@Injectable()
export class LegalInformationSavingStatusEffects {
  saveSuccessBoth = createEffect(() =>
    this.actions.pipe(
      ofType(LegalInformationActions.saveLegalInformation),
      filter(saveLegalInfoPayload => saveLegalInfoPayload.correlationId !== -1),
      switchMap((saveLegalInfoPayload: SaveLegalInformationPayload) => {
        const correlationId = saveLegalInfoPayload.correlationId;
        const businessSiteId = saveLegalInfoPayload.businessSiteId;
        const companyId = saveLegalInfoPayload.companyId;

        const legalInfoSaveSuccess = this.actions.pipe(
          ofType(LegalInformationActions.saveLegalInformationSuccess),
          filter(action => action.correlationId === correlationId),
          first()
        );

        const contractStatusSaveSuccess = this.actions.pipe(
          ofType(ContractStatusActions.saveContractStatusSuccess),
          filter(action => action.correlationId === correlationId),
          first()
        );

        return zip(legalInfoSaveSuccess, contractStatusSaveSuccess).pipe(
          map(() => {
            this.snackBarService.showInfo('SAVE_LEGAL_INFORMATION_SUCCESS');
            return LegalInformationActions.loadLegalInformation({
              outletId: businessSiteId,
              companyId: companyId
            });
          })
        );
      })
    )
  );

  saveSuccessLegalInfoOnly = createEffect(() =>
    this.actions.pipe(
      ofType(LegalInformationActions.saveLegalInformationSuccess),
      filter(actionPayload => actionPayload.correlationId === -1),
      switchMap((actionPayload: SaveLegalInformationSuccessPayload) => {
        this.snackBarService.showInfo('SAVE_LEGAL_INFORMATION_SUCCESS');
        return of(
          LegalInformationActions.loadLegalInformation({
            outletId: actionPayload.businessSiteId,
            companyId: actionPayload.companyId
          })
        );
      })
    )
  );

  confirmSaveSuccessLegalInfoOnly = createEffect(() =>
    this.actions.pipe(
      ofType(LegalInformationActions.confirmSaveLegalInformationSuccess),
      filter(actionPayload => actionPayload.correlationId === -1),
      switchMap((actionPayload: SaveLegalInformationSuccessPayload) => {
        this.snackBarService.showInfo('TASK_UPDATE_LEGAL_REQUEST_SUCCESS');
        return of(
          LegalInformationActions.loadLegalInformation({
            outletId: actionPayload.businessSiteId,
            companyId: actionPayload.companyId
          })
        );
      })
    )
  );

  saveFailure = createEffect(
    () =>
      this.actions.pipe(
        ofType(
          LegalInformationActions.saveLegalInformationFailure,
          ContractStatusActions.saveContractStatusFailure
        ),
        map((failure: FailurePayload) => {
          this.snackBarService.showError(failure.error);
        })
      ),
    { dispatch: false }
  );

  constructor(private actions: Actions, private snackBarService: SnackBarService) {}
}
