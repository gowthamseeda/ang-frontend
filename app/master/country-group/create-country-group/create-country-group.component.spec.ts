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
import { MasterCountryService } from '../../country/master-country/master-country.service';
import { getMasterCountryGroupsMock } from '../../services/master-country-group/master-country-group.mock';
import { MasterCountryGroupService } from '../../services/master-country-group/master-country-group.service';

import { CreateCountryGroupComponent } from './create-country-group.component';

describe('CreateCountryGroupComponent', () => {
  const servicesMock = getMasterCountryGroupsMock();

  let component: CreateCountryGroupComponent;
  let fixture: ComponentFixture<CreateCountryGroupComponent>;
  let countryGroupServiceSpy: Spy<MasterCountryGroupService>;
  let countryServiceSpy: Spy<MasterCountryService>;
  let routerSpy: Spy<Router>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(
    waitForAsync(() => {
      countryServiceSpy = createSpyFromClass(MasterCountryService);
      countryServiceSpy.getAll.nextWith([
        {
          id: 'CH',
          name: 'Switzerland',
          languages: ['de-CH', 'fr-CH']
        }
      ]);
      countryGroupServiceSpy = createSpyFromClass(MasterCountryGroupService);
      countryGroupServiceSpy.create.nextWith({});
      routerSpy = createSpyFromClass(Router);
      routerSpy.navigateByUrl.mockReturnValue('');
      snackBarServiceSpy = createSpyFromClass(SnackBarService);

      TestBed.configureTestingModule({
        declarations: [CreateCountryGroupComponent],
        imports: [
          MatInputModule,
          MatSelectModule,
          NoopAnimationsModule,
          ReactiveFormsModule,
          TestingModule
        ],
        providers: [
          { provide: MasterCountryGroupService, useValue: countryGroupServiceSpy },
          { provide: MasterCountryService, useValue: countryServiceSpy },
          { provide: Router, useValue: routerSpy },
          { provide: SnackBarService, useValue: snackBarServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCountryGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit()', () => {
    beforeEach(() => {
      component.submit(servicesMock.countryGroups[0]);
    });

    it('should create the countryGroup', () => {
      expect(countryGroupServiceSpy.create).toHaveBeenCalledWith(servicesMock.countryGroups[0]);
    });

    it('should give a success message', () => {
      countryGroupServiceSpy.create.nextWith({});
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('CREATE_COUNTRY_GROUP_SUCCESS');
    });

    it('should give an error message', () => {
      const error = new Error('Error!');
      countryGroupServiceSpy.create.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });
});
