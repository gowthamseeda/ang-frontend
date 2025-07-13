import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { UserAuthorizationService } from '../../../user/user-authorization.service';

import { NotForRetailDirective } from './not-for-retail.directive';

@Component({
  template: '<div *gpNotForRetail></div>'
})
class TestComponent {}

describe('NotForRetailDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;

  beforeEach(() => {
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);

    TestBed.configureTestingModule({
      declarations: [TestComponent, NotForRetailDirective],
      providers: [
        {
          provide: UserAuthorizationService,
          useValue: {
            isAuthorizedFor: userAuthorizationServiceSpy
          }
        }
      ]
    });
    fixture = TestBed.createComponent(TestComponent);
  });

  describe('ngOnInit', () => {
    it('should remove the element for retail users', () => {
      userAuthorizationServiceSpy.verify.nextWith(true);
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('div')).length).toEqual(0);
    });

    it('should not remove the element if not a retail user', () => {
      userAuthorizationServiceSpy.verify.nextWith(false);
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('div')).length).toEqual(1);
    });
  });
});
