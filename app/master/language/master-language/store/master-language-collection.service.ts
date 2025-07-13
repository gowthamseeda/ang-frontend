import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { createSelector, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';

import { MasterLanguage } from '../master-language.model';

@Injectable()
export class MasterLanguageCollectionService extends EntityCollectionServiceBase<MasterLanguage> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('MasterLanguage', serviceElementsFactory);
  }
  select(
    languageId: string
  ): MemoizedSelector<Object, MasterLanguage, DefaultProjectorFn<MasterLanguage>> {
    return createSelector(this.selectors.selectEntityMap, languages => {
      const language = languages[languageId];

      if (!language) {
        throw new Error('NOT_FOUND');
      }
      return language;
    });
  }
}
