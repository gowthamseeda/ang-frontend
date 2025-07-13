import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { Observable, of } from 'rxjs';

import { SortingService } from '../../../../../shared/services/sorting/sorting.service';
import { TranslatePipeMock } from '../../../../../testing/pipe-mocks/translate';
import { MasterBrand } from '../../../../brand/master-brand/master-brand.model';
import { MasterBrandService } from '../../../../brand/master-brand/master-brand.service';
import { MasterProductGroup } from '../../../../product-group/master-product-group/master-product-group.model';
import { MasterProductGroupService } from '../../../../product-group/master-product-group/master-product-group.service';
import { MasterService } from '../../../master-service/master-service.model';
import { MasterServiceService } from '../../../master-service/master-service.service';
import { MasterServiceVariant } from '../../master-service-variant/master-service-variant.model';
import { MasterServiceVariantService } from '../../master-service-variant/master-service-variant.service';
import { ServiceVariantFilterCriteria } from '../../models/service-variant-filter-criteria.model';
import { ServiceVariantFilterService } from '../../services/service-variant-filter.service';

import { ServiceVariantFilterDialogComponent } from './service-variant-filter-dialog.component';

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
class MockProductGroupService {
  getAll(): Observable<MasterProductGroup[]> {
    return of([]);
  }
}
class MockBrandService {
  getAll(): Observable<MasterBrand[]> {
    return of([]);
  }
}

function getFormMock(): UntypedFormGroup {
  return new UntypedFormBuilder().group({});
}

class MockServiceVariantFilterService {
  get pristine(): Observable<boolean> {
    return of(true);
  }

  get pristineFilterCriteria(): Observable<ServiceVariantFilterCriteria> {
    return of({
      services: [],
      brands: [],
      productGroups: [],
      active: false
    });
  }

  get filterCriteria(): Observable<ServiceVariantFilterCriteria> {
    return of({
      services: [],
      brands: [],
      productGroups: [],
      active: false
    });
  }
}

describe('ServiceVariantFilterDialogComponent', () => {
  let component: ServiceVariantFilterDialogComponent;
  let fixture: ComponentFixture<ServiceVariantFilterDialogComponent>;
  let sortingServiceSpy: Spy<SortingService>;

  beforeEach(async () => {
    sortingServiceSpy = createSpyFromClass(SortingService);

    await TestBed.configureTestingModule({
      declarations: [ServiceVariantFilterDialogComponent, TranslatePipeMock],
      providers: [
        UntypedFormBuilder,
        { provide: MasterServiceVariantService, useClass: MockServiceVariantService },
        { provide: MasterServiceService, useClass: MockServiceService },
        { provide: MasterBrandService, useClass: MockBrandService },
        { provide: MasterProductGroupService, useClass: MockProductGroupService },
        { provide: MatDialogRef, useValue: {} },
        { provide: ServiceVariantFilterService, useClass: MockServiceVariantFilterService },
        { provide: SortingService, useValue: sortingServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    TestBed.inject(MasterServiceVariantService);
    TestBed.inject(MasterServiceService);
    TestBed.inject(MasterBrandService);
    TestBed.inject(MasterProductGroupService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceVariantFilterDialogComponent);
    component = fixture.componentInstance;
    component.serviceVariantFilterFormGroup = getFormMock();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('init form group', () => {
      expect(component).toBeTruthy();
    });
  });
});
