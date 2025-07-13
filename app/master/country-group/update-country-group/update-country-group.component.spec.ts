import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { MasterCountryService } from '../../country/master-country/master-country.service';
import {
  getMasterCountryGroupMock,
  getMasterCountryGroupsMock
} from '../../services/master-country-group/master-country-group.mock';
import { MasterCountryGroupService } from '../../services/master-country-group/master-country-group.service';

import { UpdateCountryGroupComponent } from './update-country-group.component';

class ActivatedRouteStub {
  paramMap = of({
    get: (value: any) => {
      return value === 'id' ? '1' : null;
    }
  });
}

describe('UpdateCountryGroupComponent', () => {
  const countryGroupsMock = getMasterCountryGroupsMock();

  let component: UpdateCountryGroupComponent;
  let fixture: ComponentFixture<UpdateCountryGroupComponent>;
  let countryGroupServiceSpy: Spy<MasterCountryGroupService>;
  let routerSpy: Spy<Router>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let countryServiceSpy: Spy<MasterCountryService>;

  beforeEach(
    waitForAsync(() => {
      countryGroupServiceSpy = createSpyFromClass(MasterCountryGroupService);
      countryGroupServiceSpy.get.nextWith(getMasterCountryGroupMock());
      countryGroupServiceSpy.update.nextWith({});
      countryServiceSpy = createSpyFromClass(MasterCountryService);
      routerSpy = createSpyFromClass(Router);
      routerSpy.navigateByUrl.mockReturnValue('');
      snackBarServiceSpy = createSpyFromClass(SnackBarService);

      countryServiceSpy.getAll.nextWith([
        {
          id: 'CH',
          name: 'Switzerland',
          languages: ['de-CH', 'fr-CH']
        }
      ]);

      TestBed.configureTestingModule({
        declarations: [UpdateCountryGroupComponent],
        imports: [
          MatInputModule,
          MatSelectModule,
          NoopAnimationsModule,
          ReactiveFormsModule,
          TestingModule
        ],
        providers: [
          { provide: MasterCountryService, useValue: countryServiceSpy },
          { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
          { provide: MasterCountryGroupService, useValue: countryGroupServiceSpy },
          { provide: Router, useValue: routerSpy },
          { provide: SnackBarService, useValue: snackBarServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCountryGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit()', () => {
    beforeEach(() => {
      component.submit(countryGroupsMock.countryGroups[0]);
    });

    it('should update the countryGroup', () => {
      expect(countryGroupServiceSpy.update).toHaveBeenCalledWith(
        '1',
        countryGroupsMock.countryGroups[0]
      );
    });

    it('should give a success message', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('UPDATE_COUNTRY_GROUP_SUCCESS');
    });

    it('should give an error message', () => {
      const error = new Error('Error!');
      countryGroupServiceSpy.update.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });

  describe('initCountryGroupForm()', () => {
    it('should have country group fields', done => {
      expect(component.countryGroupForm.controls['id']).toBeTruthy();
      expect(component.countryGroupForm.controls['name']).toBeTruthy();
      expect(component.countryGroupForm.controls['countryIds']).toBeTruthy();
      expect(component.countryGroupForm.controls['translations']).toBeTruthy();
      done();
    });
  });
});
