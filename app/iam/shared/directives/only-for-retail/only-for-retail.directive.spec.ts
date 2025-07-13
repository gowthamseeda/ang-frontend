import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { UserAuthorizationService } from '../../../user/user-authorization.service';
import { RetailRolloutService } from '../../services/retail-rollout/retail-rollout.service';

import { OnlyForRetailDirective } from './only-for-retail.directive';

@Component({
  template: '<div *gpOnlyForRetail="businessSiteId; permissions: permissions"></div>'
})
class TestComponent {
  businessSiteId?: string;
  permissions?: string[];
  restrictedCountryIds: string[];
}

describe('OnlyForRetailDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let retailRolloutServiceSpy: Spy<RetailRolloutService>;

  beforeEach(() => {
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.businessSite.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.verify.nextWith(true);

    retailRolloutServiceSpy = createSpyFromClass(RetailRolloutService);
    retailRolloutServiceSpy.isRolledOutFor.nextWith(true);

    TestBed.configureTestingModule({
      declarations: [TestComponent, OnlyForRetailDirective],
      providers: [
        {
          provide: UserAuthorizationService,
          useValue: {
            isAuthorizedFor: userAuthorizationServiceSpy
          }
        },

        {
          provide: RetailRolloutService,
          useValue: retailRolloutServiceSpy
        }
      ]
    });
    fixture = TestBed.createComponent(TestComponent);
  });

  describe('ngOnInit', () => {
    it('should only render the element for retail users', () => {
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('div')).length).toEqual(1);
    });

    it('should not render the element if not a retail user', () => {
      userAuthorizationServiceSpy.verify.nextWith(false);
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('div')).length).toEqual(0);
    });

    it('should also check for the given business site ID', () => {
      fixture.componentInstance.businessSiteId = 'GS123';
      fixture.detectChanges();

      expect(userAuthorizationServiceSpy.businessSite).toHaveBeenCalledWith('GS123');
    });

    it('should use default retail show permission if none provided', () => {
      fixture.detectChanges();

      expect(userAuthorizationServiceSpy.permissions).toHaveBeenCalledWith(['app.retail.show']);
    });

    it('should overwrite the default permissions with the given ones', () => {
      fixture.componentInstance.permissions = ['some.custom.permission'];
      fixture.detectChanges();

      expect(userAuthorizationServiceSpy.permissions).toHaveBeenCalledWith([
        'some.custom.permission'
      ]);
    });

    it('should not render the element if retail is not rolled out for the outlet country', () => {
      retailRolloutServiceSpy.isRolledOutFor.nextWith(false);
      fixture.componentInstance.businessSiteId = 'GS123';

      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('div')).length).toEqual(0);
    });
  });
});
