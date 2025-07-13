import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { TestingModule } from '../../../../testing/testing.module';
import { outletRelationshipsMock } from '../../models/outlet-relationships.mock';
import { OutletRelationship } from '../../models/outlet-relationships.model';
import { OutletRelationshipsService } from '../../services/outlet-relationships.service';

import { OutletRelationshipsTableComponent } from './outlet-relationships-table.component';

const businessSiteId = 'GS0000001';
const mockOutletRelationships: OutletRelationship[] = outletRelationshipsMock.outletRelationships;

describe('OutletRelationshipsTableComponent', () => {
  let component: OutletRelationshipsTableComponent;
  let fixture: ComponentFixture<OutletRelationshipsTableComponent>;
  let outletRelationshipsServiceSpy: Spy<OutletRelationshipsService>;
  let matDialogSpy: Spy<MatDialog>;

  beforeEach(waitForAsync(() => {
    outletRelationshipsServiceSpy = createSpyFromClass(OutletRelationshipsService);
    matDialogSpy = createSpyFromClass(MatDialog);

    outletRelationshipsServiceSpy.get.nextWith(mockOutletRelationships);

    TestBed.configureTestingModule({
      declarations: [OutletRelationshipsTableComponent],
      imports: [TestingModule],
      providers: [
        UntypedFormBuilder,
        { provide: OutletRelationshipsService, useValue: outletRelationshipsServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletRelationshipsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should init form', () => {
    it('should init form on outletId change', () => {
      const spy = spyOn(component, 'initForm');
      component.outletId = businessSiteId;
      expect(spy).toHaveBeenCalled();
    });

    it('should handle init form', () => {
      const spy = spyOn(component, 'emitUpdateForm');
      component.outletId = businessSiteId;
      expect(outletRelationshipsServiceSpy.get).toHaveBeenCalledWith(businessSiteId);
      expect(component.form).toBeTruthy();
      expect(component.formArr).toHaveLength(mockOutletRelationships.length);
      expect(spy).toHaveBeenCalledTimes(mockOutletRelationships.length);
    });
  });

  it('should handle add outletRelationship', () => {
    const spy = spyOn(component, 'pushToFormArray').and.callThrough();
    component.initForm();
    component.addOutletRelationship();
    expect(spy).toHaveBeenCalledWith(expect.any(Number));
    expect(component.formArr.dirty).toBeTruthy();
    expect(component.formArr).toHaveLength(mockOutletRelationships.length + 1);
  });

  it('should handle remove outletRelationship', () => {
    component.initForm();
    component.removeOutletRelationship(0);
    expect(component.formArr.dirty).toBeTruthy();
    expect(component.formArr).toHaveLength(2);
  });

  it('should handle outlets dialog', () => {
    matDialogSpy.open.mockReturnValue({ afterClosed: () => of(businessSiteId) });
    component.initForm();
    component.openOutletsDialog(component.formArr.controls[0]);
    expect(component.formArr.controls[0].get('relatedBusinessSiteId')?.value).toEqual(
      businessSiteId
    );
    expect(component.formArr.controls[0].dirty).toBeTruthy();
  });

  it('should emit update form', fakeAsync(() => {
    const spy = spyOn(component.updateForm, 'emit');
    component.initForm();
    component.dataSource.data = [];
    component.emitUpdateForm();

    tick();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
      expect(component.dataSource.data).toMatchObject(component.formArr.controls);
    });
  }));

  it('should display custom div when data source has no data', () => {
    component.initForm();
    component.formArr.reset();
    const customDiv = fixture.nativeElement.querySelector('.no-relationship');
    expect(customDiv).toBeTruthy();
  });
  it('should not display custom div when data source has data', () => {
    component.initForm();
    fixture.detectChanges();
    const customDiv = fixture.nativeElement.querySelector('.no-relationship');
    expect(customDiv).toBeFalsy();
  });
});
