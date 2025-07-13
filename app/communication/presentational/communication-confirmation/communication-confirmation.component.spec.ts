import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { CommunicationConfirmationComponent } from './communication-confirmation.component';
import {UserSettingsService} from "../../../user-settings/user-settings/services/user-settings.service";
import {of} from "rxjs";

describe('CommunicationConfirmationComponent', () => {
  let component: CommunicationConfirmationComponent;
  let fixture: ComponentFixture<CommunicationConfirmationComponent>;
  let userSettingsServiceSpy: Spy<UserSettingsService>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(
    waitForAsync(() => {
      userSettingsServiceSpy = createSpyFromClass(UserSettingsService);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);

      TestBed.configureTestingModule({
        declarations: [CommunicationConfirmationComponent],
        imports: [TestingModule],
        providers: [
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              communicationBlockData: [],
              validityTableRow: {
                application: true,
                applicationValidUntil: '2019-01-01',
                validFrom: '2019-01-02',
                validUntil: '2019-01-31',
                offeredServicesMap: {
                  'GS0000001-3': {
                    id: 'GS0000001-3',
                    serviceId: 2,
                    productCategoryId: 2,
                    brandId: 'MB',
                    productGroupId: 'PC',
                    validity: {
                      application: true,
                      applicationValidUntil: '2019-01-01',
                      validFrom: '2019-01-02',
                      validUntil: '2019-01-31'
                    }
                  }
                }
              },
              blockServices: [],
              services: [],
              outletId: 'GS001'
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
    fixture = TestBed.createComponent(CommunicationConfirmationComponent);
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
