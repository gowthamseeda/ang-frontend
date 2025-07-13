import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Update } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../../../shared/services/api/api.service';
import { Predecessor } from '../predecessor.model';

const url = '/legal-structure/api/v1';

@Injectable()
export class PredecessorDataService extends DefaultDataService<Predecessor> {
  constructor(
    private apiService: ApiService,
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator
  ) {
    super('Predecessor', http, httpUrlGenerator);
  }

  getById(outletId: string): Observable<Predecessor> {
    return this.apiService
      .get<Predecessor>(`${url}/business-sites/${outletId}/predecessors/bff`)
      .pipe(map(predecessor => Object.assign({ id: outletId } as Predecessor, predecessor)));
  }

  update(update: Update<any>): Observable<any> {
    return this.apiService.put(
      `${url}/business-sites/${update.id}/predecessors`,
      Object.assign({
        predecessors: update.changes.predecessors.map(
          ({ businessSiteId }: { businessSiteId: string }) => businessSiteId
        )
      })
    );
  }
}
