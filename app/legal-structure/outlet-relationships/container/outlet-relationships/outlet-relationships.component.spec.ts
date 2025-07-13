import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../../testing/testing.module';
import { OutletService } from '../../../shared/services/outlet.service';
import { OutletRelationshipsTableComponent } from '../../presentational/outlet-relationships-table/outlet-relationships-table.component';
import { OutletRelationshipsService } from '../../services/outlet-relationships.service';
import { OutletRelationshipsComponent } from './outlet-relationships.component';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';

const businessSiteId = 'GS0000001';
const mockForm = new UntypedFormGroup({
  outletRelationships: new UntypedFormArray([
    new UntypedFormControl({
      relatedBusinessSiteId: businessSiteId,
      relationshipDefCode: 'LOGISTIC_CENTER',
      nonce: 0
    })
  ])
});

const mockOutlet = {
  legalName: 'Test Legal Name',
  companyLegalName: 'Test Company Legal Name',
  companyId: 'GC0000001',
  countryId: 'DE',
  address: {
    street: 'street',
    streetNumber: 'street number',
    zipCode: 'zipcode',
    city: 'city',
    district: 'district',
    addressAddition: 'addressAddition'
  },
  id: 'GS0000002',
  affiliate: true
};

@Component({
  selector: 'gp-outlet-relationships-table',
  template: '',
  providers: [
    {
      provide: OutletRelationshipsTableComponent,
      useClass: OutletRelationshipsTableStubComponent
    }
  ]
})
export class OutletRelationshipsTableStubComponent {
  form = mockForm;

  initForm(): void {}
}

class ActivatedRouteStub {
  paramMap = of({
    get: (value: any) => {
      return value === 'outletId' ? businessSiteId : null;
    }
  });

  fragment = of('myFragment');
}

describe('OutletRelationshipsComponent', () => {
  let component: OutletRelationshipsComponent;
  let fixture: ComponentFixture<OutletRelationshipsComponent>;
  let outletRelationshipsServiceSpy: Spy<OutletRelationshipsService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let outletServiceSpy: Spy<OutletService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let distributionLevelsServiceSpy: Spy<DistributionLevelsService>;

  beforeEach(async () => {
    outletRelationshipsServiceSpy = createSpyFromClass(OutletRelationshipsService);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    outletServiceSpy = createSpyFromClass(OutletService);
    outletServiceSpy.getOrLoadBusinessSite.nextWith(mockOutlet);
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.country.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.verify.nextWith(false);
    distributionLevelsServiceSpy = createSpyFromClass(DistributionLevelsService);
    distributionLevelsServiceSpy.getDistributionLevelsOfOutlet.nextWith([]);

    outletRelationshipsServiceSpy.update.nextWith(of({ status: 'UPDATED' }));

    await TestBed.configureTestingModule({
      declarations: [OutletRelationshipsComponent, OutletRelationshipsTableStubComponent],
      imports: [TestingModule],
      providers: [
        { provide: OutletRelationshipsService, useValue: outletRelationshipsServiceSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: OutletService, useValue: outletServiceSpy },
        {
          provide: UserAuthorizationService,
          useValue: {
            isAuthorizedFor: userAuthorizationServiceSpy
          }
        },
        { provide: DistributionLevelsService, useValue: distributionLevelsServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletRelationshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update form and validity', () => {
    const form = mockForm;
    component.outletRelationshipsTableComponent.form = form;
    component.updateFormAndValidity();
    expect(component.form).toMatchObject(form);
    expect(component.saveButtonDisabled).toBeTruthy();
    expect(component.cancelButtonDisabled).toBeTruthy();

    form.markAsDirty();
    component.updateFormAndValidity();
    expect(component.saveButtonDisabled).toBeFalsy();
    expect(component.cancelButtonDisabled).toBeFalsy();

    form.setErrors({});
    component.updateFormAndValidity();
    expect(component.saveButtonDisabled).toBeTruthy();
    expect(component.cancelButtonDisabled).toBeFalsy();
  });

  describe('should handle save', () => {
    it('should handle save success', () => {
      component.form = mockForm;
      component.save();

      expect(outletRelationshipsServiceSpy.update).toHaveBeenCalledWith(businessSiteId, {
        outletRelationships: [
          {
            relatedBusinessSiteId: businessSiteId,
            relationshipDefCode: 'LOGISTIC_CENTER'
          }
        ]
      });
      expect(component.form.pristine).toBeTruthy();
      expect(component.outletRelationshipsTableComponent.form.pristine).toBeTruthy();
      expect(component.saveButtonDisabled).toBeTruthy();
      expect(component.cancelButtonDisabled).toBeTruthy();
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith(
        'OUTLET_RELATIONSHIPS_UPDATE_SUCCESS'
      );
    });

    it('should handle save failure', () => {
      outletRelationshipsServiceSpy.update.throwWith('');

      component.form = mockForm;
      component.save();

      expect(component.saveButtonDisabled).toBeFalsy();
      expect(component.cancelButtonDisabled).toBeFalsy();
      expect(snackBarServiceSpy.showError).toHaveBeenCalled();
    });
  });

  it('should handle cancel', () => {
    const spy = jest.spyOn(component.outletRelationshipsTableComponent, 'initForm');
    component.cancel();
    expect(spy).toHaveBeenCalled();
  });

  it('should handle can deactivate', () => {
    component.saveButtonDisabled = true;
    component.cancelButtonDisabled = true;
    let canDeactivate = component.canDeactivate();
    expect(canDeactivate).toBeTruthy();

    component.saveButtonDisabled = true;
    component.cancelButtonDisabled = false;
    canDeactivate = component.canDeactivate();
    expect(canDeactivate).toBeFalsy();

    component.saveButtonDisabled = false;
    component.cancelButtonDisabled = true;
    canDeactivate = component.canDeactivate();
    expect(canDeactivate).toBeFalsy();
  });

  it('should set read/write access based on user restriction', done => {
    component.isAllowedEdit.subscribe(isEditable => {
      expect(isEditable).toBeFalsy();
      done();
    });
  });
});
