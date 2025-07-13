import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TaskData } from 'app/tasks/task.model';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ApiError } from '../../../../shared/services/api/api.service';
import { ObjectStatus } from '../../../../shared/services/api/objectstatus.model';
import { LegalInformationResponse } from '../../model/legal-information-response';
import { LegalInformationApiService } from '../../services/legal-information-api.service';
import {
  LegalInformationActions,
  LoadLegalInformationPayload,
  SaveLegalInformationPayload
} from '../actions';

@Injectable()
export class LegalInformationEffects {
  loadLegalInformation = createEffect(() =>
    this.actions.pipe(
      ofType(LegalInformationActions.loadLegalInformation),
      switchMap((payload: LoadLegalInformationPayload) => {
        return forkJoin([
          of(payload.outletId),
          this.legalInformationApiService.loadLegalInformation(payload.companyId, payload.outletId)
        ]).pipe(
          map((data: [string, LegalInformationResponse | null]) => {
            const [outletId, legalInfoResponse] = data;
            return LegalInformationActions.loadLegalInformationSuccess({
              businessSiteId: outletId,
              businessSiteLegalInfo: { nationalTaxNumber: legalInfoResponse?.taxNo ?? '' },
              companyLegalInfo: {
                companyVatNumber: legalInfoResponse?.vatNo ?? '',
                legalFooter: legalInfoResponse?.legalFooter ?? '',
                legalFooterAdditionalTranslations: legalInfoResponse?.legalFooterTranslations ?? {}
              }
            });
          }),
          catchError((error: ApiError) =>
            of(LegalInformationActions.loadLegalInformationFailure({ error }))
          )
        );
      })
    )
  );

  saveLegalInformation = createEffect(() =>
    this.actions.pipe(
      ofType(LegalInformationActions.saveLegalInformation),
      switchMap((saveLegalInfoPayload: SaveLegalInformationPayload) => {
        return forkJoin([
          of(saveLegalInfoPayload.correlationId),
          of(saveLegalInfoPayload.businessSiteId),
          of(saveLegalInfoPayload.companyId),
          this.legalInformationApiService.saveLegalInformation(
            saveLegalInfoPayload.companyId,
            saveLegalInfoPayload.businessSiteId,
            {
              legalFooter: saveLegalInfoPayload.legalFooter,
              legalFooterTranslations: saveLegalInfoPayload.legalFooterAdditionalTranslations,
              taxNo: saveLegalInfoPayload.nationalTaxNumber,
              vatNo: saveLegalInfoPayload.companyVatNumber,
              taskData: {
                dueDate: saveLegalInfoPayload.taskData?.dueDate,
                comment: saveLegalInfoPayload.taskData?.comment
              }
            }
          ),
          of(saveLegalInfoPayload.taskData)
        ]);
      }),
      switchMap((data: [number, string, string, ObjectStatus, TaskData]) => {
        const [correlationId, businessSiteId, companyId, , taskData] = data;
        if (taskData !== undefined) {
          return of(
            LegalInformationActions.confirmSaveLegalInformationSuccess({
              businessSiteId,
              correlationId,
              companyId
            })
          );
        }
        return of(
          LegalInformationActions.saveLegalInformationSuccess({
            businessSiteId,
            correlationId,
            companyId
          })
        );
      }),
      catchError((error: ApiError) => {
        return of(LegalInformationActions.saveLegalInformationFailure({ error }));
      })
    )
  );

  constructor(
    private actions: Actions,
    private legalInformationApiService: LegalInformationApiService
  ) {}
}
