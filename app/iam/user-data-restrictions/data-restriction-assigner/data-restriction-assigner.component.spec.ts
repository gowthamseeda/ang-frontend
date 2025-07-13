import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { TranslatePipeMock } from '../../../testing/pipe-mocks/translate';

import { DataRestrictionAssignerComponent } from './data-restriction-assigner.component';

describe('DataRestrictionAssignerComponent', () => {
  let component: DataRestrictionAssignerComponent;
  let fixture: ComponentFixture<DataRestrictionAssignerComponent>;

  let matDialogSpy: Spy<MatDialog>;

  beforeEach(
    waitForAsync(() => {
      matDialogSpy = createSpyFromClass(MatDialog);

      TestBed.configureTestingModule({
        declarations: [DataRestrictionAssignerComponent, TranslatePipeMock],
        providers: [{ provide: MatDialog, useValue: matDialogSpy }],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRestrictionAssignerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('remove', () => {
    it('should remove the given item', () => {
      component.assignedDataRestrictionValues = ['ITEM-1', 'ITEM-2', 'ITEM-2'];
      component.remove('ITEM-1');

      expect(component.assignedDataRestrictionValues).toEqual(['ITEM-2', 'ITEM-2']);
    });

    it('should remove nothing if the given has no match', () => {
      component.assignedDataRestrictionValues = ['ITEM-1', 'ITEM-2', 'ITEM-2'];
      component.remove('NON-EXISTENT-ITEM');

      expect(component.assignedDataRestrictionValues.length).toBe(3);
    });
  });

  describe('openDialog', () => {
    beforeEach(() => {
      component.assignedDataRestrictionValues = ['ALREADY'];
      component.dataRestrictionId = 'Company';
    });

    it('should add value to assigned data restriction values after closing dialog', () => {
      matDialogSpy.open.mockReturnValue({ afterClosed: () => of('NEW') });

      component.openDialog();

      expect(component.assignedDataRestrictionValues).toEqual(['ALREADY', 'NEW']);
    });

    it('should add nothing when canceling the dialog', () => {
      matDialogSpy.open.mockReturnValue({ afterClosed: () => of(undefined) });

      component.openDialog();

      expect(component.assignedDataRestrictionValues).toEqual(['ALREADY']);
    });

    it('should open dialog with the assignedDataRestrictionValues', () => {
      matDialogSpy.open.mockReturnValue({ afterClosed: () => of(undefined) });

      component.openDialog();

      expect(matDialogSpy.open).toHaveBeenCalledWith(jasmine.anything(), {
        width: '320px',
        height: '250px',
        data: { dataRestrictionId: 'Company', assignedDataRestrictionValues: ['ALREADY'] }
      });
    });
  });
});
