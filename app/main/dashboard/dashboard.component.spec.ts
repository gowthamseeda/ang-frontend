import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { NgxPermissionsAllowStubDirective } from 'ngx-permissions';
import { ContentChange } from 'ngx-quill';
import { UserAuthorizationService } from '../../iam/user/user-authorization.service';
import { getUserMock } from '../../iam/user/user.mock';
import { UserService } from '../../iam/user/user.service';
import { announcementMock } from '../../notifications/models/announcement.mock';
import { AnnouncementType } from '../../notifications/models/announcement.model';
import { AnnouncementService } from '../../notifications/services/announcement.service';
import { FeatureToggleService } from '../../shared/directives/feature-toggle/feature-toggle.service';
import { ApiService } from '../../shared/services/api/api.service';
import { ObjectStatus } from '../../shared/services/api/objectstatus.model';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { SnackBarService } from '../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../testing/testing.module';

import { DashboardComponent } from './dashboard.component';
import { MatDialog } from "@angular/material/dialog";
import { UserSettingsService } from "../../user-settings/user-settings/services/user-settings.service";
import { of } from "rxjs";

describe('DashboardComponent', () => {
  const userMock = getUserMock();

  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let userServiceSpy: Spy<UserService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let userSettingsServiceSpy: Spy<UserSettingsService>;
  let featureToggleServiceSpy: Spy<FeatureToggleService>;
  let announcementServiceSpy: Spy<AnnouncementService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let matDialogSpy: Spy<MatDialog>;

  beforeEach(waitForAsync(() => {
    userServiceSpy = createSpyFromClass(UserService);
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userSettingsServiceSpy = createSpyFromClass(UserSettingsService)
    featureToggleServiceSpy = createSpyFromClass(FeatureToggleService);
    announcementServiceSpy = createSpyFromClass(AnnouncementService);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);

    TestBed.configureTestingModule({
      imports: [TestingModule, TranslateModule.forRoot({})],
      declarations: [DashboardComponent, NgxPermissionsAllowStubDirective],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        ApiService,
        LoggingService,
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: UserService, useValue: userServiceSpy },
        {
          provide: UserAuthorizationService,
          useValue: {
            isAuthorizedFor: userAuthorizationServiceSpy
          }
        },
        { provide: UserSettingsService, useValue: userSettingsServiceSpy },
        { provide: FeatureToggleService, useValue: featureToggleServiceSpy },
        { provide: AnnouncementService, useValue: announcementServiceSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    userServiceSpy.getCurrent.nextWith(userMock);
    userServiceSpy.getRoles.nextWith(['GSSNPLUS.ProductResponsible']);
    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.verify.nextWith(true);
    userSettingsServiceSpy.get.mockReturnValue(of({ doNotShowPopUpSecurityMessage: false }))
    userSettingsServiceSpy.fetchUserAgreementStatus.mockReturnValue(of(false))
    featureToggleServiceSpy.isFeatureEnabled.nextWith(true);
    matDialogSpy = createSpyFromClass(MatDialog);

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get current user, feature toggle and user permissions', () => {
    spyOn(component, 'showSecurityPopUp');
    sessionStorage.removeItem('SeenSecurityPopUp');

    component.ngOnInit();
    expect(userServiceSpy.getCurrent).toHaveBeenCalled();
    expect(featureToggleServiceSpy.isFeatureEnabled).toHaveBeenCalledWith('DASHBOARD_ANNOUNCEMENT');
    expect(component.announcementFeature).toBeTruthy();
    expect(userAuthorizationServiceSpy.permissions).toHaveBeenCalledWith([
      'notifications.announcement.update'
    ]);
    expect(userSettingsServiceSpy.fetchUserAgreementStatus).toHaveBeenCalled();
    expect(sessionStorage.getItem('SeenSecurityPopUp')).toBe('TRUE');
    expect(component.showSecurityPopUp).toHaveBeenCalled();
    expect(component.readOnly).toBeFalsy();
  });

  describe('should get announcement', () => {
    it('should handle get success', () => {
      announcementServiceSpy.get.nextWith(announcementMock);
      component.editorCreated();
      expect(announcementServiceSpy.get).toHaveBeenCalledWith(AnnouncementType.DASHBOARD, 'en');
      expect(component.formGroup.controls.content.value).toEqual(announcementMock.content);
    });

    it('should handle get failure', () => {
      announcementServiceSpy.get.throwWith('');
      const spy = jest.spyOn(component.formGroup, 'patchValue');
      component.editorCreated();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  it('should update word count on content changed', () => {
    component.maxWordCount = 5;

    component.contentChanged({ text: 'this is a test' } as ContentChange);
    expect(component.currentWordCount).toEqual(4);
    expect(component.formGroup.invalid).toBeFalsy();

    component.contentChanged({ text: 'this is a test or not' } as ContentChange);
    expect(component.currentWordCount).toEqual(6);
    expect(component.formGroup.invalid).toBeTruthy();
  });

  describe('should save announcement', () => {
    beforeEach(() => {
      component.formGroup.patchValue({ content: announcementMock.content });
      component.formGroup.markAsDirty();
    });

    it('should handle save success', () => {
      announcementServiceSpy.update.nextWith({} as ObjectStatus);
      component.save();
      expect(announcementServiceSpy.update).toHaveBeenCalledWith(announcementMock);
      expect(component.formGroup.pristine).toBeTruthy();
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('DASHBOARD_ANNOUNCEMENT_SUCCESS');
      expect(component.editMode).toBeFalsy();
    });

    it('should handle save failure', () => {
      announcementServiceSpy.update.throwWith('');
      component.save();
      expect(component.formGroup.pristine).toBeFalsy();
      expect(snackBarServiceSpy.showError).toHaveBeenCalled();
    });
  });

  it('should handle cancel', () => {
    component.formGroup.patchValue({ content: 'test' });
    component.cancel();
    expect(component.formGroup.controls.content.value).toEqual('');
    expect(component.formGroup.pristine).toBeTruthy();
  });

  it('should return can deactivate', () => {
    component.formGroup.markAsPristine();
    let canDeactivate = component.canDeactivate();
    expect(canDeactivate).toBeTruthy();

    component.formGroup.markAsDirty();
    canDeactivate = component.canDeactivate();
    expect(canDeactivate).toBeFalsy();
  });

  describe('should convert raw content', () => {
    it('should handle valid JSON content', () => {
      fixture.debugElement.componentInstance.content = '{"ops":[{"insert":"test\\n"}]}';
      const delta = component.contentAsDelta();
      const expected = JSON.parse(announcementMock.content);
      expect(delta).toEqual(expected);
    });

    it('should handle invalid content', () => {
      spyOn(console, 'error');
      fixture.debugElement.componentInstance.content = 'invalid';
      component.contentAsDelta();
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle no content', () => {
      fixture.debugElement.componentInstance.content = '';
      const delta = component.contentAsDelta();
      expect(delta).toEqual({ ops: [] });
    });
  });
});
