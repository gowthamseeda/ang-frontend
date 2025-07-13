import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { MasterCountryMock } from '../master-country/master-country.mock';
import { MasterCountryService } from '../master-country/master-country.service';
import { MasterLanguageService } from '../../language/master-language/master-language.service';
import { TimezoneService } from '../timezone.service';

import { CreateCountryComponent } from './create-country.component';

describe('CreateCountryComponent', () => {
  const countryMock = MasterCountryMock.asList();

  let component: CreateCountryComponent;
  let fixture: ComponentFixture<CreateCountryComponent>;
  let countryServiceSpy: Spy<MasterCountryService>;
  let languageServiceSpy: Spy<MasterLanguageService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let routerSpy: Spy<Router>;
  let timezoneServiceSpy: Spy<TimezoneService>;

  beforeEach(
    waitForAsync(() => {
      countryServiceSpy = createSpyFromClass(MasterCountryService);
      countryServiceSpy.create.nextWith();
      languageServiceSpy = createSpyFromClass(MasterLanguageService);
      languageServiceSpy.getAll.nextWith([]);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);
      routerSpy = createSpyFromClass(Router);
      timezoneServiceSpy = createSpyFromClass(TimezoneService);
      timezoneServiceSpy.getTimezones.nextWith([]);

      TestBed.configureTestingModule({
        declarations: [CreateCountryComponent],
        imports: [
          MatInputModule,
          MatSelectModule,
          NoopAnimationsModule,
          ReactiveFormsModule,
          TestingModule
        ],
        providers: [
          { provide: MasterCountryService, useValue: countryServiceSpy },
          { provide: MasterLanguageService, useValue: languageServiceSpy },
          { provide: SnackBarService, useValue: snackBarServiceSpy },
          { provide: Router, useValue: routerSpy },
          { provide: TimezoneService, useValue: timezoneServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should find language name by language id', () => {
    const expectedLanguage = component.languages.find(language => language.id === 'de-DE');
    expect(component.languageBy('de-DE')).toEqual(expectedLanguage);
  });

  describe('submit()', () => {
    beforeEach(() => {
      component.submit(countryMock[0]);
    });

    it('should be able to create the country', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('CREATE_COUNTRY_SUCCESS');
    });

    it('should not be able to create the country', () => {
      const error = new Error('Error!');
      countryServiceSpy.create.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });

  describe('change()', () => {
    it('should reset default language dropdown', () => {
      component.change();
      expect(component.countryForm.controls['defaultLanguageId'].value).toEqual('');
    });

    it('should be able to select one language from the language dropdown', () => {
      component.countryForm.controls['languages'].setValue(['de-DE']);
      component.change();
      expect(component.countryForm.controls['languages'].value).toEqual(['de-DE']);
    });

    it('should not be able to select more than 2 languages from the language dropdown', () => {
      component.countryForm.controls['languages'].setValue(['de-DE', 'en-US', 'zh-CN']);
      component.languageSelections = ['de-DE', 'en-US'];
      component.change();
      expect(component.countryForm.controls['languages'].value).toEqual(['de-DE', 'en-US']);
    });
  });
});
