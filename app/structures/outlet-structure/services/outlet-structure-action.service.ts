import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStructures from '../../store';
import { OutletStructureOutlets } from '../model/outlet-structure.model';
import { OutletStructureActions } from '../store/actions';

@Injectable({ providedIn: 'root' })
export class OutletStructureActionService {
  constructor(private store: Store<fromStructures.State>) {}

  dispatchLoadOutletStructures(outletId: string): void {
    this.store.dispatch(OutletStructureActions.loadOutletStructures({ outletId: outletId }));
  }

  dispatchCreateMarketStructure(outletId: string, isSublet: boolean, combinedData: any): void {
    this.store.dispatch(
      OutletStructureActions.createMarketStructure({
        marketStructure: {
          mainBusinessSiteId: outletId,
          subBusinessSiteIds: []
        },
        sourceOutlet: {
          isSublet: isSublet,
          siblingOutletIds: combinedData.siblingOutletIds,
          sourceParentId: combinedData.sourceParentId
        }
      })
    );
  }

  dispatchRemoveAllSublets(outletId: string): void {
    this.store.dispatch(OutletStructureActions.removeSublets({ outletId }));
  }

  dispatchRemoveOutletFromMarketStructure(
    outletId: string,
    isMainOutlet: boolean,
    isSubOutlet: boolean
  ): void {
    this.store.dispatch(
      OutletStructureActions.deleteFromMarketStructure({
        outletId: outletId,
        mainOutlet: isMainOutlet,
        subOutlet: isSubOutlet
      })
    );
  }

  dispatchMoveSubletTo(
    targetOutletId: string,
    sourceOutlet: OutletStructureOutlets,
    siblingOutletIds: string[],
    targetSubletIds: string[],
    sourceParentId: string
  ): void {
    this.store.dispatch(
      OutletStructureActions.moveSubletTo({
        targetOutletId: targetOutletId,
        sourceOutlet: sourceOutlet,
        siblingOutletIds: siblingOutletIds,
        targetSubletIds: targetSubletIds,
        sourceParentId: sourceParentId
      })
    );
  }
}
