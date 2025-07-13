import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import {
  getCountryChMock,
  getCountryChMockWithTranslations
} from '../../../../geography/country/country.mock';
import { CountryService } from '../../../../geography/country/country.service';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';

import { CountryComponent } from './country.component';

function getFormMock() {
  return new FormBuilder().group({
    countryId: ''
  });
}

describe('CountryComponent', () => {
  const countryMockCH = getCountryChMock();

  let component: CountryComponent;
  let fixture: ComponentFixture<CountryComponent>;

  let countryServiceSpy: Spy<CountryService>;

  const translateServiceMock = {
    onLangChange: of('de-CH'),
    currentLang: 'de-CH'
  };

  beforeEach(
    waitForAsync(() => {
      countryServiceSpy = createSpyFromClass(CountryService);
      countryServiceSpy.get.nextWith(getCountryChMock());

      TestBed.configureTestingModule({
        declarations: [CountryComponent, TranslatePipeMock],
        providers: [
          { provide: CountryService, useValue: countryServiceSpy },
          { provide: TranslateService, useValue: translateServiceMock }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryComponent);
    component = fixture.componentInstance;
    component.parentForm = getFormMock();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should translate country name when country does not have translations', () => {
    countryServiceSpy.get.nextWith(countryMockCH);
    fixture.detectChanges();
    expect(component.parentForm.controls['countryName'].value).toBe('Switzerland (CH)');
  });

  it('should translate country name when country does have translations', () => {
    countryServiceSpy.get.nextWith(getCountryChMockWithTranslations());
    fixture.detectChanges();
    expect(component.parentForm.controls['countryName'].value).toBe('Schweiz (CH)');
  });
});
