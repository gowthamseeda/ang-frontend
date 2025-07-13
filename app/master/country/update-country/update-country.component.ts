import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { MasterLanguage } from '../../language/master-language/master-language.model';
import { MasterLanguageService } from '../../language/master-language/master-language.service';
import { MasterCountryActivation } from '../../services/master-country-activation/master-country-activation.model';
import { MasterCountryActivationService } from '../../services/master-country-activation/master-country-activation.service';
import { MasterCountryTraits } from '../../services/master-country-traits/master-country-traits.model';
import { MasterCountryTraitsService } from '../../services/master-country-traits/master-country-traits.service';
import { MasterCountry } from '../master-country/master-country.model';
import { MasterCountryService } from '../master-country/master-country.service';
import { Timezone } from '../timezone.model';
import { TimezoneService } from '../timezone.service';

@Component({
  selector: 'gp-update-country',
  templateUrl: './update-country.component.html',
  styleUrls: ['./update-country.component.scss']
})
export class UpdateCountryComponent implements OnInit {
  countryForm: UntypedFormGroup;
  languages: MasterLanguage[];
  languageSelections: string[];
  id: string;
  countryName: string;
  timezones: Timezone[];
  countriesActivation: MasterCountryActivation[];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private countryService: MasterCountryService,
    private languageService: MasterLanguageService,
    private snackBarService: SnackBarService,
    private timezoneService: TimezoneService,
    private countryTraitsService: MasterCountryTraitsService,
    private countryActivationService: MasterCountryActivationService
  ) {}

  ngOnInit(): void {
    this.initLanguages();
    this.initTimezones();
    this.initCountryForm();
    this.getCountryIdByRouteParams().subscribe(() => {
      this.initCountry();
      this.initCountryTraits();
    });
  }

  submit(formValue: any): void {
    const {
      name,
      languages,
      defaultLanguageId,
      timeZone,
      classicCountryId,
      marketStructureEnabled,
      translations
    } = formValue;

    const country = new MasterCountry(
      this.id,
      name,
      languages,
      defaultLanguageId,
      translations,
      timeZone
    );
    const countryTraits = new MasterCountryTraits(country.id, classicCountryId);

    this.countryService
      .updateAll(
        this.timezoneService.convertUtcToNumber(country),
        countryTraits,
        this.countriesActivation,
        marketStructureEnabled
      )
      .subscribe(
        () => {
          this.countryService.clearCacheAndFetchAll();
          this.router.navigateByUrl('/master');
          this.snackBarService.showInfo('UPDATE_COUNTRY_SUCCESS');
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
    if (this.languages) {
      return this.languages.find(language => language.id === languageId);
    }
    return;
  }

  initCountryForm(): void {
    this.countryForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      languages: [''],
      defaultLanguageId: [''],
      timeZone: [''],
      classicCountryId: ['', [Validators.required, Validators.maxLength(10)]],
      marketStructureEnabled: new UntypedFormControl(false),
      translations: [{ value: {} }]
    });
  }

  private initLanguages(): void {
    this.languageService.getAll().subscribe((languages: MasterLanguage[]) => {
      this.languages = languages;
    });
  }

  private initCountry(): void {
    this.countryService.fetchBy(this.id).subscribe((country: MasterCountry) => {
      this.getLanguageSelections(country.languages);
      this.countryName = country.name;
      this.countryForm.patchValue({
        id: this.id,
        name: country.name,
        languages: country.languages,
        defaultLanguageId: country.defaultLanguageId,
        timeZone: this.timezoneService.convertNumberToUtc(country),
        marketStructureEnabled: this.enableMarketStructure(),
        translations: country.translations
      });
    });
  }

  private initCountryTraits(): void {
    this.countryTraitsService.get(this.id).subscribe(countryTraits => {
      if (countryTraits !== null) {
        this.countryForm.patchValue({
          classicCountryId: countryTraits.classicCountryId
        });
      }
    });
  }

  private initTimezones(): void {
    this.timezoneService.getTimezones().subscribe((timezones: Timezone[]) => {
      this.timezones = timezones;
    });
  }

  private getCountryIdByRouteParams(): Observable<string> {
    return this.route.paramMap.pipe(
      map((params: ParamMap) => {
        const id = params.get('id');
        return (this.id = id ? id : '');
      })
    );
  }

  private getLanguageSelections(languages: Array<string>): void {
    this.languageSelections = [];
    if (languages) {
      languages.forEach(lang => {
        this.languageSelections.push(lang);
      });
    }
  }

  private enableMarketStructure(): void {
    const marketStructureCheckbox = <UntypedFormControl>this.countryForm.get('marketStructureEnabled');

    this.countryActivationService
      .get()
      .subscribe((countriesActivation: MasterCountryActivation[]) => {
        if (countriesActivation) {
          this.countriesActivation = countriesActivation;
          if (this.countryService.checkCountryActivation(countriesActivation, this.id)) {
            marketStructureCheckbox.setValue(true);
          }
        }
      });
  }
}
