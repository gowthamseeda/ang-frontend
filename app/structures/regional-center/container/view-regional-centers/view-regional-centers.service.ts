import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Country } from '../../../../geography/country/country.model';
import { CountryService } from '../../../../geography/country/country.service';
import { RegionalCenter } from '../../model/regional-center.model';
import { RegionalCenterService } from '../../services/regional-center.service';

import {
  RegionalCenterViewState,
  TranslatedAddress
} from './view-regional-centers.component.state';
import { TranslatedSuperviseeCountry } from './view-regional-centers.component.state';
@Injectable()
export class ViewRegionalCentersComponentService {
  constructor(
    private regionalCenterService: RegionalCenterService,
    private countryService: CountryService
  ) {}

  getAll(): Observable<RegionalCenterViewState[]> {
    return combineLatest([this.regionalCenterService.getAll(), this.countryService.getAll()]).pipe(
      map((data: [RegionalCenter[], Country[]]) => {
        const [regionalCenters, countries] = data;
        const translations = new Map<string, Country>();
        (countries ?? []).forEach(country => translations.set(country.id, country));

        return (regionalCenters ?? []).map(regionalCenter => {
          const addressCountry = translations.get(regionalCenter.address.countryId);

          const translatedAddress: TranslatedAddress = {
            ...regionalCenter.address,
            name: addressCountry ? addressCountry.name : '',
            translations: addressCountry ? addressCountry.translations : {}
          };

          const translatedCountries: TranslatedSuperviseeCountry[] = regionalCenter.superviseeCountries.map(
            country => {
              const supervisedCountry: Country | undefined = translations.get(country.countryId);

              return {
                ...country,
                name: supervisedCountry ? supervisedCountry.name : '',
                translations: supervisedCountry ? supervisedCountry.translations : {}
              };
            }
          );

          return {
            ...regionalCenter,
            address: translatedAddress,
            superviseeCountries: translatedCountries
          };
        });
      })
    );
  }
}
