import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterLanguageService } from 'app/master/language/master-language/master-language.service';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { MasterCountryActivationService } from '../../services/master-country-activation/master-country-activation.service';
import { getMasterCountryTraitsMock } from '../../services/master-country-traits/master-country-traits.mock';
import { MasterCountryTraitsService } from '../../services/master-country-traits/master-country-traits.service';
import { getDECountryFormMock } from '../country-form.mock';
import { MasterCountryService } from '../master-country/master-country.service';
import { TimezoneService } from '../timezone.service';

import { UpdateCountryComponent } from './update-country.component';

class ActivatedRouteStub {
  paramMap = of({
    get: (value: any) => {
      return value === 'id' ? 'DE' : null;
    }
  });
}

describe('UpdateCountryComponent', () => {
  let component: UpdateCountryComponent;
  let fixture: ComponentFixture<UpdateCountryComponent>;
  let countryServiceSpy: Spy<MasterCountryService>;
  let languageServiceSpy: Spy<MasterLanguageService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let routerSpy: Spy<Router>;
  let timezoneServiceSpy: Spy<TimezoneService>;
  let countryTraitsServiceSpy: Spy<MasterCountryTraitsService>;
  let countryActivationServiceSpy: Spy<MasterCountryActivationService>;

  beforeEach(
    waitForAsync(() => {
      countryServiceSpy = createSpyFromClass(MasterCountryService);
      countryServiceSpy.fetchBy.nextWith(getDECountryFormMock());
      countryServiceSpy.updateAll.nextWith({});
      languageServiceSpy = createSpyFromClass(MasterLanguageService);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);
      routerSpy = createSpyFromClass(Router);
      timezoneServiceSpy = createSpyFromClass(TimezoneService);
      timezoneServiceSpy.getTimezones.nextWith([]);
      countryTraitsServiceSpy = createSpyFromClass(MasterCountryTraitsService);
      countryTraitsServiceSpy.get.nextWith(getMasterCountryTraitsMock());
      countryActivationServiceSpy = createSpyFromClass(MasterCountryActivationService);
      countryActivationServiceSpy.get.nextWith([]);

      languageServiceSpy.getAll.nextWith([]);

      TestBed.configureTestingModule({
        declarations: [UpdateCountryComponent],
        imports: [
          MatInputModule,
          MatSelectModule,
          MatCheckboxModule,
          NoopAnimationsModule,
          ReactiveFormsModule,
          TestingModule
        ],
        providers: [
          { provide: MasterCountryService, useValue: countryServiceSpy },
          { provide: MasterLanguageService, useValue: languageServiceSpy },
          { provide: SnackBarService, useValue: snackBarServiceSpy },
          { provide: Router, useValue: routerSpy },
          { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
          { provide: TimezoneService, useValue: timezoneServiceSpy },
          { provide: MasterCountryTraitsService, useValue: countryTraitsServiceSpy },
          { provide: MasterCountryActivationService, useValue: countryActivationServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCountryComponent);
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
      component.submit(getDECountryFormMock());
    });

    it('should be able to save the country', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('UPDATE_COUNTRY_SUCCESS');
    });

    it('should not be able to save the country', () => {
      const error = new Error('Error!');
      countryServiceSpy.updateAll.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });

  describe('change()', () => {
    it('should reset default language dropdown', () => {
      component.change();
      expect(component.countryForm.controls['defaultLanguageId'].value).toEqual('');
    });

    it('should be able to select one language from the language dropdown', () => {
      component.countryForm.controls['languages'].setValue(['en-UK']);
      component.change();
      expect(component.countryForm.controls['languages'].value).toEqual(['en-UK']);
    });

    it('should not be able to select more than 2 languages from the language dropdown', () => {
      component.countryForm.controls['languages'].setValue(['de-DE', 'en-UK', 'zh-CN']);
      component.languageSelections = ['de-DE', 'en-UK'];
      component.change();
      expect(component.countryForm.controls['languages'].value).toEqual(['de-DE', 'en-UK']);
    });
  });

  describe('initCountryForm()', () => {
    it('should have country fields', done => {
      expect(component.countryForm.controls['id']).toBeTruthy();
      expect(component.countryForm.controls['name']).toBeTruthy();
      expect(component.countryForm.controls['languages']).toBeTruthy();
      expect(component.countryForm.controls['defaultLanguageId']).toBeTruthy();
      expect(component.countryForm.controls['timeZone']).toBeTruthy();
      expect(component.countryForm.controls['classicCountryId']).toBeTruthy();
      expect(component.countryForm.controls['marketStructureEnabled']).toBeTruthy();
      expect(component.countryForm.controls['translations']).toBeTruthy();
      done();
    });
  });
});
