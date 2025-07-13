import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { CountryStructureApiService } from './country-structure-api.service';

@Injectable()
export class CountryStructureService {
  constructor(private countryStructureApiService: CountryStructureApiService) {}

  getCountryStructureIdBy(businessSiteId: string): Observable<string | undefined> {
    return this.countryStructureApiService.getCountryStructureBy(businessSiteId).pipe(
      filter(countryStructure => countryStructure != null), // checks also undefined
      map(countryStructure => countryStructure.id)
    );
  }

  setCountryStructureIdFor(businessSiteId: string, countryStructureId: string): Observable<any> {
    return this.countryStructureApiService.updateCountryStructureWith(businessSiteId, {
      countryStructureId: countryStructureId
    });
  }
}
