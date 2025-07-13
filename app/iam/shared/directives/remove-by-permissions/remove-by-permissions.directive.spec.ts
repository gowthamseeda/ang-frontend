import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { Observable, of } from 'rxjs';

import { UserAuthorizationService } from '../../../user/user-authorization.service';

import { RemoveByPermissionsDirective } from './remove-by-permissions.directive';

@Component({
  selector: 'gp-test-component',
  template:
    '<div id="test-id" *gpRemoveByPermission="[\'legalstructure.businesssite.update\'];isEmpty:isEmpty">Content</div>'
})
class TestRemoveByPermissionsComponent {
  isEmpty: Observable<boolean>;
}

describe('RemoveByPermissionsDirective', () => {
  let fixture: ComponentFixture<TestRemoveByPermissionsComponent>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;

  beforeEach(() => {
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);

    TestBed.configureTestingModule({
      declarations: [TestRemoveByPermissionsComponent, RemoveByPermissionsDirective],
      providers: [
        {
          RemoveByPermissionsDirective,
          provide: UserAuthorizationService,
          useValue: { isAuthorizedFor: userAuthorizationServiceSpy }
        }
      ]
    });
    fixture = TestBed.createComponent(TestRemoveByPermissionsComponent);
  });

  describe('has permission ', () => {
    beforeEach(() => {
      userAuthorizationServiceSpy.verify.nextWith(true);
    });

    it('and is not empty; div should be included in DOM', () => {
      fixture.componentInstance.isEmpty = of(false);
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('#test-id')).length).toEqual(1);
    });

    it('and is empty; div should be included in DOM', () => {
      fixture.componentInstance.isEmpty = of(true);
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('#test-id')).length).toEqual(1);
    });
  });

  describe('has no permission', () => {
    beforeEach(() => {
      userAuthorizationServiceSpy.verify.nextWith(false);
    });

    it('and is not empty; div should not be included in DOM', () => {
      fixture.componentInstance.isEmpty = of(false);
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('#test-id')).length).toEqual(1);
    });

    it('and is empty; div should not be included in DOM', () => {
      fixture.componentInstance.isEmpty = of(true);
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('#test-id')).length).toEqual(0);
    });
  });
});
