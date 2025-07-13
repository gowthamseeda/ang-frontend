import {TestBed, waitForAsync} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import {createSpyFromClass, Spy} from 'jest-auto-spies';

import {getCountryChMockWithTranslations} from '../../../geography/country/country.mock';
import {Country} from '../../../geography/country/country.model';
import {CountryService} from '../../../geography/country/country.service';
import {TranslateDataPipe} from '../translate-data/translate-data.pipe';

import {TranslateCountryPipe} from './translate-country.pipe';

const country: Country = getCountryChMockWithTranslations();
const currentLang = 'en-US';

describe('TranslateCountryPipe', () => {
  let pipe: TranslateCountryPipe;
  let countryServiceSpy: Spy<CountryService>;
  let translateServiceSpy: Spy<TranslateService>;

  beforeEach(
    waitForAsync(() => {
      countryServiceSpy = createSpyFromClass(CountryService);
      translateServiceSpy = createSpyFromClass(TranslateService);
      TestBed.configureTestingModule({
        providers: [
          {provide: CountryService, useValue: countryServiceSpy},
          {provide: TranslateService, useValue: translateServiceSpy},
          {provide: TranslateDataPipe}
        ]
      });
      pipe = new TranslateCountryPipe(
        TestBed.inject(CountryService),
        TestBed.inject(TranslateDataPipe),
        TestBed.inject(TranslateService)
      );

      translateServiceSpy.currentLang = currentLang;
      countryServiceSpy.getAll.nextWith([country]);
    }));

  describe('country exists', () => {
    it('should return country name', waitForAsync(() => {
      pipe.transform(country.id)
        .subscribe(countryName => {
          expect(countryName).toBe('Switzerland');
        });
    }));

    it('should use languageId is exists', waitForAsync(() => {
      pipe.transform(country.id, 'de-CH')
        .subscribe(countryName => {
          expect(countryName).toBe('Schweiz');
        });
    }));

    it('should use currentLang if languageId does not exist', waitForAsync(() => {
      translateServiceSpy.currentLang = 'fr-FR';
      pipe.transform(country.id)
        .subscribe(countryName => {
          expect(countryName).toBe('Suisse');
        });
    }));

    it('should show postfix ID', waitForAsync(() => {
      pipe.transform(country.id, 'de-CH', true)
        .subscribe(countryName => {
          expect(countryName).toBe('Schweiz (CH)');
        });
    }));
  });

  it('should return countryId if country does not exist', waitForAsync(() => {
    const countryId = `${country.id}TEST`;
    pipe.transform(countryId)
      .subscribe(countryName => {
        expect(countryName).toBe(countryId);
      });
  }));
});
