import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TestingModule } from '../../../testing/testing.module';

import {DuplicateKeyTypes} from './duplicate-key-types.model';
import { OutletErrorNotificationComponent } from './outlet-error-notification.component';

@Component({
  template:
    '<gp-outlet-error-notification [businessSiteId]="outletId" [registeredOfficeId]="registeredOfficeId"></gp-outlet-error-notification>'
})
class TestComponent {
  @ViewChild(OutletErrorNotificationComponent)
  outletErrorNotificationComponent: OutletErrorNotificationComponent;
  outletId = 'GS0000002';
  registeredOfficeId = '';
}

describe('OutletErrorNotificationComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OutletErrorNotificationComponent, TestComponent],
        imports: [TestingModule],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should get business site ID', done => {
      fixture.detectChanges();

      component.outletErrorNotificationComponent.businessSiteId.subscribe(businessSiteId => {
        expect(businessSiteId).toEqual('GS0000002');
        done();
      });
    });

    it('should get registered office ID', () => {
      component.registeredOfficeId = 'GS0000001';
      fixture.detectChanges();

      expect(component.outletErrorNotificationComponent.companysRegisteredOfficeId).toEqual(
        'GS0000001'
      );
    });

    it('should get empty registered office ID', () => {
      component.registeredOfficeId = '';
      fixture.detectChanges();

      expect(component.outletErrorNotificationComponent.companysRegisteredOfficeId).toEqual('');
    });
  });

  describe('setError', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should set error', () => {
      component.outletErrorNotificationComponent.setError('test', true);
      expect(component.outletErrorNotificationComponent.errors.size).toBe(1);
    });

    it('should clear error', () => {
      component.outletErrorNotificationComponent.setError('test', true);
      component.outletErrorNotificationComponent.setError('test', false);
      expect(component.outletErrorNotificationComponent.errors.size).toBe(0);
    });

    it('should return error', () => {
      component.outletErrorNotificationComponent.setError('test', true);
      expect(component.outletErrorNotificationComponent.hasError('test')).toBe(true);
    });
  });

  describe('clear errors', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should clear error when outletId changes', () => {
      const errorsClearSpy = jest.spyOn(component.outletErrorNotificationComponent.errors, 'clear');
      component.outletId = 'GS001';
      component.outletErrorNotificationComponent.setError('test', true);

      component.outletId = 'GS002';
      fixture.detectChanges();
      expect(errorsClearSpy).toHaveBeenCalled();
      expect(component.outletErrorNotificationComponent.errors.size).toBe(0);
    });
  });

  describe('hasDuplicateKeysError()', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should return true when duplicate brand code exists', () => {
      component.outletErrorNotificationComponent.setError(DuplicateKeyTypes.BrandCodes.toString(), true);
      const hasErrors = component.outletErrorNotificationComponent.hasDuplicateKeyErrors();

      expect(hasErrors).toBeTruthy();
    });

    it('should return true when duplicate AdamId exists', () => {
      component.outletErrorNotificationComponent.setError(DuplicateKeyTypes.AdamId.toString(), true);
      const hasErrors = component.outletErrorNotificationComponent.hasDuplicateKeyErrors();

      expect(hasErrors).toBeTruthy();
    });

    it('should return true when duplicate FederalId exists', () => {
      component.outletErrorNotificationComponent.setError(DuplicateKeyTypes.FederalId.toString(), true);
      const hasErrors = component.outletErrorNotificationComponent.hasDuplicateKeyErrors();

      expect(hasErrors).toBeTruthy();
    });

    it('should return true when multiple duplicates exists', () => {
      component.outletErrorNotificationComponent.setError(DuplicateKeyTypes.BrandCodes.toString(), true);
      component.outletErrorNotificationComponent.setError(DuplicateKeyTypes.AdamId.toString(), true);
      const hasErrors = component.outletErrorNotificationComponent.hasDuplicateKeyErrors();

      expect(hasErrors).toBeTruthy();
    });

    it('should return false when duplicate brand code is removed', () => {
      component.outletErrorNotificationComponent.setError(DuplicateKeyTypes.BrandCodes.toString(), false);
      const hasErrors = component.outletErrorNotificationComponent.hasDuplicateKeyErrors();
      expect(hasErrors).toBeFalsy();
    });
  });
});
