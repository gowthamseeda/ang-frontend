import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxPermissionsAllowStubDirective } from 'ngx-permissions';
import { TestingModule } from '../../testing/testing.module';
import { SecurityPopUpComponent } from './security-pop-up.component';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { createSpyFromClass, Spy } from "jest-auto-spies";
import { ApiService } from "../../shared/services/api/api.service";
import { LoggingService } from "../../shared/services/logging/logging.service";
import { UserService } from "../../iam/user/user.service";
import { getUserMock } from "../../iam/user/user.mock";
import {UserSettingsService} from "../../user-settings/user-settings/services/user-settings.service";

describe('SecurityPopUpComponent', () => {
  const userMock = getUserMock();

  let component: SecurityPopUpComponent;
  let fixture: ComponentFixture<SecurityPopUpComponent>;
  let matDialogSpy: Spy<MatDialog>;
  let userServiceSpy: Spy<UserService>;
  let userSettingsServiceSpy: Spy<UserSettingsService>;

  beforeEach(waitForAsync(() => {
    matDialogSpy = createSpyFromClass(MatDialog);
    userServiceSpy = createSpyFromClass(UserService);
    userSettingsServiceSpy = createSpyFromClass(UserSettingsService)

    TestBed.configureTestingModule({
      imports: [
        TestingModule
      ],
      declarations: [
        SecurityPopUpComponent,
        NgxPermissionsAllowStubDirective
      ],
      providers: [
        ApiService,
        LoggingService,
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: UserSettingsService, useValue: userSettingsServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityPopUpComponent);
    userServiceSpy.getCurrent.nextWith(userMock);
    userSettingsServiceSpy.getLanguageId.nextWith("en")
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call current user and user settings', () => {
    component.ngOnInit()
    expect(userServiceSpy.getCurrent).toHaveBeenCalled();
    expect(userSettingsServiceSpy.getLanguageId).toHaveBeenCalled();
  });
});
