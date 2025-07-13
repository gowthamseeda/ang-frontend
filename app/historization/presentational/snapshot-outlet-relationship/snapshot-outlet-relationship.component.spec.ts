import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { TestingModule } from '../../../testing/testing.module';
import { SnapshotOutletRelationshipComponent } from './snapshot-outlet-relationship.component';

import {
  currentOutletRelationshipSnapshotEntryMock,
  comparingOutletRelationshipSnapshotEntryMock,
  outletRelationshipChangedFields
} from '../../models/outletRelationship-history-snapshot.mock';
import { MatDialog } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { FeatureToggleService } from "../../../shared/directives/feature-toggle/feature-toggle.service";

describe('SnapshotOutletRelationshipComponent', () => {
  let component: SnapshotOutletRelationshipComponent;
  let fixture: ComponentFixture<SnapshotOutletRelationshipComponent>;
  let matDialogSpy: Spy<MatDialog>;
  let featureToggleServiceSpy: Spy<FeatureToggleService>;

  beforeEach(waitForAsync(() => {
    matDialogSpy = createSpyFromClass(MatDialog);
    featureToggleServiceSpy = createSpyFromClass(FeatureToggleService);

    TestBed.configureTestingModule({
      declarations: [SnapshotOutletRelationshipComponent],
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
    fixture = TestBed.createComponent(SnapshotOutletRelationshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.currentRelationships = currentOutletRelationshipSnapshotEntryMock.outletRelationships;
    component.comparingRelationships = comparingOutletRelationshipSnapshotEntryMock.outletRelationships;
    component.changes = outletRelationshipChangedFields;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return data if field exist in outlet relationship data', () => {
    const result = component.getFieldData(
      'relationshipDefCode',
      currentOutletRelationshipSnapshotEntryMock.outletRelationships[0]
    );

    expect(result).toEqual('related_to_logistic_center');
  });

  it('should return undefined if field does not exist in outlet relationship data', () => {
    const result = component.getFieldData(
      'businessSiteId',
      currentOutletRelationshipSnapshotEntryMock.outletRelationships[0]
    );

    expect(result).toEqual(undefined);
  });

  it('should return comparing data if current outlet relationship id is found', () => {
    const result = component.getComparingData(component.currentRelationships[2]);

    expect(result).toEqual(comparingOutletRelationshipSnapshotEntryMock.outletRelationships[1]);
  });

  it('should return undefined if current outlet relationship id is not found', () => {
    const result = component.getComparingData(component.currentRelationships[1]);

    expect(result).toEqual(undefined);
  });

  it('should return false if current outlet relationship and comparing outlet relationship is same', () => {
    const result = component.isFieldChangedCompareWholeData(component.currentRelationships[2]);

    expect(result).toEqual(false);
  });

  it('should return true if current outlet relationship and comparing outlet relationship is not same', () => {
    const result = component.isFieldChangedCompareWholeData(component.currentRelationships[0]);

    expect(result).toEqual(true);
  });

  it('should return editor if changed field exists', () => {
    const result = component.getChangeEditor(component.currentRelationships[0].relationshipKey);

    expect(result).toEqual('USER');
  });

  it('should return empty if changed field does not exist', () => {
    const result = component.getChangeEditor(component.currentRelationships[2].relationshipKey);

    expect(result).toEqual('');
  });

  it('should return true if changes field exists', () => {
    const result = component.isChanged(component.currentRelationships[0].relationshipKey);

    expect(result).toEqual(true);
  });

  it('should return false if changes field does not exist', () => {
    const result = component.isChanged(component.currentRelationships[2].relationshipKey);

    expect(result).toEqual(false);
  });

  it('should return data if field exist in comparing outlet relationship data', () => {
    const result = component.getFieldDataFromComparingData(
      'relationshipDefCode',
      comparingOutletRelationshipSnapshotEntryMock.outletRelationships[0]
    );

    expect(result).toEqual('related_to_logistic_center');
  });

  it('should return undefined if field does not exist in comparing outlet relationship data', () => {
    const result = component.getFieldDataFromComparingData(
      'businessSiteId',
      comparingOutletRelationshipSnapshotEntryMock.outletRelationships[1]
    );

    expect(result).toEqual(undefined);
  });
});
