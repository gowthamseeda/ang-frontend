import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { UserAuthorizationService } from '../../../user/user-authorization.service';

import { OnlyOwnCountryDirective } from './only-own-country.directive';

@Component({
  template: '<div *gpOnlyOwnCountry="countryId; permissions: permissions"></div>'
})
class TestComponent {
  countryId = 'DE';
  permissions?: string[];
}

describe('OnlyOwnCountryDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;

  beforeEach(() => {
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.country.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.verify.nextWith(true);

    TestBed.configureTestingModule({
      declarations: [TestComponent, OnlyOwnCountryDirective],
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
    it('should only render the element if user authorized for country', () => {
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('div')).length).toEqual(1);
    });

    it('should not render the element if user not authorized for country', () => {
      userAuthorizationServiceSpy.verify.nextWith(false);
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('div')).length).toEqual(0);
    });

    it('should check for the given country ID', () => {
      fixture.detectChanges();

      expect(userAuthorizationServiceSpy.country).toHaveBeenCalledWith('DE');
    });

    it('should also check permissions in case provided', () => {
      fixture.componentInstance.permissions = ['some.custom.permission'];
      fixture.detectChanges();

      expect(userAuthorizationServiceSpy.permissions).toHaveBeenCalledWith([
        'some.custom.permission'
      ]);
    });
  });
});
