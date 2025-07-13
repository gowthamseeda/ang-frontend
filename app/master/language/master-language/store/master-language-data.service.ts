import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Update } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../../../shared/services/api/api.service';
import { MasterLanguage } from '../master-language.model';

const url = '/geography/api/v1/languages';

export interface LanguageResponse {
  languages: MasterLanguage[];
}

@Injectable()
export class MasterLanguageDataService extends DefaultDataService<MasterLanguage> {
  constructor(
    private apiService: ApiService,
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator
  ) {
    super('MasterLanguage', http, httpUrlGenerator);
  }

  getAll(): Observable<MasterLanguage[]> {
    return this.apiService.get<LanguageResponse>(url).pipe(map(response => response.languages));
  }

  getById(languageId: string): Observable<MasterLanguage> {
    return this.apiService
      .get(`${url}/${languageId}`)
      .pipe(map(language => Object.assign({ id: languageId } as MasterLanguage, language)));
  }

  add(language: MasterLanguage): Observable<any> {
    return this.apiService.post(url, language);
  }

  update(update: Update<MasterLanguage>): Observable<any> {
    return this.apiService.put(`${url}/${update.id}`, { ...update.changes });
  }

  delete(languageId: string): Observable<any> {
    return this.apiService.delete(url + '/' + languageId);
  }
}
