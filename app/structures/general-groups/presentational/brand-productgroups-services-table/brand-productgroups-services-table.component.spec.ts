import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { UserService } from '../../../../iam/user/user.service';
import { MasterBrandService } from '../../../../master/brand/master-brand/master-brand.service';
import { ServiceVariantDataService } from '../../../../services/service-variant/store/service-variant-data.service';
import { GeneralGroupsService } from '../../general-groups.service';
import { brandProductGroupServicesMock } from '../../model/brand-product-group-service.mock';
import { BrandProductGroupServiceId } from '../../model/brand-product-group-service.model';
import { serviceVariantsMock } from '../../model/service-variant.mock';

import { BrandProductgroupsServicesTableComponent } from './brand-productgroups-services-table.component';
import { BrandService } from '../../../../services/brand/brand.service';

describe('BrandProductgroupsServicesTableComponent', () => {
  let component: BrandProductgroupsServicesTableComponent;
  let fixture: ComponentFixture<BrandProductgroupsServicesTableComponent>;
  let userServiceSpy: Spy<UserService>;
  let generalGroupsServiceSpy: Spy<GeneralGroupsService>;
  let brandServiceSpy: Spy<BrandService>;
  let matDialogSpy: Spy<MatDialog>;
  let masterBrandSpy: Spy<MasterBrandService>;
  let serviceVariantDataServiceSpy: Spy<ServiceVariantDataService>;
  const brandProductGroupsServicesRowsMock = new Map<string, BrandProductGroupServiceId[]>();

  beforeEach(waitForAsync(() => {
    userServiceSpy = createSpyFromClass(UserService);
    generalGroupsServiceSpy = createSpyFromClass(GeneralGroupsService);
    brandServiceSpy = createSpyFromClass(BrandService);
    matDialogSpy = createSpyFromClass(MatDialog);
    masterBrandSpy = createSpyFromClass(MasterBrandService);
    serviceVariantDataServiceSpy = createSpyFromClass(ServiceVariantDataService);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot(), MatDialogModule],
      declarations: [BrandProductgroupsServicesTableComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: GeneralGroupsService, useValue: generalGroupsServiceSpy },
        { provide: BrandService, useValue: brandServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: MasterBrandService, useValue: masterBrandSpy },
        { provide: ServiceVariantDataService, useValue: serviceVariantDataServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    brandProductGroupsServicesRowsMock.set('MB', [
      brandProductGroupServicesMock[0],
      brandProductGroupServicesMock[1]
    ]);
    generalGroupsServiceSpy.getAllowedServices.nextWith([{ id: 120, name: 'Allowed Service' }]);
    brandServiceSpy.getAll.nextWith([
      { id: 'MB', name: 'Mercedes-Benz' },
      { id: 'SMT', name: 'Smart' }
    ]);
    userServiceSpy.getBrandRestrictions.nextWith(['MB']);
    userServiceSpy.getProductGroupRestrictions.nextWith(['PC', 'VAN']);
    serviceVariantDataServiceSpy.getAllForStructureBy.nextWith(serviceVariantsMock);
    fixture = TestBed.createComponent(BrandProductgroupsServicesTableComponent);
    component = fixture.componentInstance;
    component.brandProductGroupsServicesRows = brandProductGroupsServicesRowsMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize allowed services', () => {
      expect(generalGroupsServiceSpy.getAllowedServices).toHaveBeenCalled();
    });

    it('should initialize brand authorization', () => {
      expect(userServiceSpy.getBrandRestrictions).toHaveBeenCalled();
      expect(component.authorizedBrands).toEqual(['MB']);
    });
  });

  describe('editBrandProductGroupsServices', () => {
    it('should open a dialog to edit brand product groups services row', () => {
      matDialogSpy.open.mockReturnValue({ afterClosed: () => of() });
      component.editBrandProductGroupsServices([]);
      expect(matDialogSpy.open).toHaveBeenCalled();
    });

    it('should edit brand product groups services row', () => {
      jest.spyOn(component.brandProductGroupServiceIdsChange, 'emit');
      const selectedBrandProductGroupIds = [
        { brandId: 'MB', productGroupId: 'VAN', serviceId: 120 }
      ];
      matDialogSpy.open.mockReturnValue({
        afterClosed: () => of(selectedBrandProductGroupIds)
      });
      component.editBrandProductGroupsServices([]);

      expect(component.brandProductGroupServiceIdsChange.emit).toHaveBeenCalledWith(
        selectedBrandProductGroupIds
      );
    });
  });

  describe('addBrandProductGroupsServices', () => {
    it('should open a dialog to edit brand product groups services row', () => {
      matDialogSpy.open.mockReturnValue({ afterClosed: () => of() });
      component.addBrandProductGroupsServices();
      expect(matDialogSpy.open).toHaveBeenCalled();
    });

    it('should add brand product groups services row', () => {
      jest.spyOn(component.brandProductGroupServiceIdsChange, 'emit');
      const selectedBrandProductGroupIds = [
        { brandId: 'MB', productGroupId: 'VAN', serviceId: 120 }
      ];
      matDialogSpy.open.mockReturnValue({
        afterClosed: () => of(selectedBrandProductGroupIds)
      });
      component.addBrandProductGroupsServices();
      expect(component.brandProductGroupServiceIdsChange.emit).toHaveBeenCalledWith(
        selectedBrandProductGroupIds
      );
    });
  });

  describe('getServiceName', () => {
    it('should get service name by service ID', () => {
      expect(component.getServiceName('120')).toEqual('Allowed Service');
    });
  });

  describe('removeBrandProductGroupServices', () => {
    it('should remove brand product group services', () => {
      jest.spyOn(component.brandProductGroupServiceIdsChange, 'emit');
      component.removeBrandProductGroupServices('MB');
      expect(component.brandProductGroupServiceIdsChange.emit).toHaveBeenCalledWith([]);
    });
  });

  describe('availableBrandIds', () => {
    it('should get available brand IDs', () => {
      expect(component.availableBrandIds).toEqual(['SMT']);
    });
  });

  describe('isAllowedToRemoveBrandProductGroupServices', () => {
    it('should enabled the delete right for Brand Product Group Table if authorized', () => {
      const brandProductGroupServiceId: BrandProductGroupServiceId[] = [
        { brandId: 'MB', productGroupId: 'PC', serviceId: 120 },
        { brandId: 'MB', productGroupId: 'VAN', serviceId: 120 }
      ];
      expect(
        component.isAllowedToRemoveBrandProductGroupServices(brandProductGroupServiceId)
      ).toBeTruthy();
    });

    it('should disabled the delete right for Brand Product Group Table if unauthorized', () => {
      const brandProductGroupServiceId: BrandProductGroupServiceId[] = [
        { brandId: 'MB', productGroupId: 'BUS', serviceId: 120 },
        { brandId: 'MB', productGroupId: 'PC', serviceId: 120 }
      ];
      expect(
        component.isAllowedToRemoveBrandProductGroupServices(brandProductGroupServiceId)
      ).toBeFalsy();
    });
  });

  describe('isAllowedToEditBrandProductGroupServices', () => {
    it('should enabled the edit right for Brand Product Group Table if authorized', () => {
      component.ngOnChanges({
        countryId: new SimpleChange(null, 'DE', true)
      });
      fixture.detectChanges();
      expect(component.isAllowedToEditBrandProductGroupServices('MB')).toBeTruthy();
    });

    it('should disabled the edit right for Brand Product Group Table if unauthorized', () => {
      component.ngOnChanges({
        countryId: new SimpleChange(null, 'DE', true)
      });
      fixture.detectChanges();
      expect(component.isAllowedToEditBrandProductGroupServices('STR')).toBeFalsy();
    });
  });

  it('should sort by brand position', () => {
    component.sortByBrandPosition([{ key: 'MB', value: brandProductGroupServicesMock }]);
    expect(masterBrandSpy.sort).toHaveBeenCalledWith(
      [{ key: 'MB', value: brandProductGroupServicesMock }],
      ['key']
    );
  });
});
