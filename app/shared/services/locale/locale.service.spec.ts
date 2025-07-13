import { LocaleService } from './locale.service';

describe('Locale Service Test Suites', () => {
  const defaultBrowserLocale = 'en-US';
  const translationLocale = 'de-DE';
  let localeService: LocaleService;

  beforeEach(() => {
    localeService = new LocaleService();
    localeService.initializeTranslationLocale('de-DE');
  });

  test('create an instance', () => {
    expect(localeService).toBeTruthy();
  });

  test('should import default browser locale', done => {
    localeService.currentBrowserLocale().subscribe(locale => {
      expect(locale).toEqual(defaultBrowserLocale);
      done();
    });
  });

  test('should import given translation locale', done => {
    localeService.currentTranslationLocale().subscribe(locale => {
      expect(locale).toEqual(translationLocale);
      done();
    });
  });
});
