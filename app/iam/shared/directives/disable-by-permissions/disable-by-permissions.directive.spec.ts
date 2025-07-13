import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { UserAuthorizationService } from '../../../user/user-authorization.service';

import { DisableByPermissionsDirective } from './disable-by-permissions.directive';

@Component({
  template: `
    <input type="text" [gpDisableByPermission]="['legalstructure.businesssite.update']" />
  `
})
class TestDisableByPermissionContainerComponent {}

describe('DisableByPermission', () => {
  let component: TestDisableByPermissionContainerComponent;
  let fixture: ComponentFixture<TestDisableByPermissionContainerComponent>;
  let debugElement: DebugElement;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;

  beforeEach(
    waitForAsync(() => {
      userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
      userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);

      TestBed.configureTestingModule({
        declarations: [DisableByPermissionsDirective, TestDisableByPermissionContainerComponent],
        providers: [
          {
            provide: UserAuthorizationService,
            useValue: { isAuthorizedFor: userAuthorizationServiceSpy }
          }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDisableByPermissionContainerComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    userAuthorizationServiceSpy.verify.nextWith(false);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should be created', () => {
    userAuthorizationServiceSpy.verify.nextWith(true);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('input'));

    expect(debugElement).toBeTruthy();
  });

  it('should not be disabled', () => {
    userAuthorizationServiceSpy.verify.nextWith(true);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css(':disabled'));

    expect(debugElement).toBeNull();
  });

  it('should be disabled', () => {
    userAuthorizationServiceSpy.verify.nextWith(false);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css(':disabled'));

    expect(debugElement).toBeTruthy();
  });
});
