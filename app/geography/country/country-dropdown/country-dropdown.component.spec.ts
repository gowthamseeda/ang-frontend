import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { TranslateDataPipe } from '../../../shared/pipes/translate-data/translate-data.pipe';
import { TestingModule } from '../../../testing/testing.module';
import { getCountriesMock } from '../country.mock';
import { CountryService } from '../country.service';

import { CountryDropdownComponent } from './country-dropdown.component';

function getFormGroup(): FormGroup {
  return new FormBuilder().group({});
}

@Component({
  template: '<gp-country-dropdown [parentForm]="parentForm"></gp-country-dropdown>'
})
class TestComponent {
  @ViewChild(CountryDropdownComponent)
  public countryDropdownComponent: CountryDropdownComponent;
  formControl = new FormControl('');
  parentForm = getFormGroup();
}

describe('CountryDropdownComponent', () => {
  const countriesMock = getCountriesMock();
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let countryServiceSpy: Spy<CountryService>;

  beforeEach(
    waitForAsync(() => {
      countryServiceSpy = createSpyFromClass(CountryService);

      const translateServiceMock = {
        onLangChange: of('de-DE')
      };

      TestBed.configureTestingModule({
        declarations: [CountryDropdownComponent, TestComponent, TranslateDataPipe],
        imports: [MatSelectModule, ReactiveFormsModule, NoopAnimationsModule, TestingModule],
        providers: [
          { provide: CountryService, useValue: countryServiceSpy },
          { provide: TranslateService, useValue: translateServiceMock }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load all countries', done => {
      countryServiceSpy.getAllForUserDataRestrictions.nextWith(countriesMock.countries);
      fixture.detectChanges();

      component.countryDropdownComponent.countries.subscribe(countries => {
        expect(countries).toEqual(countriesMock.countries);
        done();
      });
    });

    it('should load sorted countries', done => {
      countryServiceSpy.getAllForUserDataRestrictions.nextWith(countriesMock.countries);
      fixture.detectChanges();

      component.countryDropdownComponent.countries.subscribe(() => {
        expect('Switzerland').toEqual(countriesMock.countries[0].name);
        done();
      });
    });

    it('should keep the countries empty when an error is thrown', done => {
      countryServiceSpy.getAllForUserDataRestrictions.throwWith('some error');
      fixture.detectChanges();

      component.countryDropdownComponent.countries.subscribe(response => {
        expect(response).toEqual([]);
        done();
      });
    });
  });
});
