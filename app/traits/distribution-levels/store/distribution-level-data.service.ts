import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, EntityDataService, HttpUrlGenerator } from '@ngrx/data';
import { Update } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { map, retryWhen } from 'rxjs/operators';

import { ApiService } from '../../../shared/services/api/api.service';
import { delayedRetryStrategy } from '../../../shared/util/delayed-retry-strategy';

import { DistributionLevelEntity } from './distribution-level-entity.model';

const url = '/traits/api/v1/business-sites';

interface DistributionLevelResource {
  distributionLevels: string[];
}

@Injectable({ providedIn: 'root' })
export class DistributionLevelDataService extends DefaultDataService<DistributionLevelEntity> {
  constructor(
    private apiService: ApiService,
    private entityDataService: EntityDataService,
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator
  ) {
    super('DistributionLevel', http, httpUrlGenerator);
    this.entityDataService.registerService('DistributionLevel', this);
  }

  getById(outletId: string): Observable<DistributionLevelEntity> {
    return this.apiService
      .get<DistributionLevelResource>(`${url}/${outletId}/distribution-levels`)
      .pipe(
        map(response => ({
          id: outletId,
          distributionLevels: response?.distributionLevels ?? []
        }))
      );
  }

  update(update: Update<DistributionLevelEntity>): Observable<DistributionLevelEntity> {
    const entity = {
      id: update.id as string,
      distributionLevels: update?.changes?.distributionLevels ?? []
    };

    return this.apiService
      .put(`${url}/${entity.id}/distribution-levels`, {
        distributionLevels: entity.distributionLevels
      })
      .pipe(
        retryWhen(delayedRetryStrategy()),
        map(() => entity)
      );
  }
}
