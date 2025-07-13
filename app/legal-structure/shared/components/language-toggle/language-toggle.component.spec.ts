import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { getCountryChMock } from '../../../../geography/country/country.mock';
import { CountryService } from '../../../../geography/country/country.service';
import { languageMockMap } from '../../../../geography/language/language.mock';
import { LanguageService } from '../../../../geography/language/language.service';

import { ActiveLanguage, ActiveLanguageService } from './active-language.service';
import { LanguageToggleComponent } from './language-toggle.component';

@Component({
  template: ` <mat-button-toggle></mat-button-toggle> `
})
class TestMatButtonToggleComponent {}

describe('LanguageToggleComponent', () => {
  let component: LanguageToggleComponent;
  let fixture: ComponentFixture<LanguageToggleComponent>;

  const countryMockCH = getCountryChMock();

  let countryServiceSpy: Spy<CountryService>;
  let languageServiceSpy: Spy<LanguageService>;
  let activeLanguageServiceSpy: Spy<ActiveLanguageService>;

  let matButtonToggleComponent: TestMatButtonToggleComponent;
  let matButtonToggleFixture: ComponentFixture<TestMatButtonToggleComponent>;
  let matButtonToggleEl: DebugElement;

  beforeEach(
    waitForAsync(() => {
      countryServiceSpy = createSpyFromClass(CountryService);
      countryServiceSpy.get.nextWith(countryMockCH);

      languageServiceSpy = createSpyFromClass(LanguageService);
      languageServiceSpy.getAllAsMap.nextWith(languageMockMap);

      activeLanguageServiceSpy = createSpyFromClass(ActiveLanguageService);
      activeLanguageServiceSpy.get.nextWith({ isDefaultLanguage: true });

      TestBed.configureTestingModule({
        declarations: [LanguageToggleComponent, TestMatButtonToggleComponent],
        providers: [
          { provide: CountryService, useValue: countryServiceSpy },
          { provide: LanguageService, useValue: languageServiceSpy },
          { provide: ActiveLanguageService, useValue: activeLanguageServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageToggleComponent);
    component = fixture.componentInstance;

    matButtonToggleFixture = TestBed.createComponent(TestMatButtonToggleComponent);
    matButtonToggleComponent = matButtonToggleFixture.componentInstance;
    matButtonToggleEl = matButtonToggleFixture.debugElement.query(By.css('mat-button-toggle'));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(matButtonToggleComponent).toBeTruthy();
    expect(matButtonToggleEl).toBeTruthy();
  });

  describe('changeLanguage()', () => {
    it('should update the active language when the language toggle has changed', () => {
      const activeLanguage: ActiveLanguage = { isDefaultLanguage: false, languageId: 'fr-CH' };
      component.defaultLanguageId = 'de-CH';
      fixture.detectChanges();
      activeLanguageServiceSpy.get.nextWith(activeLanguage);

      component.changeLanguage('fr-CH');
      expect(activeLanguageServiceSpy.update).toHaveBeenNthCalledWith(1, activeLanguage);
      expect(component.selectedLanguage).toBe(activeLanguage);
    });

    it('should reset the active language if the language toggle is set to outlet initial language', () => {
      const activeLanguage: ActiveLanguage = { isDefaultLanguage: true, languageId: 'de-CH' };
      component.defaultLanguageId = 'de-CH';
      fixture.detectChanges();
      activeLanguageServiceSpy.get.nextWith(activeLanguage);

      component.changeLanguage('de-CH');
      expect(activeLanguageServiceSpy.update).toHaveBeenNthCalledWith(1, activeLanguage);
      expect(component.selectedLanguage).toBe(activeLanguage);
    });
  });
});
