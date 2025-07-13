import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PipesModule } from '../../../shared/pipes/pipes.module';

import { TestingModule } from '../../../testing/testing.module';
import { SnapshotAssignedLabelsComponent } from './snapshot-assigned-labels.component';

import {
  currentAssignedLabelSnapshotEntriesMock,
  comparingAssignedLabelSnapshotEntriesMock
} from '../../models/assignedLabels-history-snapshot.mock';
import { MatDialog } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { FeatureToggleService } from "../../../shared/directives/feature-toggle/feature-toggle.service";

describe('SnapshotAssignedLabelsComponent', () => {
  let component: SnapshotAssignedLabelsComponent;
  let fixture: ComponentFixture<SnapshotAssignedLabelsComponent>;
  let matDialogSpy: Spy<MatDialog>;
  let featureToggleServiceSpy: Spy<FeatureToggleService>;

  beforeEach(waitForAsync(() => {
    matDialogSpy = createSpyFromClass(MatDialog);
    featureToggleServiceSpy = createSpyFromClass(FeatureToggleService);

    TestBed.configureTestingModule({
      declarations: [SnapshotAssignedLabelsComponent],
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
    fixture = TestBed.createComponent(SnapshotAssignedLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.currentLabels = currentAssignedLabelSnapshotEntriesMock.brandLabels;
    component.comparingLabels = comparingAssignedLabelSnapshotEntriesMock.brandLabels;
  });

  function findCurrentLabelsByBrandId(brandId: string) {
    return component.currentLabels?.find(brandLabels => brandLabels.brandId === brandId);
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true if current labelId is newly added', () => {
    const result = component.isFieldChangedFromComparingData(
      'labelId',
      findCurrentLabelsByBrandId('WST')
    );

    expect(result).toEqual(true);
  });

  it('should return previous snapshot value if getFieldDataFromComparingData invoked and the field value exists', () => {
    const result = component.getFieldDataFromComparingData(
      'labelId',
      findCurrentLabelsByBrandId('MB')
    );

    expect(result).toEqual('36');
  });

  it('should return undefined value if getFieldDataFromComparingData get invoked and the field value not exists', () => {
    const result = component.getFieldDataFromComparingData(
      'labelId',
      findCurrentLabelsByBrandId('WST')
    );

    expect(result).toEqual(undefined);
  });

  it('should return true if isFieldChangedCompareWholeData invoked and the current label is updated', () => {
    const result = component.isFieldChangedCompareWholeData(findCurrentLabelsByBrandId('MYB'));

    expect(result).toEqual(true);
  });

  it('should return true if isFieldChangedCompareWholeData invoked and the current label is newly added', () => {
    const result = component.isFieldChangedCompareWholeData(findCurrentLabelsByBrandId('WST'));

    expect(result).toEqual(true);
  });

  it('should return false if isFieldChangedCompareWholeData invoked and the current label is not updated', () => {
    const result = component.isFieldChangedCompareWholeData(findCurrentLabelsByBrandId('MB'));

    expect(result).toEqual(false);
  });

  it('should return true for isChanged method if API return brand labels in the changes array', () => {
    component.changes=[{
      changedField: 'brandLabels',
      userId: 'USER'
    }]
    const result = component.isChanged();

    expect(result).toEqual(true);
  });

  it('should return false for isChanged method if API does not return brand labels in the changes array', () => {
    component.changes=[{
      changedField: 'brandCodes',
      userId: 'USER'
    }]
    const result = component.isChanged();

    expect(result).toEqual(false);
  });
});
