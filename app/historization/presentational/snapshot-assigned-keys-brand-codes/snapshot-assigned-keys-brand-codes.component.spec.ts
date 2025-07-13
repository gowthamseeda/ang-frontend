import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PipesModule } from '../../../shared/pipes/pipes.module';

import { TestingModule } from '../../../testing/testing.module';
import { SnapshotAssignedKeysBrandCodesComponent } from './snapshot-assigned-keys-brand-codes.component';

import {
  currentAssignedKeySnapshotEntriesMock,
  comparingAssignedKeySnapshotEntriesMock
} from '../../models/assignedKeys-history-snapshot.mock';
import { MatDialog } from '@angular/material/dialog';
import { FeatureToggleService } from '../../../shared/directives/feature-toggle/feature-toggle.service';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

describe('SnapshotAssignedKeysBrandCodesComponent', () => {
  let component: SnapshotAssignedKeysBrandCodesComponent;
  let fixture: ComponentFixture<SnapshotAssignedKeysBrandCodesComponent>;
  let matDialogSpy: Spy<MatDialog>;
  let featureToggleServiceSpy: Spy<FeatureToggleService>;

  beforeEach(waitForAsync(() => {
    matDialogSpy = createSpyFromClass(MatDialog);
    featureToggleServiceSpy = createSpyFromClass(FeatureToggleService);

    TestBed.configureTestingModule({
      declarations: [SnapshotAssignedKeysBrandCodesComponent],
      imports: [TestingModule, PipesModule],
      providers: [
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: FeatureToggleService, useValue: featureToggleServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    featureToggleServiceSpy.isFeatureEnabled.nextWith(true);
    fixture = TestBed.createComponent(SnapshotAssignedKeysBrandCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.currentBrandCodes = currentAssignedKeySnapshotEntriesMock.brandCodes;
    component.comparingBrandCodes = comparingAssignedKeySnapshotEntriesMock.brandCodes;
  });

  function findCurrentBrandCodeByBrandId(brandId: string) {
    return component.currentBrandCodes?.find(brandCodes => brandCodes.brandId === brandId);
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true if current brandCode is newly added', () => {
    const result = component.isFieldChangedFromComparingData(
      'brandId',
      findCurrentBrandCodeByBrandId('MB')
    );

    expect(result).toEqual(true);
  });

  it('should return previous snapshot value if getFieldDataFromComparingData invoked and the field value exists', () => {
    const result = component.getFieldDataFromComparingData(
      'brandCode',
      findCurrentBrandCodeByBrandId('SMT')
    );

    expect(result).toEqual('40010');
  });

  it('should return undefined value if getFieldDataFromComparingData get invoked and the field value not exists', () => {
    const result = component.getFieldDataFromComparingData(
      'brandCode',
      findCurrentBrandCodeByBrandId('MB')
    );

    expect(result).toEqual(undefined);
  });

  it('should return true if isFieldChangedCompareWholeData invoked and the current brand code is updated', () => {
    const result = component.isFieldChangedCompareWholeData(findCurrentBrandCodeByBrandId('SMT'));

    expect(result).toEqual(true);
  });

  it('should return true if isFieldChangedCompareWholeData invoked and the current brand code is newly added', () => {
    const result = component.isFieldChangedCompareWholeData(findCurrentBrandCodeByBrandId('MB'));

    expect(result).toEqual(true);
  });

  it('should return false if isFieldChangedCompareWholeData invoked and the current brand code is not updated', () => {
    const result = component.isFieldChangedCompareWholeData(findCurrentBrandCodeByBrandId('MYB'));

    expect(result).toEqual(false);
  });
});
