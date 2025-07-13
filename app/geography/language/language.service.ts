import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../shared/services/api/api.service';

import { Language } from './language.model';

const url = '/geography/api/v1/languages';

export interface LanguagesResponse {
  languages: Language[];
}

@Injectable()
export class LanguageService {
  constructor(private apiService: ApiService) {}

  getAll(): Observable<Language[]> {
    return this.apiService
      .get<LanguagesResponse>(url)
      .pipe(map((response: LanguagesResponse) => response.languages));
  }

  getAllAsMap(): Observable<Map<string, Language>> {
    return new Observable(observer => {
      this.getAll().subscribe((languages: Language[]) => {
        observer.next(
          new Map(languages.map(language => [language.id, language] as [string, Language]))
        );
      });
    });
  }

  getTwoLetterLanguages(): Observable<Language[]> {
    return this.getAll().pipe(
      map(languages => languages.filter(language => language.id.length === 2))
    );
  }

  get(languageId: string): Observable<Language> {
    return this.apiService.get<Language>(url + '/' + languageId);
  }
}
