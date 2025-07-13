import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { NgxPermissionsAllowStubDirective } from 'ngx-permissions';

import { UserService } from '../../../iam/user/user.service';
import {
  SearchFilter,
  SearchFilterFlag,
  SearchFilterTag
} from '../../../search/models/search-filter.model';
import { SearchItem } from '../../../search/models/search-item.model';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { DistributionLevelsService } from '../../../traits/distribution-levels/distribution-levels.service';
import { getOutletMock } from '../../shared/models/outlet.mock';
import { Outlet } from '../../shared/models/outlet.model';
import { OutletService } from '../../shared/services/outlet.service';

import { CreateOutletComponent } from './create-outlet.component';
import { MatDialog } from '@angular/material/dialog';

@NgModule()
export class FixNavigationTriggeredOutsideAngularZoneNgModule {
  constructor(_router: Router) {
  }
}

describe('CreateOutletComponent', () => {
  const error: Error = new Error('specific error message');
  const outlet: Outlet = getOutletMock();

  let component: CreateOutletComponent;
  let fixture: ComponentFixture<CreateOutletComponent>;
  let outletServiceSpy: Spy<OutletService>;
  let userServiceSpy: Spy<UserService>;
  let distributionLevelsServiceSpy: Spy<DistributionLevelsService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let matDialogSpy: Spy<MatDialog>;
  let routerSpy: Spy<Router>;

  beforeEach(waitForAsync(() => {
    userServiceSpy = createSpyFromClass(UserService);
    userServiceSpy.getCountryRestrictions.nextWith([]);
    userServiceSpy.getRoles.nextWith([]);
    outletServiceSpy = createSpyFromClass(OutletService);
    distributionLevelsServiceSpy = createSpyFromClass(DistributionLevelsService);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    matDialogSpy = createSpyFromClass(MatDialog);
    routerSpy = createSpyFromClass(Router);

    TestBed.configureTestingModule({
      declarations: [CreateOutletComponent, NgxPermissionsAllowStubDirective],
      imports: [
        MatInputModule,
        MatSnackBarModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        FixNavigationTriggeredOutsideAngularZoneNgModule
      ],
      providers: [
        { provide: OutletService, useValue: outletServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: DistributionLevelsService, useValue: distributionLevelsServiceSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initSearchFilter', () => {
    const defaultSearchFilters: SearchFilter[] = [
      new SearchFilterFlag('registeredOffice'),
      new SearchFilterFlag('activeOrInPlanning'),
      new SearchFilterTag('type=BusinessSite')
    ];

    it('should add all country restrictions as search filter', done => {
      userServiceSpy.getCountryRestrictions.nextWith(['GE', 'GB']);

      component.searchFilters.subscribe(searchFilters => {
        expect(searchFilters).toContainEqual(new SearchFilterTag('countryId=GE GB'));
        done();
      });
    });

    it('should set the default search filters when the country restrictions are empty', done => {
      userServiceSpy.getCountryRestrictions.nextWith([]);

      component.searchFilters.subscribe(searchFilters => {
        expect(searchFilters).toEqual(defaultSearchFilters);
        done();
      });
    });

    it('should set the default search filters when there is an error retrieving any restrictions', done => {
      userServiceSpy.getCountryRestrictions.throwWith('error');

      component.searchFilters.subscribe(searchFilters => {
        expect(searchFilters).toEqual(defaultSearchFilters);
        done();
      });
    });
  });

  describe('submitOutlet()', () => {

    beforeEach(() => {
      component.outlet = outlet;
      component.outletForm.patchValue(outlet);
    });

    it('should call the success route on success', () => {
      outletServiceSpy.createWithDistributionLevels.nextWith('GS00000001');
      component.submitOutlet();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/outlet/GS00000001');
    });

    it('should trigger an error message when an error is thrown', () => {
      outletServiceSpy.createWithDistributionLevels.throwWith(error);
      component.submitOutlet();
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
      expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('should reset outlet form', () => {
      component.outlet = outlet;
      component.outletForm.patchValue(outlet);
      const resetSpy = jest.spyOn(component.outletForm, 'reset');
      const patchValueSpy = jest.spyOn(component.outletForm, 'patchValue');

      component.reset();
      expect(resetSpy).toHaveBeenCalled();
      expect(patchValueSpy).toHaveBeenCalledWith(component.outlet);
    });
  });

  describe('search', () => {
    const searchItem = new SearchItem();
    searchItem.id = 'GS12345';
    searchItem.payload = { legalName: 'example company', countryId: 'DE', companyId: 'GS12345' };

    const foundOutlet: Outlet = {
      id: 'GS12345',
      legalName: 'example company',
      countryId: 'DE',
      companyId: 'GC12345',
      companyLegalName: 'example company name',
      address: {
        street: 'street',
        streetNumber: 'number',
        zipCode: 'zipCode',
        city: 'city',
        district: 'district',
        addressAddition: 'adressAddition'
      },
      affiliate: false
    };

    const emptyOutlet: Outlet = {
      id: '',
      legalName: '',
      countryId: '',
      companyId: '',
      companyLegalName: '',
      address: {
        street: '',
        streetNumber: '',
        zipCode: '',
        city: '',
        district: '',
        addressAddition: ''
      },
      affiliate: false
    };

    beforeEach(waitForAsync(() => {
      component.outlet = {
        companyId: ''
      };
    }));

    it('the company id should be set on searchItemRetrieved', () => {
      outletServiceSpy.getOrLoadBusinessSite.nextWith(foundOutlet);
      component.applyCompanyValues(searchItem);
      expect(component.outlet.companyId).toEqual(foundOutlet.companyId);
    });

    it('the company id should not be set when required data is missing', () => {
      outletServiceSpy.getOrLoadBusinessSite.nextWith(emptyOutlet);
      const searchItemIncomplete = Object.assign({}, searchItem);
      searchItemIncomplete.payload = null;
      component.applyCompanyValues(searchItemIncomplete);
      expect(component.outlet.companyId).toEqual('');
    });
  });

  describe('compareByCountryId', () => {
    it('should open the confirmation dialog if the country selected is different from its company', () => {
      component.outlet = outlet;
      component.outlet.countryId = 'MY';
      component.compareByCountryId('UK');
      expect(matDialogSpy.open).toHaveBeenCalled();
    });

    it('should not open the confirmation dialog if the country selected is same as its company', () => {
      component.outlet = outlet;
      component.outlet.countryId = 'UK';
      component.compareByCountryId('UK');
      expect(matDialogSpy.open).not.toHaveBeenCalled();
    });
  });

  describe('check test outlet user', () => {
    it('should return true when user is a test outlet user', () => {
      userServiceSpy.getRoles.nextWith(['GSSNPLUS.TestOutletUser']);
      component.checkTestOutletUser();
      expect(component.testOutlet).toBeTruthy();
    });

    it('should return false when user is not a test outlet user', () => {
      userServiceSpy.getRoles.nextWith(['GSSNPLUS.ProductResponsible']);
      component.checkTestOutletUser();
      expect(component.testOutlet).toBeFalsy();
    });
  });
});
