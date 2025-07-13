import { Injectable } from '@angular/core';
import { EntityCache } from '@ngrx/data';
import { select, Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { SortingService } from '../../../shared/services/sorting/sorting.service';
import { MasterCountryActivation } from '../../services/master-country-activation/master-country-activation.model';
import { MasterCountryActivationService } from '../../services/master-country-activation/master-country-activation.service';
import { MasterCountryTraits } from '../../services/master-country-traits/master-country-traits.model';
import { MasterCountryTraitsService } from '../../services/master-country-traits/master-country-traits.service';

import { MasterCountry } from './master-country.model';
import { MasterCountryCollectionService } from './store/master-country-collection.service';

@Injectable({ providedIn: 'root' })
export class MasterCountryService {
  constructor(
    private countryCollectionService: MasterCountryCollectionService,
    private sortingService: SortingService,
    private countryTraitsService: MasterCountryTraitsService,
    private countryActivationService: MasterCountryActivationService,
    private store: Store<EntityCache>
  ) {
    this.fetchAll();
  }

  fetchAll(): void {
    this.countryCollectionService.getAll();
  }

  fetchBy(countryId: string): Observable<MasterCountry> {
    return this.countryCollectionService.getByKey(countryId);
  }

  getAll(): Observable<MasterCountry[]> {
    return this.store
      .pipe(select(this.countryCollectionService.selectors.selectEntities))
      .pipe(map((countries: MasterCountry[]) => countries.sort(this.sortingService.sortByName)));
  }

  create(country: MasterCountry): Observable<MasterCountry> {
    country = this.removeEmptyObject(country);
    return this.countryCollectionService.add(country);
  }

  delete(countryId: string): Observable<string | number> {
    return this.countryCollectionService.delete(countryId);
  }

  update(country: MasterCountry): Observable<any> {
    country = this.removeEmptyObject(country);
    return this.countryCollectionService.update(country);
  }

  clearCacheAndFetchAll(): void {
    this.countryCollectionService.clearCache();
    this.fetchAll();
  }

  updateAll(
    country: MasterCountry,
    countryTraits: MasterCountryTraits,
    countriesActivation: MasterCountryActivation[],
    marketStructureEnabled: boolean
  ): Observable<any> {
    const marketStructureActivated = this.checkCountryActivation(countriesActivation, country.id);
    const activateMarketStructure = marketStructureEnabled && !marketStructureActivated;
    const deactivateMarketStructure = !marketStructureEnabled && marketStructureActivated;

    let updateCountryError: any;
    let updateTraitsError: any;
    return this.update(country).pipe(
      catchError(error => throwError(error).pipe(tap((updateCountryError = error)))),
      mergeMap(() => this.countryTraitsService.update(countryTraits)),
      catchError(error => throwError(error).pipe(tap((updateTraitsError = error)))),
      mergeMap(() => {
        const countryActivation = this.getCountryActivation(
          countriesActivation,
          country.id,
          marketStructureActivated
        );
        if (activateMarketStructure) {
          return this.countryActivationService.create(countryActivation);
        } else if (deactivateMarketStructure) {
          return this.countryActivationService.delete(countryActivation.activationId);
        }
        return of([]);
      }),
      catchError(() => {
        if (updateCountryError) {
          return throwError(updateCountryError);
        } else if (updateTraitsError) {
          return throwError(new Error('UPDATE_COUNTRY_FAILED_TRAITS'));
        }
        return throwError(new Error('UPDATE_COUNTRY_FAILED_COUNTRY_ACTIVATION'));
      })
    );
  }

  checkCountryActivation(
    countriesActivation: MasterCountryActivation[],
    countryId: string
  ): boolean {
    if (countriesActivation) {
      const data = countriesActivation.some(
        countryActivation => countryActivation.countryId === countryId
      );
      return data;
    }
    return false;
  }

  private removeEmptyObject(country: MasterCountry): MasterCountry {
    if (country.timeZone === '') {
      delete country.timeZone;
    }

    if (country.defaultLanguageId === '') {
      delete country.defaultLanguageId;
    }

    if (country.languages === undefined || country.languages.length === 0) {
      country.languages = [];
    }
    return country;
  }

  private getCountryActivation(
    countriesActivation: MasterCountryActivation[],
    countryId: string,
    marketStructureActivated: boolean
  ): MasterCountryActivation {
    if (countriesActivation && marketStructureActivated) {
      const countryActivation = countriesActivation.find(ca => ca.countryId === countryId);
      if (countryActivation) {
        return countryActivation;
      }
    }
    return new MasterCountryActivation(countryId);
  }
}
