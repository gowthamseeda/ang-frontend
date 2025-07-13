import { OverlayModule } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { Observable, of } from 'rxjs';

import { SnackBarService } from '../../../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../../../testing/testing.module';
import { MasterBrandMock } from '../../../../brand/master-brand/master-brand.mock';
import { MasterBrandService } from '../../../../brand/master-brand/master-brand.service';
import { MasterCountryMock } from '../../../../country/master-country/master-country.mock';
import { MasterCountryService } from '../../../../country/master-country/master-country.service';
import { MasterProductGroupMock } from '../../../../product-group/master-product-group/master-product-group.mock';
import { MasterProductGroupService } from '../../../../product-group/master-product-group/master-product-group.service';
import { MasterServiceMock } from '../../../master-service/master-service.mock';
import { MasterServiceService } from '../../../master-service/master-service.service';
import { MasterServiceVariantMock } from '../../master-service-variant/master-service-variant.mock';
import {
  MasterServiceVariant,
  MasterServiceVariantUpdate
} from '../../master-service-variant/master-service-variant.model';
import { MasterServiceVariantService } from '../../master-service-variant/master-service-variant.service';
import { MasterServiceVariantResponse } from '../../models/service-variant-configure.model';
import { ServiceVariantRouteDataService } from '../../services/service-variant-route-data.service';

import { MasterCountry } from '../../../../country/master-country/master-country.model';
import { ConfigureServiceVariantComponent } from './configure-service-variant.component';

class MockServiceVariantService {
  createOrUpdate(): Observable<any> {
    return of([]);
  }
  getBy(): Observable<MasterServiceVariant> {
    return of(MasterServiceVariantMock.asList()[0]);
  }
}

class MockCountryService {
  getAll(): Observable<MasterCountry[]> {
    return of(MasterCountryMock.asList());
  }
}

class MockServiceVariantRouteDataService {
  selectedServiceVariantIds = [1, 2];
}

describe('ConfigureServiceVariantComponent', () => {
  const countryMock = MasterCountryMock.asList();
  const serviceMock = MasterServiceMock.asList();
  const brandMock = MasterBrandMock.asList();
  const productGroupMock = MasterProductGroupMock.asList();

  let component: ConfigureServiceVariantComponent;
  let fixture: ComponentFixture<ConfigureServiceVariantComponent>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let brandServiceSpy: Spy<MasterBrandService>;
  let serviceServiceSpy: Spy<MasterServiceService>;
  let productGroupServiceSpy: Spy<MasterProductGroupService>;
  let routerSpy: Spy<Router>;

  beforeEach(waitForAsync(() => {
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    brandServiceSpy = createSpyFromClass(MasterBrandService);
    serviceServiceSpy = createSpyFromClass(MasterServiceService);
    productGroupServiceSpy = createSpyFromClass(MasterProductGroupService);
    routerSpy = createSpyFromClass(Router);

    TestBed.configureTestingModule({
      declarations: [ConfigureServiceVariantComponent],
      imports: [TestingModule, OverlayModule],
      providers: [
        { provide: MasterServiceVariantService, useClass: MockServiceVariantService },
        { provide: ServiceVariantRouteDataService, useClass: MockServiceVariantRouteDataService },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: MasterCountryService, useClass: MockCountryService },
        { provide: MasterBrandService, useValue: brandServiceSpy },
        { provide: MasterServiceService, useValue: serviceServiceSpy },
        { provide: MasterProductGroupService, useValue: productGroupServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    TestBed.inject(MasterCountryService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureServiceVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize', done => {
      expect(component.initPristineCountriesId).toBeTruthy();
      expect(component.initDataDisplay).toBeTruthy();
      expect(component.resetErrorMessage).toBeTruthy();

      expect(component.saveButtonDisabled).toEqual(true);
      expect(component.errorMessage).toEqual('');
      done();
    });
  });

  describe('restrictedCountries', () => {
    it('get countries id', done => {
      component.restrictedCountries([countryMock[0]]);

      expect(component.countryRestrictionIds).toEqual(['GB']);
      done();
    });
  });

  describe('cancel', () => {
    it('cancel existing input', done => {
      const resetErrorMessageSpy = jest.spyOn(component, 'resetErrorMessage');
      const initDataDisplaySpy = jest.spyOn(component, 'initDataDisplay');

      component.cancel();
      expect(resetErrorMessageSpy).toBeCalled();
      expect(initDataDisplaySpy).toBeCalled();
      done();
    });
  });

  describe('serviceVariantToUpdate', () => {
    it('serviceVariantToUpdate', done => {
      const serviceVariants: MasterServiceVariantUpdate = {
        brandId: 'MB',
        countryRestrictions: ['GB'],
        productCategoryId: 1,
        productGroupId: 'PC',
        serviceId: 120,
        active: false
      };
      component.serviceVariantToUpdate([serviceVariants]);
      expect(component.serviceVariants).toEqual([serviceVariants]);
      done();
    });
  });

  describe('transformErrorMessage', () => {
    it('convert object to string message', done => {
      jest.spyOn(serviceServiceSpy, 'getBy').mockReturnValue(of(serviceMock[0]));
      jest.spyOn(brandServiceSpy, 'getBy').mockReturnValue(of(brandMock[0]));
      jest.spyOn(productGroupServiceSpy, 'getBy').mockReturnValue(of(productGroupMock[0]));
      const serviceVariants: MasterServiceVariantResponse = {
        brandId: 'MB',
        productCategoryId: 1,
        productGroupId: 'PC',
        serviceId: 1,
        message: ['not found']
      };

      const result = component.transformErrorMessage([serviceVariants]);
      expect(result).toEqual(`Body Repair | Mercedes-Benz | Passenger Car\n: not found\n\n`);
      done();
    });
  });

  describe('canDeactivate', () => {
    it('should return true if save and cancel buttons are disabled', () => {
      component.saveButtonDisabled = true;

      const canDeactivate = component.canDeactivate();
      expect(canDeactivate).toBeTruthy();
    });

    it('should return false if save and cancel buttons are enabled', () => {
      component.saveButtonDisabled = false;

      const canDeactivate = component.canDeactivate();
      expect(canDeactivate).toBeFalsy();
    });
  });
});
