import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { TranslateDataPipe } from '../../../../shared/pipes/translate-data/translate-data.pipe';
import { LocaleService } from '../../../../shared/services/locale/locale.service';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import { UserSettingsService } from '../../../../user-settings/user-settings/services/user-settings.service';
import {
  getAllCloseDownReasonsForBusinessSiteMock,
  getAllCloseDownReasonsForCompanyMock
} from '../../../close-down-reasons/close-down-reasons.mock';
import { CloseDownReasonsService } from '../../../close-down-reasons/close-down-reasons.service';
import { MessageService } from '../../services/message.service';
import { OutletService } from '../../services/outlet.service';

import { StatusComponent } from './status.component';

function getOutletFormMock() {
  return new FormBuilder().group({
    startOperationDate: '',
    closeDownDate: '',
    closeDownReasonId: ''
  });
}

describe('StatusComponent', () => {
  let component: StatusComponent;
  let fixture: ComponentFixture<StatusComponent>;

  let closeDownReasonsServiceSpy: Spy<CloseDownReasonsService>;
  let userSettingsServiceSpy: Spy<UserSettingsService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;

  let messageServiceSpy: Spy<MessageService>;
  let outletServiceSpy: Spy<OutletService>;
  let localeServiceSpy: Spy<LocaleService>;

  beforeEach(
    waitForAsync(() => {
      closeDownReasonsServiceSpy = createSpyFromClass(CloseDownReasonsService);
      userSettingsServiceSpy = createSpyFromClass(UserSettingsService);
      userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
      userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
      userAuthorizationServiceSpy.verify.nextWith(true);

      messageServiceSpy = createSpyFromClass(MessageService);
      outletServiceSpy = createSpyFromClass(OutletService);

      closeDownReasonsServiceSpy.getAllValidForCompany.nextWith(
        getAllCloseDownReasonsForCompanyMock()
      );
      closeDownReasonsServiceSpy.getAllValidForBusinessSite.nextWith(
        getAllCloseDownReasonsForBusinessSiteMock()
      );

      localeServiceSpy = createSpyFromClass(LocaleService);
      localeServiceSpy.currentBrowserLocale.nextWith('en-GB');

      TestBed.configureTestingModule({
        declarations: [StatusComponent, TranslatePipeMock, TranslateDataPipe],
        providers: [
          { provide: CloseDownReasonsService, useValue: closeDownReasonsServiceSpy },
          { provide: UserSettingsService, useValue: userSettingsServiceSpy },
          {
            provide: UserAuthorizationService,
            useValue: { isAuthorizedFor: userAuthorizationServiceSpy }
          },
          { provide: MessageService, useValue: messageServiceSpy },
          { provide: OutletService, useValue: outletServiceSpy },
          { provide: LocaleService, useValue: localeServiceSpy },
          {
            provide: DateAdapter,
            useValue: {
              setLocale: jest.fn()
            }
          }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusComponent);
    component = fixture.componentInstance;
    component.parentForm = getOutletFormMock();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate form as valid', () => {
    expect(component.parentForm.valid).toBeTruthy();
  });

  it('should validate form as valid when start operation date is set', () => {
    fixture.detectChanges();
    component.parentForm.patchValue({
      startOperationDate: new Date(2000, 1, 1)
    });
    expect(component.parentForm.valid).toBeTruthy();
  });

  it('should set datesChanged false', () => {
    expect(component.datesChanged).toBeFalsy();
  });

  it('should change datesChanged to true, if startOperationDate changes', () => {
    component.parentForm.patchValue({
      startOperationDate: new Date(2000, 1, 1)
    });
    fixture.detectChanges();
    expect(component.datesChanged).toBeFalsy();
  });

  it('should change datesChanged to true, if closeDownDate changes', () => {
    component.parentForm.patchValue({
      closeDownDate: new Date(2000, 1, 1)
    });
    fixture.detectChanges();
    expect(component.datesChanged).toBeFalsy();
  });

  it('should disable parentForm', () => {
    component.duplicatesExists('');
    expect(component.parentForm.disabled).toBeTruthy();
  });

  it('should validate form as valid when start operation, close down date and the close down reason are set', () => {
    fixture.detectChanges();
    component.parentForm.patchValue({
      startOperationDate: new Date(2000, 1, 1)
    });
    component.parentForm.patchValue({
      closeDownDate: new Date(2099, 12, 31)
    });
    component.parentForm.patchValue({
      closeDownReasonId: 1
    });
    expect(component.parentForm.valid).toBeTruthy();
  });

  it('should validate form as valid when close down date and the close down reason are set', () => {
    fixture.detectChanges();
    component.parentForm.patchValue({
      closeDownDate: new Date(2099, 12, 31)
    });
    component.parentForm.patchValue({
      closeDownReasonId: 1
    });
    expect(component.parentForm.valid).toBeTruthy();
  });

  it('should hide close down reason if user does not have update permission', () => {
    userAuthorizationServiceSpy.verify.nextWith(false);
    component.parentForm.patchValue({
      closeDownDate: new Date(2099, 12, 31)
    });
    fixture.detectChanges();
    expect(component.showCloseDownReason()).toBeFalsy();
  });

  it('should show close down reason if user does not have update permission', () => {
    userAuthorizationServiceSpy.verify.nextWith(true);
    component.parentForm.patchValue({
      closeDownDate: new Date(2099, 12, 31)
    });
    fixture.detectChanges();
    expect(component.showCloseDownReason()).toBeTruthy();
  });

  it('should filter close down reason "company closed" if outlet close down reason is NOT "company closed"', () => {
    const filteredCloseDownReasons = getAllCloseDownReasonsForBusinessSiteMock().filter(
      cdr => cdr.id !== 1
    );
    component.parentForm.patchValue({
      startOperationDate: new Date(2000, 1, 1)
    });
    component.parentForm.patchValue({
      closeDownDate: new Date(2099, 12, 31)
    });
    component.parentForm.patchValue({
      closeDownReasonId: 2
    });
    fixture.detectChanges();
    expect(component.closeDownReasons).toEqual(filteredCloseDownReasons);
  });

  it('should filter close down reason "company closed" if outlet close down reason is empty', () => {
    const filteredCloseDownReasons = getAllCloseDownReasonsForBusinessSiteMock().filter(
      cdr => cdr.id !== 1
    );
    fixture.detectChanges();
    expect(component.closeDownReasons).toEqual(filteredCloseDownReasons);
  });
});
