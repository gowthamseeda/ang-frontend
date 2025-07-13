import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {CountryService} from '../../../geography/country/country.service';
import {TranslateDataPipe} from '../translate-data/translate-data.pipe';

@Pipe({
  name: 'translateCountry'
})
export class TranslateCountryPipe implements PipeTransform {
  constructor(
    private countryService: CountryService,
    private translateDataPipe: TranslateDataPipe,
    private translateService: TranslateService
  ) {
  }

  transform(countryId: string, languageId?: string, postfixId?: boolean): Observable<string> {
    return this.countryService.getAll()
      .pipe(
        map(countries => {
          const countryTranslatable = countries.find(
            country => country.id === countryId
          );
          if (countryTranslatable) {
            return this.translateDataPipe.transform(
              countryTranslatable,
              languageId || this.translateService.currentLang,
              postfixId || false
            );
          }
          return countryId;
        })
      );
  }
}
