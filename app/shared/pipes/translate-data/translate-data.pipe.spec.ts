import { Country } from '../../../geography/country/country.model';

import { TranslateDataPipe } from './translate-data.pipe';

describe('CountryPipe for country with translations', () => {
  let pipe: TranslateDataPipe;
  let country: Country;

  beforeEach(() => {
    pipe = new TranslateDataPipe();
    country = {
      id: 'DE',
      name: 'Germany',
      translations: {
        'de-DE': 'Deutschland'
      },
      languages: ['de-DE']
    };
  });

  it('should return translation if lang and translation is provided. Should hide id.', () => {
    const translation = pipe.transform(country, 'de-DE')
    expect(translation).toBe('Deutschland');
  });

  it('should return translation if lang and translation is provided. Should show id.', () => {
    const translation = pipe.transform(country, 'de-DE', true)
    expect(translation).toBe('Deutschland (DE)');
  });

  it('should return country name if translation is not in translations', () => {
    const translation = pipe.transform(country, 'en-US')
    expect(translation).toBe('Germany');
  });

  it('should return country name if lang is empty', () => {
    const translation = pipe.transform(country, '')
    expect(translation).toBe('Germany');
  });
});

describe('CountryPipe for country without translations', () => {
  let pipe: TranslateDataPipe;
  let country: Country;

  beforeEach(() => {
    pipe = new TranslateDataPipe();
    country = {
      id: 'DE',
      name: 'Germany',
      languages: ['de-DE']
    };
  });

  it('should return country name', () => {
    const translation = pipe.transform(country, 'de-DE')
    expect(translation).toBe('Germany');
  });
});
