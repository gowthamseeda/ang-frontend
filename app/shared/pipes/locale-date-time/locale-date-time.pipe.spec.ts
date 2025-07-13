import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { TestBed } from '@angular/core/testing';
import moment from 'moment';
import { of } from 'rxjs';

import { LocaleService } from '../../services/locale/locale.service';

import { LocaleDateTimePipe } from './locale-date-time.pipe';

describe('LocaleDateTimePipe Test suite', () => {
  let localeService: LocaleService;
  let pipe: LocaleDateTimePipe;

  TestBed.resetTestingModule();
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LocaleService,
          useValue: {
            currentBrowserLocale: jest.fn()
          }
        }
      ]
    });
    localeService = TestBed.inject(LocaleService);
  });

  test('create an instance', () => {
    jest.spyOn(localeService, 'currentBrowserLocale').mockReturnValue(of(''));
    pipe = new LocaleDateTimePipe(localeService);
    expect(pipe).toBeTruthy();
  });

  describe('LocaleDateTimePipe', () => {
    test('should use locale de-DE for formatting date', () => {
      jest.spyOn(localeService, 'currentBrowserLocale').mockReturnValue(of('de-DE'));
      registerLocaleData(localeDe);
      pipe = new LocaleDateTimePipe(localeService);
      const today = moment(new Date('February 1, 2020').valueOf());
      const transform = pipe.transform(today);
      expect(transform).toBe('01.02.20');
    });

    test('should use locale en-US for formatting date', () => {
      jest.spyOn(localeService, 'currentBrowserLocale').mockReturnValue(of('en-US'));
      pipe = new LocaleDateTimePipe(localeService);
      const today = moment(new Date('February 1, 2020').valueOf());
      const transform = pipe.transform(today);
      expect(transform).toBe('2/1/20');
    });

    test('should use default locale', () => {
      jest.spyOn(localeService, 'currentBrowserLocale').mockReturnValue(of('en-US'));
      pipe = new LocaleDateTimePipe(localeService);
      const today = moment(new Date('February 1, 2020').valueOf());
      const transform = pipe.transform(today);
      expect(transform).toBe('2/1/20');
    });

    test('should fail if locale data is not present', () => {
      jest.spyOn(localeService, 'currentBrowserLocale').mockReturnValue(of('fr-BE'));
      pipe = new LocaleDateTimePipe(localeService);
      const today = moment(new Date('February 1, 2020').valueOf());
      try {
        pipe.transform(today);
      } catch (e) {
        expect(e).toHaveProperty('message', 'NG0701: Missing locale data for the locale "fr-BE".');
      }
    });

    test('should fail for invalid date ', () => {
      jest.spyOn(localeService, 'currentBrowserLocale').mockReturnValue(of(''));
      pipe = new LocaleDateTimePipe(localeService);
      try {
        pipe.transform(undefined);
      } catch (e) {
        expect(e).toHaveProperty('message', 'Unable to convert "undefined" into a date');
      }
    });
  });
});
