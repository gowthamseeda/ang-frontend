import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MasterLanguage } from 'app/master/language/master-language/master-language.model';
import { MasterLanguageService } from 'app/master/language/master-language/master-language.service';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { MasterCountry } from '../master-country/master-country.model';
import { MasterCountryService } from '../master-country/master-country.service';
import { Timezone } from '../timezone.model';
import { TimezoneService } from '../timezone.service';

@Component({
  selector: 'gp-create-country',
  templateUrl: './create-country.component.html',
  styleUrls: ['./create-country.component.scss']
})
export class CreateCountryComponent implements OnInit {
  countryForm: UntypedFormGroup;
  languages: MasterLanguage[];
  languageSelections: string[];
  timezones: Timezone[];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private countryService: MasterCountryService,
    private languageService: MasterLanguageService,
    private router: Router,
    private snackBarService: SnackBarService,
    private timezoneService: TimezoneService
  ) {}

  ngOnInit(): void {
    this.initLanguages();
    this.initTimezones();
    this.initCountryForm();
  }

  submit(country: MasterCountry): void {
    this.countryService.create(this.timezoneService.convertUtcToNumber(country)).subscribe(
      () => {
        this.countryService.clearCacheAndFetchAll();
        this.router.navigateByUrl('/master');
        this.snackBarService.showInfo('CREATE_COUNTRY_SUCCESS');
      },
      error => {
        this.snackBarService.showError(error);
      }
    );
  }

  change(): void {
    const languageFormControl = <UntypedFormControl>this.countryForm.get('languages');
    const defaultLanguageFormControl = <UntypedFormControl>this.countryForm.get('defaultLanguageId');

    if (languageFormControl.value.length < 3) {
      defaultLanguageFormControl.setValue('');
      this.languageSelections = languageFormControl.value;
    } else {
      languageFormControl.setValue(this.languageSelections);
    }
  }

  languageBy(languageId: string): MasterLanguage | undefined {
    return this.languages.find(language => language.id === languageId);
  }

  private initLanguages(): void {
    this.languageService.getAll().subscribe((languages: MasterLanguage[]) => {
      this.languages = languages;
    });
  }

  private initTimezones(): void {
    this.timezoneService.getTimezones().subscribe((timezones: Timezone[]) => {
      this.timezones = timezones;
    });
  }

  private initCountryForm(): void {
    this.countryForm = this.formBuilder.group({
      id: [
        '',
        [
          Validators.minLength(2),
          Validators.maxLength(2),
          Validators.pattern('[A-Z]*'),
          Validators.required
        ]
      ],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      languages: [''],
      defaultLanguageId: [''],
      timeZone: [''],
      classicCountryId: [{ value: '', disabled: true }]
    });
  }
}
