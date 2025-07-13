import { registerLocaleData } from '@angular/common';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const DEFAULT_LOCALE = 'en-US';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private browserLocaleSubject = new BehaviorSubject<string>(DEFAULT_LOCALE);
  private translationLocaleSubject = new BehaviorSubject<string>(DEFAULT_LOCALE);

  constructor() {
    const locale = navigator.language;
    if (locale !== '' && locale !== DEFAULT_LOCALE) {
      this.importLocale(locale).then(() => {
        this.browserLocaleSubject.next(navigator.language);
      });
    }
  }

  initializeTranslationLocale(locale: string): void {
    if (locale !== '' && locale !== DEFAULT_LOCALE) {
      this.importLocale(locale).then(() => {
        this.translationLocaleSubject.next(locale);
      });
    }
  }

  currentBrowserLocale(): Observable<string> {
    return this.browserLocaleSubject;
  }

  currentTranslationLocale(): Observable<string> {
    return this.translationLocaleSubject.asObservable();
  }

  private importLocale(locale: string): Promise<void> {
    const localeId = this.extractLanguage(locale);
    /*
    const moduleName = `/node_modules/@angular/common/locales/${localeId}.js`
    return import(moduleName).then(module => {
      registerLocaleData(module.default);
    });*/

    return import(`@/../@angular/common/locales/${localeId}.mjs`).then(module => {
      registerLocaleData(module.default);
    });
  }

  private extractLanguage(locale: string): string {
    let localeId = locale;
    if (locale.indexOf('-') !== -1) {
      localeId = locale.substring(0, locale.indexOf('-'));
    }
    return localeId;
  }
}
