import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';

import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { MarketStructure } from '../../../market-structure/market-structure.model';
import { MarketStructureService } from '../../../market-structure/market-structure.service';
import { Company } from '../../model/company.model';
import {
  OutletStructureOutletsResource,
  OutletStructureResource
} from '../../model/outlet-structure-api.model';
import { OutletStructure, OutletStructureOutlets } from '../../model/outlet-structure.model';
import { OutletStructureApiService } from '../../services/outlet-structure-api.service';
import { OutletStructureService } from '../../services/outlet-structure.service';
import { OutletStructureActions } from '../actions';

export interface MoveOutletStructure {
  targetOutletId: string;
  sourceOutlet: OutletStructureOutlets;
  siblingOutletIds: string[];
  targetSubletIds: string[];
  sourceParentId: string;
}

@Injectable()
export class OutletStructureEffects {
  loadOutletStructure = createEffect(() =>
    this.actions$.pipe(
      ofType(OutletStructureActions.loadOutletStructures),
      map((actionPayload: any) => actionPayload.outletId),
      switchMap(outletId =>
        combineLatest([of(outletId), this.outletStructureApiService.get(outletId)])
      ),
      switchMap((data: [string, OutletStructureResource]) => {
        const [outletId, outletStructureResource] = data;

        const company: Company = {
          id: outletStructureResource.companyId ?? '',
          legalName: outletStructureResource.companyLegalName ?? '',
          city: outletStructureResource.companyCity ?? ''
        };
        const outletStructure: OutletStructure = {
          outlets: this.getSortedOutlets(outletStructureResource.outlets)
        };

        return of(
          OutletStructureActions.loadOutletStructureSuccess({
            company,
            outletStructure,
            outletId
          })
        );
      }),
      catchError((error: any) => {
        return of(OutletStructureActions.loadOutletStructureFailure({ error }));
      })
    )
  );

  removeSublets = createEffect(() =>
    this.actions$.pipe(
      ofType(OutletStructureActions.removeSublets),
      map((actionPayload: any) => actionPayload.outletId),
      switchMap((outletId: string) =>
        forkJoin([
          of(outletId),
          this.marketStructureService.update({
            mainBusinessSiteId: outletId,
            subBusinessSiteIds: []
          })
        ])
      ),
      switchMap((res: [string, any]) => {
        const [outletId] = res;
        this.snackBarService.showInfo('EDIT_OUTLET_UPDATE_SUCCESS ');
        return of(OutletStructureActions.loadOutletStructures({ outletId: outletId }));
      }),
      catchError((error: any) => {
        this.snackBarService.showError(error);
        return of(OutletStructureActions.removeSubletsFailure({ error }));
      })
    )
  );

  createMarketStructure = createEffect(() =>
    this.actions$.pipe(
      ofType(OutletStructureActions.createMarketStructure),
      switchMap((actionPayload: any) => {
        const { sourceOutlet, marketStructure } = actionPayload;
        if (!sourceOutlet.isSublet) {
          return forkJoin([of(marketStructure)]);
        }
        return forkJoin([
          of(marketStructure),
          this.marketStructureService.update({
            mainBusinessSiteId: sourceOutlet.sourceParentId,
            subBusinessSiteIds: sourceOutlet.siblingOutletIds
          })
        ]);
      }),
      switchMap((updatedMarketStructure: [MarketStructure, any]) =>
        forkJoin([
          of(updatedMarketStructure[0].mainBusinessSiteId),
          this.marketStructureService.create(updatedMarketStructure[0])
        ])
      ),
      switchMap((data: any) => {
        const [outletId] = data;
        this.snackBarService.showInfo('EDIT_OUTLET_UPDATE_SUCCESS');
        return of(
          OutletStructureActions.loadOutletStructures({
            outletId: outletId
          })
        );
      }),
      catchError((error: any) => {
        this.snackBarService.showError(error);
        return of(OutletStructureActions.createMarketStructureFailure({ error }));
      })
    )
  );

  moveSubletTo = createEffect(() =>
    this.actions$.pipe(
      ofType(OutletStructureActions.moveSubletTo),
      switchMap((actionPayload: MoveOutletStructure) =>
        forkJoin([of(actionPayload), this.deleteMainOrSublet(actionPayload)])
      ),
      switchMap((updatedOutlet: any) => {
        const [movedData] = updatedOutlet;
        return forkJoin([
          of(movedData.sourceOutlet.businessSiteId),
          this.marketStructureService.update({
            mainBusinessSiteId: movedData.targetOutletId,
            subBusinessSiteIds: movedData.targetSubletIds
          })
        ]);
      }),
      switchMap((res: any) => {
        this.snackBarService.showInfo('EDIT_OUTLET_UPDATE_SUCCESS');
        return of(OutletStructureActions.loadOutletStructures({ outletId: res[0] }));
      }),
      catchError((error: any) => {
        this.snackBarService.showError(error);
        return of(OutletStructureActions.moveSubletToFailure({ error }));
      })
    )
  );

  deleteFromMarketStructure = createEffect(() =>
    this.actions$.pipe(
      ofType(OutletStructureActions.deleteFromMarketStructure),
      map((actionPayload: any) => actionPayload),
      switchMap((parameters: any) =>
        forkJoin([
          of(parameters.outletId),
          of(parameters.mainOutlet),
          of(parameters.subOutlet),
          this.outletStructureApiService.get(parameters.outletId),
          this.structureStoreService.getSiblingOutletIds(parameters.outletId).pipe(take(1))
        ])
      ),
      switchMap((values: any) => {
        const [outletId, mainOutlet, subOutlet, outletStructure, subletSiblingIds] = values;
        if (mainOutlet) {
          return forkJoin([of(outletId), this.marketStructureService.delete(outletId)]);
        } else if (subOutlet) {
          const parentOutlet = outletStructure.outlets.find((currentOutlet: any) => {
            const sublets = currentOutlet.subOutlets ? currentOutlet.subOutlets : [];
            return sublets.find((sublet: any) => sublet.businessSiteId === outletId) !== undefined;
          });

          if (parentOutlet && parentOutlet.subOutlets) {
            const filteredSubletIds = subletSiblingIds.filter((id: string) => id !== outletId);
            return forkJoin([
              of(outletId),
              this.marketStructureService.update({
                mainBusinessSiteId: parentOutlet.businessSiteId,
                subBusinessSiteIds: filteredSubletIds
              })
            ]);
          }
        }
        return of([outletId]);
      }),
      switchMap((values: any) => {
        const [outletId] = values;
        this.snackBarService.showInfo('EDIT_OUTLET_UPDATE_SUCCESS');
        return of(OutletStructureActions.loadOutletStructures({ outletId: outletId }));
      }),
      catchError((error: any) => {
        this.snackBarService.showError(error);
        return of(OutletStructureActions.deleteFromMarketStructureFailure({ error }));
      })
    )
  );

  constructor(
    private actions$: Actions,
    private outletStructureApiService: OutletStructureApiService,
    private marketStructureService: MarketStructureService,
    private snackBarService: SnackBarService,
    private structureStoreService: OutletStructureService
  ) {}

  private deleteMainOrSublet(moveOutlet: MoveOutletStructure): Observable<any> {
    const { sourceOutlet, sourceParentId, siblingOutletIds } = moveOutlet;
    if (sourceOutlet.mainOutlet) {
      return this.marketStructureService.delete(sourceOutlet.businessSiteId);
    }
    if (!sourceParentId) {
      return of(null);
    }
    return this.marketStructureService.update({
      mainBusinessSiteId: sourceParentId,
      subBusinessSiteIds: siblingOutletIds
    });
  }

  private getSortedOutlets(
    outlets: OutletStructureOutletsResource[] | undefined
  ): OutletStructureOutletsResource[] {
    return outlets
      ? outlets.sort((a, b) => {
          if (OutletStructureEffects.hasSubOutlets(a) && !OutletStructureEffects.hasSubOutlets(b)) {
            return -1;
          } else if (a.mainOutlet && !b.mainOutlet) {
            return -1;
          } else {
            return 1;
          }
        })
      : [];
  }

  private static hasSubOutlets(outlet: OutletStructureOutletsResource): boolean {
    return outlet.subOutlets !== undefined && outlet.subOutlets.length > 0;
  }
}
