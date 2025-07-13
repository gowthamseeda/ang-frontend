import {Component, NO_ERRORS_SCHEMA, ViewChild} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {UntypedFormControl, ReactiveFormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {createSpyFromClass, Spy} from 'jest-auto-spies';

import {UserAuthorizationService} from '../../../iam/user/user-authorization.service';
import {UserService} from '../../../iam/user/user.service';
import {OutletService} from '../../../legal-structure/shared/services/outlet.service';
import {FeatureToggleDirective} from '../../../shared/directives/feature-toggle/feature-toggle.directive';
import {FeatureToggleService} from '../../../shared/directives/feature-toggle/feature-toggle.service';
import {TestingModule} from '../../../testing/testing.module';
import {DistributionLevelsService} from '../distribution-levels.service';

import {DistributionLevelSelectionComponent} from './distribution-level-selection.component';

@Component({
  template:
    '<gp-distribution-level-selection ' +
    '[control]="control"' +
    '[outletId]="outletId" ' +
    '[registeredOffice]="registeredOffice"> ' +
    '</gp-distribution-level-selection>'
})
class TestComponent {
  @ViewChild(DistributionLevelSelectionComponent)
  public distributionLevelsSelectionComponent: DistributionLevelSelectionComponent;
  control = new UntypedFormControl([]);
  registeredOffice = true;
  outletId = 'GS123';

  testOutlet = false;
}

describe('DistributionLevelSelectionComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let matDialogSpy: Spy<MatDialog>;
  let userServiceSpy: Spy<UserService>;
  let distributionLevelServiceSpy: Spy<DistributionLevelsService>;
  let outletServiceSpy: Spy<OutletService>;
  let featureToggleServiceSpy: Spy<FeatureToggleService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;

  beforeEach(waitForAsync(() => {
    matDialogSpy = createSpyFromClass(MatDialog);
    userServiceSpy = createSpyFromClass(UserService);
    distributionLevelServiceSpy = createSpyFromClass(DistributionLevelsService);
    outletServiceSpy = createSpyFromClass(OutletService);
    featureToggleServiceSpy = createSpyFromClass(FeatureToggleService);
    featureToggleServiceSpy.isFeatureEnabled.nextWith(false);
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.verify.nextWith(false);
    userServiceSpy.getPermissions.nextWith(['legalstructure.businesssite.read']);

    TestBed.configureTestingModule({
      imports: [MatSelectModule, ReactiveFormsModule, NoopAnimationsModule, TestingModule],
      declarations: [DistributionLevelSelectionComponent, TestComponent, FeatureToggleDirective],
      providers: [
        {provide: MatDialog, useValue: matDialogSpy},
        {provide: UserService, useValue: userServiceSpy},
        {provide: OutletService, useValue: outletServiceSpy},
        {provide: DistributionLevelsService, useValue: distributionLevelServiceSpy},
        {provide: FeatureToggleService, useValue: featureToggleServiceSpy},
        {
          provide: UserAuthorizationService,
          useValue: {isAuthorizedFor: userAuthorizationServiceSpy}
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    distributionLevelServiceSpy.get.nextWith(['RETAILER', 'WHOLESALER']);
    outletServiceSpy.outletChanges.nextWith('GS123');
    userServiceSpy.getDistributionLevelRestrictions.nextWith([]);

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('removeDistributionLevel', () => {
    it('should remove remove distribution level', () => {
      component.distributionLevelsSelectionComponent.removeDistributionLevel(
        'RETAILER',
        new Event('click')
      );

      expect(component.control.value).not.toContain('RETAILER');
    });
  });

  describe('originDistributionLevels', () => {
    it('should be set', () => {
      component.distributionLevelsSelectionComponent.ngOnInit();

      expect(component.distributionLevelsSelectionComponent.originDistributionLevels).toEqual([
        'RETAILER',
        'WHOLESALER'
      ]);
    });
  });

  describe('ngOnInit', () => {
    it('should get the current distribution levels when it changes', () => {
      distributionLevelServiceSpy.get.nextWith(['APPLICANT']);
      fixture.detectChanges();

      expect(component.distributionLevelsSelectionComponent.originDistributionLevels).toEqual([
        'APPLICANT'
      ]);
    });

    it('should add TEST_OUTLET distribution levels when user have test outlet user role', () => {
      userServiceSpy.getPermissions.nextWith(['legalstructure.testoutlet.read']);
      fixture.detectChanges();

      expect(
        component.distributionLevelsSelectionComponent.editableDistributionLevels.includes(
          'TEST_OUTLET'
        )
      ).toBeTruthy();
    });

    it('should not add TEST_OUTLET distribution levels when user not have test outlet user role', () => {
      fixture.detectChanges();

      expect(
        component.distributionLevelsSelectionComponent.editableDistributionLevels.includes(
          'TEST_OUTLET'
        )
      ).toBeFalsy();
    });
  });

  describe('isEditable', () => {
    beforeEach(() => {
      component.control.setValue(['RETAILER', 'WHOLESALER']);
      component.distributionLevelsSelectionComponent.editableDistributionLevels = ['RETAILER'];
    });

    it('should be false when the level is not editable', () => {
      distributionLevelServiceSpy.isDistributionLevelEditable.mockReturnValue(false);
      expect(component.distributionLevelsSelectionComponent.isEditable('WHOLESALER')).toBeFalsy();
    });

    it('should be true when the level is editable', () => {
      distributionLevelServiceSpy.isDistributionLevelEditable.mockReturnValue(true);
      expect(component.distributionLevelsSelectionComponent.isEditable('RETAILER')).toBeTruthy();
    });

    it('should be false when the level is not editable from input', () => {
      component.control.setValue(['RETAILER', 'WHOLESALER']);
      fixture.detectChanges();
      expect(component.distributionLevelsSelectionComponent.isEditable('WHOLESALER')).toBeFalsy();
    });

    it('should be false when all editable but one restricted', () => {
      component.distributionLevelsSelectionComponent.allEditable = true;
      component.distributionLevelsSelectionComponent.editableDistributionLevels = ['RETAILER'];
      expect(component.distributionLevelsSelectionComponent.isEditable('WHOLESALER')).toBeFalsy();
    });

    it('should be true when all editable but one restricted', () => {
      component.distributionLevelsSelectionComponent.allEditable = true;
      component.distributionLevelsSelectionComponent.editableDistributionLevels = ['RETAILER'];
      expect(component.distributionLevelsSelectionComponent.isEditable('RETAILER')).toBeTruthy();
    });
  });

  describe('isTestOutletDisable', () => {
    it('should be false when product responsible user and create page', () => {
      component.distributionLevelsSelectionComponent.productResponsible = true;
      component.distributionLevelsSelectionComponent.isEditPage = false;
      expect(
        component.distributionLevelsSelectionComponent.isTestOutletDisable(
          'TEST_OUTLET'
        )
      ).toBeFalsy();
    })
    it('should be true when non test outlet user and create page', () => {
      component.distributionLevelsSelectionComponent.productResponsible  = false;
      component.distributionLevelsSelectionComponent.isEditPage = false;
      expect(
        component.distributionLevelsSelectionComponent.isTestOutletDisable(
          'TEST_OUTLET'
        )
      ).toBeTruthy();
    })
    it('should be true when test outlet user and edit page', () => {
      component.distributionLevelsSelectionComponent.productResponsible  = true;
      component.distributionLevelsSelectionComponent.isEditPage = true;
      expect(
        component.distributionLevelsSelectionComponent.isTestOutletDisable(
          'TEST_OUTLET'
        )
      ).toBeTruthy();
    })
    it('should be true when non test outlet user and edit page', () => {
      component.distributionLevelsSelectionComponent.productResponsible = false;
      component.distributionLevelsSelectionComponent.isEditPage = true;
      expect(
        component.distributionLevelsSelectionComponent.isTestOutletDisable(
          'TEST_OUTLET'
        )
      ).toBeTruthy();
    })
    it('should be true when other distribution level', () => {
      component.distributionLevelsSelectionComponent.testOutlet = true;
      component.distributionLevelsSelectionComponent.isEditPage = false;
      expect(
        component.distributionLevelsSelectionComponent.isTestOutletDisable(
          'WHOLESALER'
        )
      ).toBeFalsy();
    })
  });
});
