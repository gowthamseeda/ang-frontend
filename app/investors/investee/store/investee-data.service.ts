import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Update } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../../shared/services/api/api.service';
import { Investee } from '../investee.model';

const url = '/investors/api/v1/investees';

@Injectable()
export class InvesteeDataService extends DefaultDataService<Investee> {
  constructor(
    private apiService: ApiService,
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator
  ) {
    super('Investee', http, httpUrlGenerator);
  }

  getById(investeeId: string): Observable<Investee> {
    return this.apiService
      .get(`${url}/${investeeId}`)
      .pipe(map(investee => Object.assign({ id: investeeId } as Investee, investee)));
  }

  // any, since update expects T to be Investee as well, but apiService returns ObjectStatus
  update(update: Update<any>): Observable<any> {
    return this.apiService.put(`${url}/${update.id}`, { ...update.changes });
  }
}
