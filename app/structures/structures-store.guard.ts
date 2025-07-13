import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { paramOutletId } from '../legal-structure/legal-structure-routing-paths';

import { OutletStructureActionService } from './outlet-structure/services/outlet-structure-action.service';
import { OutletStructureService } from './outlet-structure/services/outlet-structure.service';

@Injectable()
export class StructuresStoreInitializer implements CanActivate {
  constructor(
    private structuresActionService: OutletStructureActionService,
    private structureStoreService: OutletStructureService
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const outletId = next.paramMap.get(paramOutletId) || '';
    return this.initStore(outletId);
  }

  initStore(outletId: string): Observable<boolean> {
    return this.structureStoreService.isInitializedFor(outletId).pipe(
      tap(initialized => {
        if (!initialized) {
          this.structuresActionService.dispatchLoadOutletStructures(outletId);
        }
      }),
      map(() => true)
    );
  }
}
