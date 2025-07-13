import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

import { Translatable } from '../../../shared/pipes/translate-data/translatable.model';
import { Country } from '../country.model';
import { CountryService } from '../country.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'gp-country-dropdown',
  templateUrl: './country-dropdown.component.html'
})
export class CountryDropdownComponent implements OnInit {
  @Input()
  parentForm: UntypedFormGroup;
  @Input()
  countryId: string;
  @Input()
  uppercaseLabel = false;
  @Input()
  placeholderTranslation = 'COUNTRY';
  @Input()
  allowEmptyOption = false;
  @Input()
  allowAllOption = false;
  @Input()
  required = true;
  @Output()
  selectionChange: EventEmitter<string> = new EventEmitter<string>();

  countries: Observable<Country[]>;
  currentSelectedLanguage = this.translateService.currentLang;

  private unsubscribe = new Subject<void>();

  constructor(private countryService: CountryService, private translateService: TranslateService) {}

  ngOnInit(): void {
    this.initCountryFormControl();
    this.initCountries();
    this.subscribeToLanguageChanges();
  }

  emitChange(changeEvent: MatSelectChange): void {
    this.selectionChange.emit(changeEvent.value);
  }

  private initCountryFormControl(): void {
    this.parentForm.addControl(
      'countryId',
      new UntypedFormControl(
        { value: this.countryId, disabled: this.parentForm.disabled },
        Validators.required
      )
    );
  }

  private initCountries(): void {
    this.countries = this.countryService.getAllForUserDataRestrictions().pipe(
      map((countries: Country[]) =>
        countries.sort(Translatable.sortByLang(this.currentSelectedLanguage))
      ),
      catchError(() => of([]))
    );
  }

  private subscribeToLanguageChanges(): void {
    this.translateService.onLangChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((event: TranslationChangeEvent) => {
        this.currentSelectedLanguage = event.lang;
        this.sortCountries();
      });
  }

  private sortCountries(): void {
    this.countries = this.countries.pipe(
      map((countries: Country[]) =>
        countries.sort(Translatable.sortByLang(this.currentSelectedLanguage))
      )
    );
  }
}
