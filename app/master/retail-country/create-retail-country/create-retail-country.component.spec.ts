import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRetailCountryComponent } from './create-retail-country.component';
import { Spy, createSpyFromClass } from 'jest-auto-spies';
import { MasterRetailCountryService } from '../../services/master-retail-country/master-retail-country.service';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { TestingModule } from '../../../testing/testing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getMasterRetailCountriesMock } from '../../services/master-retail-country/master-retail-country.mock';

describe('CreateRetailCountryComponent', () => {
  const retailCountriesMock = getMasterRetailCountriesMock();

  let component: CreateRetailCountryComponent;
  let fixture: ComponentFixture<CreateRetailCountryComponent>;
  let retailCountryServiceSpy: Spy<MasterRetailCountryService>;
  let routerSpy: Spy<Router>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(async () => {
    retailCountryServiceSpy = createSpyFromClass(MasterRetailCountryService);
    retailCountryServiceSpy.create.nextWith();
    routerSpy = createSpyFromClass(Router);
    routerSpy.navigateByUrl.mockReturnValue('');
    snackBarServiceSpy = createSpyFromClass(SnackBarService);

    await TestBed.configureTestingModule({
      declarations: [CreateRetailCountryComponent],
      imports: [MatInputModule, NoopAnimationsModule, ReactiveFormsModule, TestingModule],
      providers: [
        { provide: MasterRetailCountryService, useValue: retailCountryServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateRetailCountryComponent);
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

    it('should create the retail country', () => {
      expect(retailCountryServiceSpy.create).toHaveBeenCalledWith(
        retailCountriesMock.retailCountries[0]
      );
    });

    it('should give a success message', () => {
      retailCountryServiceSpy.create.nextWith();
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('CREATE_RETAIL_COUNTRY_SUCCESS');
    });

    it('should give an error message', () => {
      const error = new Error('Error!');
      retailCountryServiceSpy.create.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });
});
