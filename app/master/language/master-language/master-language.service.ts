import { Injectable } from '@angular/core';
import { EntityCache } from '@ngrx/data';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MasterLanguage } from './master-language.model';
import { MasterLanguageCollectionService } from './store/master-language-collection.service';
import { SortingService } from '../../../shared/services/sorting/sorting.service';

@Injectable({ providedIn: 'root' })
export class MasterLanguageService {
  language: MasterLanguage;

  constructor(
    private languageCollectionService: MasterLanguageCollectionService,
    private sortingService: SortingService,
    private store: Store<EntityCache>
  ) {
    this.fetchAll();
  }

  fetchAll(): void {
    this.languageCollectionService.getAll();
  }

  fetchBy(languageId: string): Observable<MasterLanguage> {
    return this.languageCollectionService.getByKey(languageId);
  }

  getAll(): Observable<MasterLanguage[]> {
    return this.store
      .pipe(select(this.languageCollectionService.selectors.selectEntities))
      .pipe(map((languages: MasterLanguage[]) => languages.sort(this.sortingService.sortByName)));
  }

  getBy(languageId: string): Observable<MasterLanguage> {
    return this.store.pipe(select(this.languageCollectionService.select(languageId)));
  }

  getLanguage(): MasterLanguage {
    return this.language;
  }

  create(language: MasterLanguage): Observable<MasterLanguage> {
    return this.languageCollectionService.add(language);
  }

  delete(languageId: string): Observable<string | number> {
    return this.languageCollectionService.delete(languageId);
  }

  update(language: MasterLanguage): Observable<any> {
    return this.languageCollectionService.update(language);
  }

  clearCacheAndFetchAll(): void {
    this.languageCollectionService.clearCache();
    this.fetchAll();
  }
}
