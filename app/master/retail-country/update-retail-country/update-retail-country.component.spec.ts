import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRetailCountryComponent } from './update-retail-country.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MasterRetailCountryService } from '../../services/master-retail-country/master-retail-country.service';
import { Spy, createSpyFromClass } from 'jest-auto-spies';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { getMasterRetailCountriesMock } from '../../services/master-retail-country/master-retail-country.mock';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestingModule } from '../../../testing/testing.module';
import { of } from 'rxjs';

class ActivatedRouteStub {
  paramMap = of({
    get: (value: any) => {
      return value === 'id' ? 'GB' : null;
    }
  });
}

describe('UpdateRetailCountryComponent', () => {
  let component: UpdateRetailCountryComponent;
  let fixture: ComponentFixture<UpdateRetailCountryComponent>;
  let retailCountryServiceSpy: Spy<MasterRetailCountryService>;
  let routerSpy: Spy<Router>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  const retailCountriesMock = getMasterRetailCountriesMock();

  beforeEach(async () => {
    retailCountryServiceSpy = createSpyFromClass(MasterRetailCountryService);
    retailCountryServiceSpy.get.nextWith(retailCountriesMock.retailCountries[0]);
    retailCountryServiceSpy.update.nextWith();
    routerSpy = createSpyFromClass(Router);
    routerSpy.navigateByUrl.mockReturnValue('');
    snackBarServiceSpy = createSpyFromClass(SnackBarService);

    await TestBed.configureTestingModule({
      declarations: [UpdateRetailCountryComponent],
      imports: [MatInputModule, NoopAnimationsModule, ReactiveFormsModule, TestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: MasterRetailCountryService, useValue: retailCountryServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateRetailCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initRetailCountryForm()', () => {
    it('should have retail country fields', done => {
      expect(component.retailCountryForm.controls['id']).toBeTruthy();
      expect(component.retailCountryForm.controls['name']).toBeTruthy();
      done();
    });
  });

  describe('submit()', () => {
    beforeEach(() => {
      component.submit(retailCountriesMock.retailCountries[0]);
    });

    it('should update the retail country', () => {
      expect(retailCountryServiceSpy.update).toHaveBeenCalledWith(
        retailCountriesMock.retailCountries[0]
      );
    });

    it('should give a success message', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('UPDATE_RETAIL_COUNTRY_SUCCESS');
    });

    it('should give an error message', () => {
      const error = new Error('Error!');
      retailCountryServiceSpy.update.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });
});
