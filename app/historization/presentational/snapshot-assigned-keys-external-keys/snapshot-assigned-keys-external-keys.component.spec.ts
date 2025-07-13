import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PipesModule } from '../../../shared/pipes/pipes.module';

import { TestingModule } from '../../../testing/testing.module';
import { SnapshotAssignedKeysExternalKeysComponent } from './snapshot-assigned-keys-external-keys.component';

import {
  currentAssignedKeySnapshotEntriesMock,
  comparingAssignedKeySnapshotEntriesMock
} from '../../models/assignedKeys-history-snapshot.mock';
import { isEqual } from 'lodash';
import { ExternalKeys } from '../../models/outlet-history-snapshot.model';
import { MatDialog } from '@angular/material/dialog';
import { FeatureToggleService } from '../../../shared/directives/feature-toggle/feature-toggle.service';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

describe('SnapshotAssignedKeysExternalKeysComponent', () => {
  let component: SnapshotAssignedKeysExternalKeysComponent;
  let fixture: ComponentFixture<SnapshotAssignedKeysExternalKeysComponent>;
  let matDialogSpy: Spy<MatDialog>;
  let featureToggleServiceSpy: Spy<FeatureToggleService>;

  beforeEach(waitForAsync(() => {
    matDialogSpy = createSpyFromClass(MatDialog);
    featureToggleServiceSpy = createSpyFromClass(FeatureToggleService);

    TestBed.configureTestingModule({
      declarations: [SnapshotAssignedKeysExternalKeysComponent],
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
    fixture = TestBed.createComponent(SnapshotAssignedKeysExternalKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.currentExternalKeys = currentAssignedKeySnapshotEntriesMock.externalKeys;
    component.comparingExternalKeys = comparingAssignedKeySnapshotEntriesMock.externalKeys;
  });

  function findCurrentExternalKey(currentData: ExternalKeys) {
    return component.currentExternalKeys?.find(externalKey => isEqual(externalKey, currentData));
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true if current externalKey is newly added', () => {
    const externalKey: ExternalKeys = {
      keyType: 'BUSINESS_CODE',
      value: '2001',
      brandId: 'MB',
      productGroupId: 'PC'
    };
    const result = component.isFieldChangedFromComparingData(
      'keyType',
      findCurrentExternalKey(externalKey)
    );

    expect(result).toEqual(true);
  });

  it('should return previous snapshot value if getFieldDataFromComparingData invoked and the field value exists', () => {
    const externalKey: ExternalKeys = {
      keyType: 'BUSINESS_CODE',
      value: '2001'
    };
    const result = component.getFieldDataFromComparingData(
      'keyType',
      findCurrentExternalKey(externalKey)
    );

    expect(result).toEqual('BUSINESS_CODE');
  });

  it('should return undefined value if getFieldDataFromComparingData get invoked and the field value not exists', () => {
    const externalKey: ExternalKeys = {
      keyType: 'BUSINESS_CODE',
      value: '2001',
      brandId: 'MB',
      productGroupId: 'PC'
    };
    const result = component.getFieldDataFromComparingData(
      'brandId',
      findCurrentExternalKey(externalKey)
    );

    expect(result).toEqual(undefined);
  });

  it('should return true if isFieldChangedCompareWholeData invoked and the current external key is updated', () => {
    const externalKey: ExternalKeys = {
      keyType: 'BUSINESS_CODE',
      value: '2002',
      brandId: 'MYB',
      productGroupId: 'PC'
    };
    const result = component.isFieldChangedCompareWholeData(findCurrentExternalKey(externalKey));

    expect(result).toEqual(true);
  });

  it('should return true if isFieldChangedCompareWholeData invoked and the current external key is newly added', () => {
    const externalKey: ExternalKeys = {
      keyType: 'BUSINESS_CODE',
      value: '2001',
      brandId: 'MB',
      productGroupId: 'PC'
    };
    const result = component.isFieldChangedCompareWholeData(findCurrentExternalKey(externalKey));

    expect(result).toEqual(true);
  });

  it('should return false if isFieldChangedCompareWholeData invoked and the current external key is not updated', () => {
    const externalKey: ExternalKeys = {
      keyType: 'BUSINESS_CODE',
      value: '2001'
    };
    const result = component.isFieldChangedCompareWholeData(findCurrentExternalKey(externalKey));

    expect(result).toEqual(false);
  });

  it('should return true for isChanged method if API return external keys in the changes array', () => {
    component.changes=[{
      changedField: 'externalKeys',
      userId: 'USER'
    }]
    const result = component.isChanged();

    expect(result).toEqual(true);
  });

  it('should return false for isChanged method if API does not return external keys in the changes array', () => {
    component.changes=[{
      changedField: 'brandCodes',
      userId: 'USER'
    }]
    const result = component.isChanged();

    expect(result).toEqual(false);
  });
});
