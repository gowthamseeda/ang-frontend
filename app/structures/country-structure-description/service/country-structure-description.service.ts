import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromStructures from '../../store';
import { CountryStructureDescription } from '../model/country-structure-description.model';
import { CountryStructureDescriptionActions } from '../store/actions';
import { countryStructureDescriptionSelectors } from '../store/selectors';

@Injectable()
export class CountryStructureDescriptionService {
  constructor(private store: Store<fromStructures.State>) {}

  fetchAllForCountry(countryId: string): void {
    if (countryId.length > 0) {
      this.store.dispatch(
        CountryStructureDescriptionActions.loadCountryStructureDescription({ countryId: countryId })
      );
    }
  }

  getAll(): Observable<CountryStructureDescription[]> {
    return this.store.pipe(
      select(countryStructureDescriptionSelectors.selectAllCountryStructureDescriptions)
    );
  }
}
