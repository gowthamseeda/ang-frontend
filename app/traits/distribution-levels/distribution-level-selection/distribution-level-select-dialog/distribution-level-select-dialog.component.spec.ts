import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { TestingModule } from '../../../../testing/testing.module';
import { DistributionLevelsService } from '../../distribution-levels.service';

import { DistributionLevelSelectDialogComponent } from './distribution-level-select-dialog.component';

describe('DistributionLevelSelectDialogComponent', () => {
  let component: DistributionLevelSelectDialogComponent;
  let fixture: ComponentFixture<DistributionLevelSelectDialogComponent>;
  let matDialogSpy: Spy<MatDialog>;
  let distributionLevelServiceSpy: Spy<DistributionLevelsService>;

  beforeEach(
    waitForAsync(() => {
      matDialogSpy = createSpyFromClass(MatDialog);
      distributionLevelServiceSpy = createSpyFromClass(DistributionLevelsService);

      TestBed.configureTestingModule({
        imports: [TestingModule],
        declarations: [DistributionLevelSelectDialogComponent],
        providers: [
          { provide: MatDialog, useValue: matDialogSpy },
          { provide: MatDialogRef, useValue: {} },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              assignedDistributionLevelControl: new FormControl(),
              distributionLevels: ['RETAILER', 'WHOLESALER', 'MANUFACTURER'],
              editableDistributionLevels: ['RETAILER'],
              allEditable: true
            }
          },
          { provide: DistributionLevelsService, useValue: distributionLevelServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionLevelSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('removeDistributionLevel', () => {
    it('should remove remove distribution level', () => {
      component.data.assignedDistributionLevelControl.setValue(['RETAILER', 'WHOLESALER']);
      component.removeDistributionLevel('RETAILER', new Event('click'));

      expect(component.data.assignedDistributionLevelControl.value).not.toContain('RETAILER');
    });
  });

  describe('isEditable', () => {
    it('should be false when the level is not editable', () => {
      component.data.allEditable = false;
      distributionLevelServiceSpy.isDistributionLevelEditable.mockReturnValue(false);
      expect(component.isEditable('WHOLESALER')).toBeFalsy();
    });

    it('should be true when the level is editable', () => {
      distributionLevelServiceSpy.isDistributionLevelEditable.mockReturnValue(true);
      expect(component.isEditable('RETAILER')).toBeTruthy();
    });

    it('should be false when the level is not editable from input', () => {
      component.data.allEditable = false;
      expect(component.isEditable('WHOLESALER')).toBeFalsy();
    });

    it('should be false when all editable but one restricted', () => {
      component.data.allEditable = true;
      component.data.editableDistributionLevels = ['RETAILER'];
      expect(component.isEditable('WHOLESALER')).toBeFalsy();
    });

    it('should be true when all editable but one restricted', () => {
      component.data.allEditable = true;
      component.data.editableDistributionLevels = ['RETAILER'];
      expect(component.isEditable('RETAILER')).toBeTruthy();
    });
  });

  describe('isTestOutletDisable', () => {
    it('should be false when test outlet user and create page', () => {
      component.data.productResponsibleUser = true;
      component.data.isEditPage = false;
      expect(component.isTestOutletDisable('TEST_OUTLET')).toBeFalsy();
    })
    it('should be true when non test outlet user and create page', () => {
      component.data.productResponsibleUser = false;
      component.data.isEditPage = false;
      expect(component.isTestOutletDisable('TEST_OUTLET')).toBeTruthy();
    })
    it('should be true when test outlet user and edit page', () => {
      component.data.productResponsibleUser = true;
      component.data.isEditPage = true;
      expect(component.isTestOutletDisable('TEST_OUTLET')).toBeTruthy();
    })
    it('should be true when non test outlet user and edit page', () => {
      component.data.productResponsibleUser = false;
      component.data.isEditPage = true;
      expect(component.isTestOutletDisable('TEST_OUTLET')).toBeTruthy();
    })
    it('should be true when other distribution level', () => {
      component.data.productResponsibleUser = true;
      component.data.isEditPage = false;
      expect(component.isTestOutletDisable('WHOLESALER')).toBeFalsy();
    })
  });
});
