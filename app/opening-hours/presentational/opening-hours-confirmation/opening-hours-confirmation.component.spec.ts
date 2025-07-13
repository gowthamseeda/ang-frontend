import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { TestingModule } from './../../../testing/testing.module';
import { OpeningHoursConfirmationComponent } from './opening-hours-confirmation.component';
import { UserSettingsService } from "../../../user-settings/user-settings/services/user-settings.service";
import { SnackBarService } from "../../../shared/services/snack-bar/snack-bar.service";
import {of} from "rxjs";

describe('OpeningHoursConfirmationComponent', () => {
  let component: OpeningHoursConfirmationComponent;
  let fixture: ComponentFixture<OpeningHoursConfirmationComponent>;
  let userSettingsServiceSpy: Spy<UserSettingsService>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(
    waitForAsync(() => {
      userSettingsServiceSpy = createSpyFromClass(UserSettingsService);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);
      TestBed.configureTestingModule({
        declarations: [OpeningHoursConfirmationComponent],
        imports: [TestingModule],

        providers: [
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              firstDaySelected: false,
              secondDaySelected: false,
              offeredServiceIds: ['GS0000001-3'],
              event: undefined,
              services: [],
              blockedServices: []
            }
          },
          {
            provide: MatDialogRef,
            useValue: {
              close: () => {}
            }
          },
          {
            provide: UserSettingsService,
            useValue: userSettingsServiceSpy
          },
          {
            provide: SnackBarService,
            useValue: snackBarServiceSpy
          }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OpeningHoursConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle cancel', () => {
    const spy = jest.spyOn(component.dialogRef, 'close');
    component.cancel();
    expect(spy).toHaveBeenCalledWith(false);
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
});
