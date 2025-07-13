//import 'zone.js';
//import 'zone.js/dist/zone-testing';
//import 'zone.js/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
//waitForAsync

import { TestingModule } from '../../../testing/testing.module';
import { outletChangesMock, outletSnapshotMock } from '../../models/outlet-history-snapshot.mock';
import { outletHistoryDataClusterFields } from '../../models/outlet-history-tree.constants';
import { OutletHistoryDataCluster } from '../../models/outlet-history-tree.model';
import { DataClusterSnapshotComponent } from './data-cluster-snapshot.component';
//import { TestBed } from "@angular/core/testing";
import { MatDialog } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { FeatureToggleService } from "../../../shared/directives/feature-toggle/feature-toggle.service";

declare const window: any;
window.__Zone_disable_requestAnimationFrame = true;
window.__Zone_disable_on_property = true;
window.__zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove'];

describe('DataClusterSnapshotComponent', () => {
  let component: DataClusterSnapshotComponent;
  let fixture: ComponentFixture<DataClusterSnapshotComponent>;
  let featureToggleServiceSpy: Spy<FeatureToggleService>;
  let matDialogSpy: Spy<MatDialog>;

  beforeEach(waitForAsync(() => {
    matDialogSpy = createSpyFromClass(MatDialog);
    featureToggleServiceSpy = createSpyFromClass(FeatureToggleService);

    TestBed.configureTestingModule({
      declarations: [DataClusterSnapshotComponent],
      imports: [TestingModule],
      providers: [
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: FeatureToggleService, useValue: featureToggleServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    //TestBed.initTestEnvironment();
    /*TestBed.configureTestingModule({
      declarations: [DataClusterSnapshotComponent],
      imports: [TestingModule],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();*/

    featureToggleServiceSpy.isFeatureEnabled.nextWith(true);
    fixture = TestBed.createComponent(DataClusterSnapshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should find correct dataCluster fields', () => {
      const dataCluster = OutletHistoryDataCluster.BASE_DATA;
      component.dataCluster = dataCluster;

      component.ngOnInit();

      expect(component.dataClusterFields).toEqual(outletHistoryDataClusterFields[dataCluster]);
    });
  });

  describe('getFieldData', () => {
    const addressObj = {
      street: 'Test Street'
    };

    beforeEach(() => {
      component.currentSnapshot = outletSnapshotMock;
    });

    it('should get data from currentSnapshot if nestedSnapshot is null', () => {
      const fieldName = 'companyId';
      const result = component.getFieldData(fieldName);

      expect(result).toEqual(outletSnapshotMock.companyId);
    });

    it('should get data from pass in object if nestedSnapshot is not null', () => {
      const fieldName = 'street';
      const result = component.getFieldData(fieldName, addressObj);

      expect(result).toEqual(addressObj.street);
    });

    it('should return undefined if fieldName is not found in currentSnapshot', () => {
      const fieldName = 'notFoundField';
      const result = component.getFieldData(fieldName);

      expect(result).toBeUndefined();
    });

    it('should return undefined if fieldName is not found in pass in object', () => {
      const fieldName = 'notFoundField';
      const result = component.getFieldData(fieldName, addressObj);

      expect(result).toBeUndefined();
    });
  });

  describe('getComparingFieldData', () => {
    const addressObj = {
      street: 'Test Street'
    };

    beforeEach(() => {
      component.comparingSnapshot = outletSnapshotMock;
    });

    it('should get data from currentSnapshot if nestedSnapshot is null', () => {
      const fieldName = 'companyId';
      const result = component.getComparingFieldData(fieldName);

      expect(result).toEqual(outletSnapshotMock.companyId);
    });

    it('should get data from pass in object if nestedSnapshot is not null', () => {
      const fieldName = 'street';
      const result = component.getComparingFieldData(fieldName, addressObj);

      expect(result).toEqual(addressObj.street);
    });

    it('should return undefined if fieldName is not found in currentSnapshot', () => {
      const fieldName = 'notFoundField';
      const result = component.getComparingFieldData(fieldName);

      expect(result).toBeUndefined();
    });

    it('should return undefined if fieldName is not found in pass in object', () => {
      const fieldName = 'notFoundField';
      const result = component.getComparingFieldData(fieldName, addressObj);

      expect(result).toBeUndefined();
    });
  });

  describe('isChanged', () => {
    beforeEach(() => {
      component.changes = outletChangesMock;
    });

    it('should return true if fieldName exist in changedFields from API', () => {
      const fieldName = 'nameAddition';

      const result = component.isChanged(fieldName);
      expect(result).toBeTruthy();
    });

    it('should return false if fieldName does not exist in changedFields from API', () => {
      const fieldName = 'active';

      const result = component.isChanged(fieldName);
      expect(result).toBeFalsy();
    });
  });

  describe('getChangeEditor', () => {
    beforeEach(() => {
      component.changes = outletChangesMock;
    });

    it('should return userId if fieldName exist in changedFields from API', () => {
      const fieldName = 'nameAddition';

      const result = component.getChangeEditor(fieldName);
      expect(result).toEqual('USER');
    });

    it('should return empty string if fieldName does not exist in changedFields from API', () => {
      const fieldName = 'active';

      const result = component.getChangeEditor(fieldName);
      expect(result).toEqual('');
    });
  });

  describe('clean and set move outlet variable', () => {
    beforeEach(() => {
      component.changes = outletChangesMock;
    });

    it('should set isMoveOutlet to false and clean move outlet initiator', () => {
      component.cleanMoveOutletVariable();
      expect(component.isMoveOutlet).toEqual(false);
      expect(component.moveOutletInitiator).toEqual('');
    });

    it('should return empty string if fieldName does not exist in changedFields from API', () => {
      component.setMoveOutletVariable();
      expect(component.isMoveOutlet).toEqual(true);
      expect(component.moveOutletInitiator).toEqual("TESTER");
    });
  });
});
