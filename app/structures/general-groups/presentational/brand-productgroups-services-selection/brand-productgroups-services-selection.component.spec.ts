import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { UserService } from '../../../../iam/user/user.service';
import { MasterBrandService } from '../../../../master/brand/master-brand/master-brand.service';
import { ProductGroup } from '../../../../services/product-group/product-group.model';
import { ProductGroupService } from '../../../../services/product-group/product-group.service';
import { ServiceVariant } from '../../../../services/service-variant/service-variant.model';
import { ServiceVariantDataService } from '../../../../services/service-variant/store/service-variant-data.service';
import { brandProductGroupServicesMock } from '../../model/brand-product-group-service.mock';

import { BrandProductgroupsServicesSelectionComponent } from './brand-productgroups-services-selection.component';

describe('BrandProductgroupsServicesSelectionComponent', () => {
  let component: BrandProductgroupsServicesSelectionComponent;
  let fixture: ComponentFixture<BrandProductgroupsServicesSelectionComponent>;
  let userServiceSpy: Spy<UserService>;
  let productGroupServiceSpy: Spy<ProductGroupService>;
  let masterBrandServiceSpy: Spy<MasterBrandService>;
  let serviceVariantDataServiceSpy: Spy<ServiceVariantDataService>;
  const brandProductGroupServiceIds = [
    brandProductGroupServicesMock[0],
    brandProductGroupServicesMock[1]
  ];

  beforeEach(waitForAsync(() => {
    userServiceSpy = createSpyFromClass(UserService);
    productGroupServiceSpy = createSpyFromClass(ProductGroupService);
    masterBrandServiceSpy = createSpyFromClass(MasterBrandService);
    serviceVariantDataServiceSpy = createSpyFromClass(ServiceVariantDataService);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        MatSelectModule,
        MatListModule
      ],
      declarations: [BrandProductgroupsServicesSelectionComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: ProductGroupService, useValue: productGroupServiceSpy },
        { provide: MasterBrandService, useValue: masterBrandServiceSpy },
        { provide: ServiceVariantDataService, useValue: serviceVariantDataServiceSpy },
        { provide: MatDialogRef, useValue: {} },
        {
          provide: MAT_DIALOG_DATA,
          useValue: Object.assign({ brandProductGroupServiceIds }, { countryId: 'DE' })
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    userServiceSpy.getBrandRestrictions.nextWith(['MB']);
    userServiceSpy.getProductGroupRestrictions.nextWith(['PC']);
    productGroupServiceSpy.getAll.nextWith([
      { id: 'UNIMOG', name: 'Unimog' } as ProductGroup,
      { id: 'PC', name: 'Passenger Car' } as ProductGroup
    ]);
    masterBrandServiceSpy.getAll.nextWith([{ id: 'MB', name: 'Mercedes-Benz' }]);
    serviceVariantDataServiceSpy.getAllForStructureBy.nextWith([
      { brandId: 'MB', productGroupId: 'PC' } as ServiceVariant
    ]);

    fixture = TestBed.createComponent(BrandProductgroupsServicesSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize all brands and product groups', () => {
      expect(userServiceSpy.getBrandRestrictions).toHaveBeenCalled();
      expect(userServiceSpy.getProductGroupRestrictions).toHaveBeenCalled();
      expect(masterBrandServiceSpy.getAll).toHaveBeenCalled();
      expect(productGroupServiceSpy.getAll).toHaveBeenCalled();
    });

    it('should initialize allowed brand product group combinations', () => {
      const brandProductGroupCombinations = new Map<string, string[]>();
      brandProductGroupCombinations.set('MB', ['PC']);
      expect(component.allowedBrandProductGroupCombinations).toEqual(brandProductGroupCombinations);
    });

    it('should patch form group with data', () => {
      const expected = { brandId: 'MB', productGroupIds: ['PC', 'VAN'], serviceIds: [120] };
      expect(component.brandProductGroupsServicesFormGroup.getRawValue()).toEqual(expected);
    });
  });

  describe('Brand and Product Group by User Restrictions', () => {
    it('should show brand and product group by user restrictions', () => {
      expect(component.allBrandIds).toEqual(['MB']);
      expect(component.allProductGroupIds).toEqual(['PC', 'UNIMOG']);
      expect(component.allowedProductGroupIds).toEqual(['PC']);
    });

    it('should hide brand by user restrictions', () => {
      userServiceSpy.getBrandRestrictions.nextWith(['SMT']);

      expect(component.allBrandIds).toEqual([]);
    });

    it('should hide product group by user restrictions', () => {
      userServiceSpy.getProductGroupRestrictions.nextWith(['BUS']);

      expect(component.allProductGroupIds).toEqual(['PC', 'UNIMOG']);
      expect(component.allowedProductGroupIds).toEqual([]);
    });
  });

  describe('isProductGroupAllowed', () => {
    beforeEach(() => {
      component.brandProductGroupsServicesFormGroup.get('brandId')?.setValue('MB');
    });

    it('should be true for product group ID "PC"', () => {
      expect(component.isProductGroupAllowed('PC')).toBeTruthy();
    });

    it('should be false for product group ID "TRUCK"', () => {
      expect(component.isProductGroupAllowed('TRUCK')).toBeFalsy();
    });
  });
});
