import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { Observable, of, OperatorFunction, zip } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { LegalStructureRoutingService } from '../../legal-structure/legal-structure-routing.service';

import { DistributionLevelCollectionService } from './store/distribution-level-collection.service';
import { DistributionLevelEntity } from './store/distribution-level-entity.model';

@Injectable({ providedIn: 'root' })
export class DistributionLevelsService {
  private currentBusinessSiteId: Observable<string>;

  constructor(
    private legalStructureRoutingService: LegalStructureRoutingService,
    private distributionLevelCollectionService: DistributionLevelCollectionService
  ) {
    this.currentBusinessSiteId = this.legalStructureRoutingService.outletIdChanges;
  }

  get(outletId: string): Observable<string[]> {
    return zip(
      this.distributionLevelCollectionService.loading$,
      this.distributionLevelCollectionService.entityMap$
    ).pipe(
      filter(([loading]) => !loading),
      this.getFromCacheOrLoad(outletId),
      map(entity => entity.distributionLevels)
    );
  }

  getDistributionLevelsOfOutlet(): Observable<string[]> {
    return this.currentBusinessSiteId.pipe(
      switchMap(currentBusinessSiteId => this.get(currentBusinessSiteId))
    );
  }

  update(outletId: string, distributionLevels: Array<string>): Observable<any> {
    return this.distributionLevelCollectionService.update({ id: outletId, distributionLevels });
  }

  isDistributionLevelEditable(
    originDistributionLevels: string[],
    distributionLevel: string
  ): Boolean {
    if (distributionLevel === 'RETAILER') {
      return (
        this.isApplicant(originDistributionLevels) && !this.isRetailer(originDistributionLevels)
      );
    }

    return distributionLevel === 'APPLICANT';
  }

  private isApplicant(originDistributionLevels: string[]): Boolean {
    return originDistributionLevels && originDistributionLevels.includes('APPLICANT');
  }

  private isRetailer(originDistributionLevels: string[]): Boolean {
    return originDistributionLevels && originDistributionLevels.includes('RETAILER');
  }

  private getFromCacheOrLoad(
    outletId: string
  ): OperatorFunction<[boolean, Dictionary<DistributionLevelEntity>], DistributionLevelEntity> {
    return switchMap(([, { [outletId]: entity }]) =>
      entity ? of(entity) : this.distributionLevelCollectionService.getByKey(outletId)
    );
  }
}
