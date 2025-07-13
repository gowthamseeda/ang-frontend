import { Translatable } from './translatable.model';

describe('Translatable', () => {
  describe('sortByLang', () => {
    let countries;

    beforeEach(() => {
      countries = [
        {
          id: 1,
          name: 'Switzerland',
          translations: { 'de-DE': 'Schweiz' }
        },
        {
          id: 2,
          name: 'Austria',
          translations: { 'de-DE': 'Österreich' }
        },
        {
          id: 3,
          name: 'Germany',
          translations: { 'de-DE': 'Deutschland', 'fr-FR': 'Allemagne' }
        }
      ];
    });

    it('should sort countries by German translations', () => {
      const sortedCountries = countries
        .sort(Translatable.sortByLang('de-DE'))
        .map(country => country.translations['de-DE']);

      expect(sortedCountries).toEqual(['Deutschland', 'Schweiz', 'Österreich']);
    });

    it('should sort countries by name when Swiss translations are not available', () => {
      const sortedCountries = countries
        .sort(Translatable.sortByLang('de-CH'))
        .map(country => country.name);

      expect(sortedCountries).toEqual(['Austria', 'Germany', 'Switzerland']);
    });

    it('should sort countries by French translations and name when French translations are not available', () => {
      const sortedCountries = countries
        .sort(Translatable.sortByLang('fr-FR'))
        .map(country => country.name);

      expect(sortedCountries).toEqual(['Germany', 'Austria', 'Switzerland']);
    });
  });
});
