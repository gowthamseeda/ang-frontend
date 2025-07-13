import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {createSpyFromClass, Spy} from 'jest-auto-spies';
import { TestingModule } from '../../../../testing/testing.module';
import { ValidityConfirmationComponent } from './validity-confirmation.component';
import { UserSettingsService } from "../../../../user-settings/user-settings/services/user-settings.service";
import { SnackBarService } from "../../../../shared/services/snack-bar/snack-bar.service";
import { of } from "rxjs";
import {
  mockData,
  mockDataWithUndefinedBrandProductGroups,
  dataWithMissingValidUntil
} from '../../services/validity-confirmation.component.mock';

describe('ValidityConfirmationComponent', () => {
  let component: ValidityConfirmationComponent;
  let fixture: ComponentFixture<ValidityConfirmationComponent>;
  let userSettingsServiceSpy: Spy<UserSettingsService>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  const mockDialogRef = { close: jasmine.createSpy('close') };

  beforeEach(waitForAsync(() => {
    userSettingsServiceSpy = createSpyFromClass(UserSettingsService);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    TestBed.configureTestingModule({
      declarations: [ValidityConfirmationComponent],
      imports: [TestingModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: UserSettingsService, useValue: userSettingsServiceSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidityConfirmationComponent);
    component = fixture.componentInstance;
    component.displayedColumns = ['service', 'brands', 'productGroups', 'validFrom', 'validUntil'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create and initialize outletIds, validRecords, and invalidRecords', () => {
    component.ngOnInit();

    expect(component.outletIds).toEqual(['GS001']);

    expect(component.validRecords.length).toBe(1);
    expect(component.validRecords[0].brandProductGroupsWithValidity.length).toBe(1);
    expect(component.validRecords[0].brandProductGroupsWithValidity[0].brandId).toBe('B1');

    expect(component.invalidRecords.length).toBe(1);
    expect(component.invalidRecords[0].brandProductGroupsWithValidity.length).toBe(1);
    expect(component.invalidRecords[0].brandProductGroupsWithValidity[0].brandId).toBe('B2');
 });
  
  it('should handle empty brandProductGroups', () => {
    component['data'] = mockDataWithUndefinedBrandProductGroups;
    component.ngOnInit();
    expect(component.validRecords.length).toBe(0);
    expect(component.invalidRecords.length).toBe(0);
  });

  it('should use validityTableRow.validUntil as fallback if validUntil is missing', () => {
    component['data'] = dataWithMissingValidUntil;
    component.ngOnInit();
    expect(component.validRecords[0].brandProductGroupsWithValidity[0].validUntil).toBe('2024-12-31');
  });

  it('should handle save user settings and close confirmation dialog', () => {
    const spy = jest.spyOn(component.dialogRef, 'close');

    userSettingsServiceSpy.updateUserDoNotShowMultiSelectConfirmationDialog.mockReturnValue(of(true));

    component.save();
    expect(userSettingsServiceSpy.updateUserDoNotShowMultiSelectConfirmationDialog).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(true);
    expect(snackBarServiceSpy.showError).not.toHaveBeenCalled();
  });

  it('should handle show snack bar error and close confirmation dialog when user settings save failed', () => {
    const spy = jest.spyOn(component.dialogRef, 'close');
    const error = new Error('Error!');

    userSettingsServiceSpy.updateUserDoNotShowMultiSelectConfirmationDialog.throwWith(error)

    component.save();
    expect(userSettingsServiceSpy.updateUserDoNotShowMultiSelectConfirmationDialog).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(true);
    expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
  });

  it('should handle cancel', () => {
    const spy = jest.spyOn(component.dialogRef, 'close');
    component.cancel();
    expect(spy).toHaveBeenCalledWith(false);
  });
});
