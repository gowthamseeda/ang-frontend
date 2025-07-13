import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';

import { KeysPipe } from '../../../../shared/pipes/keys/keys.pipe';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import {
  getBrandProductGroupIdsInFirstRowMock,
  getBrandProductGroupIdsInSecondRowMock,
  getBrandProductGroupsDataMock
} from '../../../brand-product-group/brand-product-groups.mock';

import {
  ArrowDirection,
  BrandProductGroupsData,
  BrandProductGroupsDataTableComponent
} from './brand-product-groups-data-table.component';

const brandProductGroupIdsInFirstRow = getBrandProductGroupIdsInFirstRowMock();
const brandProductGroupIdsInSecondRow = getBrandProductGroupIdsInSecondRowMock();
const brandProductGroupsDataMock = getBrandProductGroupsDataMock();

describe('BrandProductGroupsDataTableComponent', () => {
  let component: BrandProductGroupsDataTableComponent;
  let fixture: ComponentFixture<BrandProductGroupsDataTableComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BrandProductGroupsDataTableComponent, TranslatePipeMock, KeysPipe],
        imports: [MatTableModule],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandProductGroupsDataTableComponent);
    component = fixture.componentInstance;
    component.brandProductGroupsData = getBrandProductGroupsDataMock();
    component.brandProductGroupColumns = {
      MB: brandProductGroupsDataMock[0].brandProductGroupIds,
      SMT: brandProductGroupsDataMock[1].brandProductGroupIds
    };
    component.ngOnChanges({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should populate data source of table', () => {
      expect(component.brandProductGroupsDataDataSource.data).toEqual(brandProductGroupsDataMock);
    });

    it('should refresh dataSource when refreshTable changes to true', () => {
      const testData: BrandProductGroupsData<any>[] = [
        { data: { name: 'Test' }, brandProductGroupIds: [{ brandId: 'B1', productGroupId: 'P1' }] }
      ];
      component.brandProductGroupsData = testData;
      component.ngOnChanges({
        brandProductGroupsData: new SimpleChange(null, testData, true)
      });
      component.refreshTable = true;
      component.ngOnChanges({
        refreshTable: new SimpleChange(false, true, false)
      });
      expect(component.brandProductGroupsDataDataSource.data).toEqual(testData);
    });

    it('should determine brand product group columns', () => {
      const expected = {
        MB: [
          {
            brandId: 'MB',
            productGroupId: 'PC'
          },
          { brandId: 'MB', productGroupId: 'VAN' }
        ],
        SMT: [{ brandId: 'SMT', productGroupId: 'PC' }]
      };

      expect(component.brandProductGroupColumns).toEqual(expected);
    });
  });

  describe('brandProductGroupExistsFor', () => {
    const brandProductGroupIds = [
      { brandId: 'SMT', productGroupId: 'PC' },
      { brandId: 'MB', productGroupId: 'PC' }
    ];

    it('brand product group exists for brand product group "MB/PC"', () => {
      expect(component.brandProductGroupExistsFor(brandProductGroupIds, 'MB', 'PC')).toBeTruthy();
    });

    it('brand product group does not exist for brand product group "SMT/VAN"', () => {
      expect(component.brandProductGroupExistsFor(brandProductGroupIds, 'SMT', 'VAN')).toBeFalsy();
    });
  });

  describe('isMovementAllowed', () => {
    it('is allowed to move brand product groups for an upside direction', () => {
      expect(
        component.isMovementAllowed(brandProductGroupIdsInSecondRow[0], ArrowDirection.UP)
      ).toBeTruthy();
    });

    it('is allowed to move brand product groups for a downside direction', () => {
      expect(
        component.isMovementAllowed(brandProductGroupIdsInFirstRow[0], ArrowDirection.DOWN)
      ).toBeTruthy();
    });

    it('is not allowed to move brand product groups for an upside direction', () => {
      expect(
        component.isMovementAllowed(brandProductGroupIdsInFirstRow[0], ArrowDirection.UP)
      ).toBeFalsy();
    });

    it('is not allowed to move brand product groups for a downside direction', () => {
      expect(
        component.isMovementAllowed(brandProductGroupIdsInSecondRow[0], ArrowDirection.DOWN)
      ).toBeFalsy();
    });

    it('is not allowed to move brand product groups when the feature is disabled', () => {
      component.disableBrandProductGroupsChange = true;
      expect(
        component.isMovementAllowed(brandProductGroupIdsInFirstRow[0], ArrowDirection.DOWN)
      ).toBeFalsy();
    });
  });

  describe('brandProductGroupIsInFirstRow', () => {
    it('brand product group "MB/PC" is in first row', () => {
      expect(
        component.brandProductGroupIsInFirstRow({ brandId: 'MB', productGroupId: 'PC' })
      ).toBeTruthy();
    });

    it('brand product group "SMT/PC" is not in first row', () => {
      expect(
        component.brandProductGroupIsInFirstRow({ brandId: 'SMT', productGroupId: 'PC' })
      ).toBeFalsy();
    });
  });

  describe('brandProductGroupIsOnlyOneInLastRow', () => {
    it('brand product group "SMT/PC" is only one in last row', () => {
      expect(
        component.brandProductGroupIsOnlyOneInLastRow({ brandId: 'SMT', productGroupId: 'PC' })
      ).toBeTruthy();
    });

    it('brand product group "MB/PC" is not only one in last row', () => {
      expect(
        component.brandProductGroupIsOnlyOneInLastRow({ brandId: 'MB', productGroupId: 'PC' })
      ).toBeFalsy();
    });
  });

  describe('getValidityIcon', () => {
    it('should return check if brandProductGroup combination is not found', () => {
      component.brandProductGroupValidities = [];
      expect(component.getValidityIcon('MB', 'PC')).toEqual('check');
    });

    it('should return os-planned with PC product group if validity is undefined', () => {
      component.brandProductGroupValidities = [
        {
          brandId: 'SMT',
          productGroupId: 'PC'
        }
      ];
      expect(component.getValidityIcon('SMT', 'PC')).toEqual('os-planned-pg-pc');
    });

    it('should return os-planned with VAN product group if validity is undefined', () => {
      component.brandProductGroupValidities = [
        {
          brandId: 'MB',
          productGroupId: 'VAN'
        }
      ];
      expect(component.getValidityIcon('MB', 'VAN')).toEqual('os-planned-pg-van');
    });

    it('should return os-planned with product group if validity is not valid and not applicant', () => {
      component.brandProductGroupValidities = [
        {
          brandId: 'SMT',
          productGroupId: 'PC',
          validity: {
            application: false,
            valid: false,
            validFrom: '2021-04-14'
          }
        }
      ];
      expect(component.getValidityIcon('SMT', 'PC')).toEqual('os-planned-pg-pc');
    });

    it('should return os-applicant if validity is application', () => {
      component.brandProductGroupValidities = [
        {
          brandId: 'MB',
          productGroupId: 'VAN',
          validity: {
            application: true,
            valid: false
          }
        }
      ];
      expect(component.getValidityIcon('MB', 'VAN')).toEqual('os-applicant');
    });

    it('should return os-offered-and-valid if validity is valid', () => {
      component.brandProductGroupValidities = [
        {
          brandId: 'MB',
          productGroupId: 'BUS',
          validity: {
            application: false,
            valid: true
          }
        }
      ];
      expect(component.getValidityIcon('MB', 'BUS')).toEqual('os-offered-and-valid');
    });
  });

  describe('moveBrandProductGroup', () => {
    it('should not change anything when trying to move up a brand product group in first row', () => {
      const brandProductGroupToMove = { brandId: 'MB', productGroupId: 'PC' };
      component.moveBrandProductGroup(brandProductGroupToMove, ArrowDirection.UP);

      expect(component.brandProductGroupsDataDataSource.data).toEqual(brandProductGroupsDataMock);
    });

    it('should move brand product group "MB/PC" down to row below', () => {
      const brandProductGroupToMove = { brandId: 'MB', productGroupId: 'PC' };
      component.moveBrandProductGroup(brandProductGroupToMove, ArrowDirection.DOWN);
      const foundMovedBrandProductGroup = component.brandProductGroupsDataDataSource.data[1].brandProductGroupIds.find(
        currentBrandProductGroupId =>
          currentBrandProductGroupId.brandId === brandProductGroupToMove.brandId &&
          currentBrandProductGroupId.productGroupId === brandProductGroupToMove.productGroupId
      );

      expect(foundMovedBrandProductGroup).toBeDefined();
    });

    it('should move brand product group "SMT/PC" up to row above', () => {
      const brandProductGroupToMove = { brandId: 'SMT', productGroupId: 'PC' };
      component.moveBrandProductGroup(brandProductGroupToMove, ArrowDirection.UP);
      const foundMovedBrandProductGroup = component.brandProductGroupsDataDataSource.data[0].brandProductGroupIds.find(
        currentBrandProductGroupId =>
          currentBrandProductGroupId.brandId === brandProductGroupToMove.brandId &&
          currentBrandProductGroupId.productGroupId === brandProductGroupToMove.productGroupId
      );

      expect(foundMovedBrandProductGroup).toBeDefined();
    });

    it('should not change anything when trying to move down a brand product group in last row', () => {
      const brandProductGroupToMove = { brandId: 'SMT', productGroupId: 'PC' };
      component.moveBrandProductGroup(brandProductGroupToMove, ArrowDirection.DOWN);

      expect(component.brandProductGroupsDataDataSource.data).toEqual(brandProductGroupsDataMock);
    });

    it('should emit 2 changes when a brand product group of a defined data row moves', () => {
      jest.spyOn(component.brandProductGroupChange, 'emit');
      const brandProductGroupToMove = { brandId: 'MB', productGroupId: 'PC' };
      component.moveBrandProductGroup(brandProductGroupToMove, ArrowDirection.DOWN);
      const twoChangeObjectsExpected = [
        //expect({ data: 'mock' }).toEqual(expect.objectContaining({ data: 'mock' })),
        //expect({ data: undefined }).toEqual(expect.objectContaining({ data: undefined }))
        jasmine.objectContaining({ data: 'mock' }),
        jasmine.objectContaining({ data: undefined })
      ];

      expect(component.brandProductGroupChange.emit).toHaveBeenCalledWith(twoChangeObjectsExpected);
    });

    it('should emit 1 change when a brand product group in an undefined data row moves to a defined one', () => {
      jest.spyOn(component.brandProductGroupChange, 'emit');
      const brandProductGroupToMove = { brandId: 'SMT', productGroupId: 'PC' };
      component.moveBrandProductGroup(brandProductGroupToMove, ArrowDirection.UP);
      const oneChangeObjectExpected = [jasmine.objectContaining({ data: 'mock' })];

      expect(component.brandProductGroupChange.emit).toHaveBeenCalledWith(oneChangeObjectExpected);
    });
  });
});
