import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { Country } from '../../../../geography/country/country.model';
import { CountryService } from '../../../../geography/country/country.service';
import { Language } from '../../../../geography/language/language.model';
import { LanguageService } from '../../../../geography/language/language.service';

import { ActiveLanguage, ActiveLanguageService } from './active-language.service';

@Component({
  selector: 'gp-language-toggle',
  templateUrl: './language-toggle.component.html',
  styleUrls: ['./language-toggle.component.scss']
})
export class LanguageToggleComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  countryId: string;
  @Input()
  defaultLanguageId: string;

  selectedLanguage: ActiveLanguage;
  countryLanguages: Observable<string[]>;
  languages: Observable<Map<string, Language>>;

  private unsubscribe = new Subject<void>();

  constructor(
    private countryService: CountryService,
    private languageService: LanguageService,
    private activeLanguageService: ActiveLanguageService
  ) {}

  ngOnInit(): void {
    this.initLanguages();
    this.initCountryLanguages();
    this.activeLanguageService
      .get()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(activeLanguage => (this.selectedLanguage = activeLanguage));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.countryId) {
      this.initLanguages();
      this.initCountryLanguages();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  changeLanguage(languageId: string): void {
    if (!languageId) {
      return;
    }
    this.activeLanguageService.update({
      isDefaultLanguage: this.defaultLanguageId === languageId,
      languageId: languageId
    });
  }

  private initLanguages(): void {
    this.languages = this.languageService.getAllAsMap();
  }

  private initCountryLanguages(): void {
    this.countryLanguages = this.countryService
      .get(this.countryId)
      .pipe(map((country: Country) => (country.languages ? country.languages : [])));
  }
}
