import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { nullSafeValue } from '../../../testing/test-utils/test-utils';
import { TestingModule } from '../../../testing/testing.module';
import { OutletService } from '../../shared/services/outlet.service';
import { LegalNameComponent } from '../../shared/components/legal-name/legal-name.component';
import { LocationService } from '../../location/services/location-service.model';
import { getCompanyMock } from '../company.mock';

import { CompanyFormComponent } from './company-form.component';

@Component({ template: '<gp-company-form [parentForm]="parentForm"></gp-company-form>' })
class EmptyCompanyTestComponent {
  @ViewChild(CompanyFormComponent)
  public companyFormComponent: CompanyFormComponent;
  parentForm = new FormGroup({ test: new FormControl('') });
}

@Component({
  template: '<gp-company-form [parentForm]="parentForm" [company]="company"></gp-company-form>'
})
class TestComponent {
  @ViewChild(CompanyFormComponent)
  public companyFormComponent: CompanyFormComponent;
  parentForm = new FormGroup({ test: new FormControl() });
  company = getCompanyMock();
}

describe('CompanyFormComponent', () => {
  const companyMock = getCompanyMock();

  let outeletServiceSpy: Spy<OutletService>;
  let locationServiceSpy: Spy<LocationService>;

  beforeEach(
    waitForAsync(() => {
      outeletServiceSpy = createSpyFromClass(OutletService);
      outeletServiceSpy.isLegalNameEditableInCountry.mockReturnValue(true);
      locationServiceSpy = createSpyFromClass(LocationService);

      TestBed.configureTestingModule({
        declarations: [
          CompanyFormComponent,
          TestComponent,
          EmptyCompanyTestComponent,
          LegalNameComponent
        ],
        imports: [ReactiveFormsModule, TestingModule],
        providers: [
          { provide: OutletService, useValue: outeletServiceSpy },
          { provide: LocationService, useValue: locationServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      });
    })
  );

  describe('just formGroup is set', () => {
    let component: EmptyCompanyTestComponent;
    let fixture: ComponentFixture<EmptyCompanyTestComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(EmptyCompanyTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('company field should contain default values', () => {
      const legalName = nullSafeValue(component.companyFormComponent.parentForm.get('legalName'));
      expect(legalName.value).toBe(null);
    });
  });

  describe('formGroup and company input is set', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('company field should contain expected values', () => {
      const legalName = nullSafeValue(component.companyFormComponent.parentForm.get('legalName'));
      expect(legalName.value).toBe(companyMock.legalName);
    });
  });
});
