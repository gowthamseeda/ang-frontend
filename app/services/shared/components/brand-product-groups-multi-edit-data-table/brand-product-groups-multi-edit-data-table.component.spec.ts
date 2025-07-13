import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';

import { KeysPipe } from '../../../../shared/pipes/keys/keys.pipe';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import {
  getBrandProductGroupsDataMock
} from '../../../brand-product-group/brand-product-groups.mock';

import {
  BrandProductGroupsMultiEditDataTableComponent
} from './brand-product-groups-multi-edit-data-table.component';

const brandProductGroupsDataMock = getBrandProductGroupsDataMock();

describe('BrandProductGroupsDataTableComponents', () => {
  let component: BrandProductGroupsMultiEditDataTableComponent;
  let fixture: ComponentFixture<BrandProductGroupsMultiEditDataTableComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BrandProductGroupsMultiEditDataTableComponent, TranslatePipeMock, KeysPipe],
        imports: [MatTableModule],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandProductGroupsMultiEditDataTableComponent);
    component = fixture.componentInstance;
    component.brandProductGroupsData = getBrandProductGroupsDataMock();
    component.brandProductGroupColumns = {
      MB: brandProductGroupsDataMock[0].brandProductGroupIds,
      SMT: brandProductGroupsDataMock[1].brandProductGroupIds
    };
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
