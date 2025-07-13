import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../shared/services/api/api.service';

import { Language } from './language.model';

export interface LanguagesResponse {
  languages: Language[];
}

@Injectable()
export class LanguageService {
  private languages = new ReplaySubject<Language[]>(1);

  constructor(private apiService: ApiService) {
    this.apiService
      .get<LanguagesResponse>('/tpro/gssnplus/languages')
      .pipe(map(result => result.languages))
      .subscribe(result => this.languages.next(result));
  }

  getAll(): Observable<Language[]> {
    return this.languages.asObservable();
  }
}
