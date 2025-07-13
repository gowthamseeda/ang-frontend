import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { UserAuthorizationService } from '../../../user/user-authorization.service';

import { ShowByPermissionsDirective } from './show-by-permissions.directive';

@Component({
  template: `<div *gpShowByPermissions="['app.show']"></div>`
})
class TestComponent {}

describe('ShowByPermissionsDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  const userAuthorizationServiceSpy = { permissions: { verify: jest.fn() } };

  beforeAll(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, ShowByPermissionsDirective],
      providers: [
        {
          provide: UserAuthorizationService,
          useValue: userAuthorizationServiceSpy
        }
      ]
    });
    fixture = TestBed.createComponent(TestComponent);
  });

  describe('#ngOnInit', () => {
    it('should show template', () => {
      jest.spyOn(userAuthorizationServiceSpy.permissions, 'verify').mockReturnValue(of(true));

      expect(fixture.debugElement.queryAll(By.css('div')).length).toEqual(0);
    });
  });
});
