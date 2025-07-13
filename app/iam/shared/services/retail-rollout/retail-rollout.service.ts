import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OutletService } from '../../../../legal-structure/shared/services/outlet.service';
import { RetailCountryService } from '../../../../geography/retail-county/retail-country.service';


@Injectable({ providedIn: 'root' })
export class RetailRolloutService {
  constructor(private outletService: OutletService, private retailCountryService: RetailCountryService) {}

  isRolledOutFor(businessSiteId: string): Observable<boolean> {
    return combineLatest([
      this.outletService.getOrLoadBusinessSite(businessSiteId),
      this.retailCountryService.getAllIds()
    ]).pipe(
      map(([outlet, retailCountries]) => retailCountries.includes(outlet.countryId?.toUpperCase()))
    );
  }
}
