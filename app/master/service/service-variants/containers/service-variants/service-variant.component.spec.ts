import { OverlayModule } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { Observable, of } from 'rxjs';

import { SnackBarService } from '../../../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../../../testing/testing.module';
import { MasterService } from '../../../master-service/master-service.model';
import { MasterServiceService } from '../../../master-service/master-service.service';
import { MasterServiceVariant } from '../../master-service-variant/master-service-variant.model';
import { MasterServiceVariantService } from '../../master-service-variant/master-service-variant.service';
import { ServiceVariantFilterCriteria } from '../../models/service-variant-filter-criteria.model';
import { ServiceVariantFilterService } from '../../services/service-variant-filter.service';
import { ServiceVariantRouteDataService } from '../../services/service-variant-route-data.service';

import { ServiceVariantComponent } from './service-variant.component';

class MockServiceVariantService {
  getAll(): Observable<MasterServiceVariant[]> {
    return of([]);
  }

  isLoading(): Observable<boolean> {
    return of(true);
  }
}
class MockServiceService {
  getAll(): Observable<MasterService[]> {
    return of([]);
  }
}

class MockServiceVariantFilterService {
  get pristine(): Observable<boolean> {
    return of(true);
  }
}

class MockServiceVariantRouteDataService {
  selectedServiceVariantIds = [1, 2];
}

class ActivatedRouteStub {
  queryParams = of({});

  params = of({});
}

describe('ServiceVariantComponent', () => {
  const serviceVariantFilterCriteriaMock: ServiceVariantFilterCriteria = {
    services: [],
    brands: [],
    productGroups: [],
    active: false
  };

  let component: ServiceVariantComponent;
  let fixture: ComponentFixture<ServiceVariantComponent>;
  let matDialogSpy: Spy<MatDialog>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let routerSpy: Spy<Router>;

  beforeEach(() => {
    matDialogSpy = createSpyFromClass(MatDialog);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    routerSpy = createSpyFromClass(Router);

    TestBed.configureTestingModule({
      declarations: [ServiceVariantComponent],
      imports: [TestingModule, OverlayModule],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MasterServiceVariantService, useClass: MockServiceVariantService },
        { provide: MasterServiceService, useClass: MockServiceService },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: ServiceVariantFilterService, useClass: MockServiceVariantFilterService },
        { provide: ServiceVariantRouteDataService, useClass: MockServiceVariantRouteDataService },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('multiEdit', () => {
    it('route to configure page', done => {
      const routeToConfigurationSpy = jest.spyOn(component, 'routeToConfiguration');

      component.multiEdit([1]);
      expect(routeToConfigurationSpy).toHaveBeenCalled();
      done();
    });
  });

  describe('openRemoveConfirmationDialog', () => {
    it('should open remove confirmation dialog and pass confirm value', done => {
      const removeServiceVariantSpy = jest.spyOn(component, 'removeServiceVariant');
      matDialogSpy.open.mockReturnValue({ afterClosed: () => true });

      component.openRemoveConfirmationDialog([1]);
      expect(removeServiceVariantSpy).toBeTruthy();
      done();
    });

    it('should do nothing if close dialog', done => {
      const removeServiceVariantSpy = jest.spyOn(component, 'removeServiceVariant');

      matDialogSpy.open.mockReturnValue({ afterClosed: () => of(false) });
      component.openRemoveConfirmationDialog([1]);

      expect(removeServiceVariantSpy).not.toHaveBeenCalled();
      done();
    });
  });

  describe('openServiceVariantFilterDialog', () => {
    it('should pass filter criteria', done => {
      matDialogSpy.open.mockReturnValue({
        afterClosed: () => of(serviceVariantFilterCriteriaMock)
      });
      component.openServiceVariantFilterDialog();
      expect(component.servicesFilter).toBeTruthy();
      done();
    });

    it('should do nothing if close dialog', done => {
      const spy = jest.spyOn(component.servicesFilter, 'emit');
      matDialogSpy.open.mockReturnValue({ afterClosed: () => of(false) });
      component.openServiceVariantFilterDialog();
      expect(spy).not.toHaveBeenCalled();
      done();
    });
  });
});
