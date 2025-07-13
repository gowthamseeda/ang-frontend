import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { OutletStructureOutlets } from '../../model/outlet-structure.model';
import { OutletStructureActionService } from '../../services/outlet-structure-action.service';
import { OutletStructureService } from '../../services/outlet-structure.service';
import { MoveOutletStructure } from '../../store/effects/outlet-structure.effects';

@Injectable()
export class OutletTreeNavigationService {
  constructor(
    private structuresStoreService: OutletStructureService,
    private structuresActionService: OutletStructureActionService
  ) {}

  createMarketStructureForOutlet(outletId: string, isSublet: boolean): void {
    combineLatest([
      this.structuresStoreService.getSiblingOutletIds(outletId),
      this.structuresStoreService.getSubletParentId(outletId)
    ])
      .pipe(
        take(1),
        map(([siblingIds, parentId]) => {
          const siblingOutletIds = siblingIds.filter(id => id !== outletId);
          return {
            siblingOutletIds,
            sourceParentId: parentId
          };
        })
      )
      .subscribe((combinedData: any) => {
        this.structuresActionService.dispatchCreateMarketStructure(
          outletId,
          isSublet,
          combinedData
        );
      })
      .unsubscribe();
  }

  removeAllSubletsFromMarketStructure(outletId: string): void {
    this.structuresActionService.dispatchRemoveAllSublets(outletId);
  }

  removeOutletFromMarketStructure(
    outletId: string,
    isMainOutlet: boolean,
    isSubOutlet: boolean
  ): void {
    this.structuresActionService.dispatchRemoveOutletFromMarketStructure(
      outletId,
      isMainOutlet,
      isSubOutlet
    );
  }

  makeOutletSubletOf(
    sourceStructureOutlet: OutletStructureOutlets,
    targetOutletId: string = ''
  ): void {
    combineLatest([
      this.structuresStoreService.getSubletParentId(sourceStructureOutlet.businessSiteId),
      this.structuresStoreService.getSiblingOutletIds(sourceStructureOutlet.businessSiteId),
      this.structuresStoreService.getSubletIds(targetOutletId)
    ])
      .pipe(
        take(1),
        map(([parentOutletId, parentSubletIds, targetSubletIds]) => {
          const sourceSiblingIds = parentSubletIds.filter(
            id => id !== sourceStructureOutlet.businessSiteId
          );
          targetSubletIds.push(sourceStructureOutlet.businessSiteId);
          return {
            targetOutletId,
            sourceOutlet: sourceStructureOutlet,
            siblingOutletIds: sourceSiblingIds,
            targetSubletIds: targetSubletIds,
            sourceParentId: parentOutletId
          };
        })
      )
      .subscribe((combinedData: MoveOutletStructure) => {
        const { sourceOutlet, siblingOutletIds, targetSubletIds, sourceParentId } = combinedData;
        this.structuresActionService.dispatchMoveSubletTo(
          targetOutletId,
          sourceOutlet,
          siblingOutletIds,
          targetSubletIds,
          sourceParentId
        );
      })
      .unsubscribe();
  }
}
