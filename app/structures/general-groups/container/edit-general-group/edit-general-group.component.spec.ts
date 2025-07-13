import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { GeneralGroupsService } from '../../general-groups.service';
import { brandProductGroupServicesMock } from '../../model/brand-product-group-service.mock';
import { generalGroupMembersMock, generalGroupsMock } from '../../model/general-groups.mock';
import { GeneralGroupSuccessor } from '../../model/general-groups.model';

import { EditGeneralGroupComponent } from './edit-general-group.component';

describe('EditGeneralGroupComponent', () => {
  let component: EditGeneralGroupComponent;
  let fixture: ComponentFixture<EditGeneralGroupComponent>;
  let generalGroupsServiceSpy: Spy<GeneralGroupsService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let matDialogSpy: Spy<MatDialog>;

  const generalGroupMock = generalGroupsMock.generalGroups[0];

  generalGroupMock.country.translations = {
    'de-DE': 'Großbritannien',
    'en-US': 'United Kingdom',
    'fr-FR': 'Royaume-Uni'
  };

  beforeEach(waitForAsync(() => {
    generalGroupsServiceSpy = createSpyFromClass(GeneralGroupsService);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    matDialogSpy = createSpyFromClass(MatDialog);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatDialogModule
      ],
      declarations: [EditGeneralGroupComponent],
      providers: [
        { provide: GeneralGroupsService, useValue: generalGroupsServiceSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy },
        {
          provide: UserAuthorizationService,
          useValue: { isAuthorizedFor: userAuthorizationServiceSpy }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ generalGroupId: 'GG0000001' }))
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    generalGroupsServiceSpy.get.nextWith(generalGroupMock);
    generalGroupsServiceSpy.update.complete();
    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.country.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.verify.nextWith(true);

    fixture = TestBed.createComponent(EditGeneralGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize form group with general group data', () => {
      const expected = {
        name: generalGroupMock.name,
        countryId: generalGroupMock.country.id,
        active: generalGroupMock.active,
        brandProductGroupServices: generalGroupMock.brandProductGroupServices?.map(it => ({
          brandId: it.brand.id,
          productGroupId: it.productGroup.id,
          serviceId: it.service.id
        })),
        members: generalGroupMock.members
      };
      expect(component.generalGroupFormGroup.getRawValue()).toEqual(expected);
    });

    it('should set general group successor if exists', () => {
      const successorGeneralGroup: GeneralGroupSuccessor = { id: 'GS1234567', name: 'Successor' };
      generalGroupsServiceSpy.get.nextWith({
        ...generalGroupMock,
        successorGroup: successorGeneralGroup
      });
      component.ngOnInit();
      expect(component.hasSuccessor).toBeTruthy();
      expect(component.successorGroupName).toBe(successorGeneralGroup.name);
      expect(component.generalGroupFormGroup.get('active')?.disabled).toBeTruthy();
    });

    it('should set general group country', () => {
      expect(component.generalGroupCountry).toEqual(generalGroupMock.country);
    });
  });

  describe('save', () => {
    it('should save form data of general group', () => {
      const requestValue = {
        name: 'Changed general group',
        countryId: 'GB',
        active: true,
        brandProductGroupServices: [brandProductGroupServicesMock[0]],
        members: generalGroupMock.members
      };

      const expected = {
        name: 'Changed general group',
        countryId: 'GB',
        active: true,
        brandProductGroupServices: [brandProductGroupServicesMock[0]],
        members: [(generalGroupMock.members || [])[0].id]
      };

      component.generalGroupFormGroup.patchValue(requestValue);
      component.save();
      expect(generalGroupsServiceSpy.update).toHaveBeenCalledWith(
        generalGroupMock.generalGroupId,
        expected
      );
    });
  });

  describe('reset', () => {
    it('should reset form group', () => {
      component.generalGroupFormGroup.patchValue({ name: 'any name' });
      const expected = {
        name: generalGroupMock.name,
        countryId: generalGroupMock.country.id,
        active: generalGroupMock.active,
        brandProductGroupServices: generalGroupMock.brandProductGroupServices?.map(it => ({
          brandId: it.brand.id,
          productGroupId: it.productGroup.id,
          serviceId: it.service.id
        })),
        members: generalGroupMock.members
      };
      component.reset();
      expect(component.generalGroupFormGroup.getRawValue()).toEqual(expected);
    });
  });

  describe('updateBrandProductGroupServicesControl', () => {
    it('should update form control with brand product groups services', () => {
      component.generalGroupFormGroup.patchValue({
        name: 'any name',
        countryId: 'DE',
        active: true,
        brandProductGroupServices: []
      });
      component.updateBrandProductGroupServicesControl([
        brandProductGroupServicesMock[0],
        brandProductGroupServicesMock[1]
      ]);
      const expected = {
        name: 'any name',
        countryId: 'DE',
        active: true,
        brandProductGroupServices: [
          brandProductGroupServicesMock[0],
          brandProductGroupServicesMock[1]
        ],
        members: generalGroupMock.members
      };
      expect(component.generalGroupFormGroup.getRawValue()).toEqual(expected);
    });
  });

  describe('should handle add successor', () => {
    it('should add general group successor', () => {
      matDialogSpy.open.mockReturnValue({ afterClosed: () => of(generalGroupMock) });

      component.openGeneralGroupSuccessorList();

      expect(component.generalGroupFormGroup.get('successorGroupId')?.value).toBe(
        generalGroupMock.generalGroupId
      );
      expect(component.successorGroupName).toBe(generalGroupMock.name);
      expect(component.generalGroupFormGroup.get('active')?.disabled).toBeTruthy();
      expect(component.hasSuccessor).toBeTruthy();
      expect(component.generalGroupFormGroup.dirty).toBeTruthy();
    });

    it('should do nothing if close dialog', () => {
      const spy = jest.spyOn(component, 'setGeneralGroupSuccessor');
      matDialogSpy.open.mockReturnValue({ afterClosed: () => of(false) });
      component.openGeneralGroupSuccessorList();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  it('should remove successor', () => {
    component.removeGeneralGroupSuccessor();
    expect(component.hasSuccessor).toBeFalsy();
    expect(component.generalGroupFormGroup.get('active')?.disabled).toBeFalsy();
    expect(component.generalGroupFormGroup.get('successorGroupId')?.value).toBeNull();
    expect(component.successorGroupName).toBeNull();
    expect(component.generalGroupFormGroup.dirty).toBeTruthy();
  });

  describe('should handle add members', () => {
    it('should add general group members', () => {
      matDialogSpy.open.mockReturnValue({ afterClosed: () => of(generalGroupMembersMock) });
      component.openGeneralGroupMembersList();
      expect(component.generalGroupFormGroup.get('members')?.value).toMatchObject([
        ...(generalGroupMock.members || []),
        ...generalGroupMembersMock
      ]);
    });

    it('should not add existing general group members', () => {
      matDialogSpy.open.mockReturnValue({ afterClosed: () => of(generalGroupMock.members) });
      component.openGeneralGroupMembersList();
      expect(component.generalGroupFormGroup.get('members')?.value.length).toBe(1);
    });

    it('should do nothing if close dialog', () => {
      const spy = jest.spyOn(component, 'addGeneralGroupMembers');
      matDialogSpy.open.mockReturnValue({ afterClosed: () => of(false) });
      component.openGeneralGroupMembersList();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  it('should remove members', () => {
    const spy = jest.spyOn(component, 'updateMembersControl');

    component.generalGroupFormGroup.get('members')?.patchValue(generalGroupMembersMock);
    component.removeGeneralGroupMember(generalGroupMembersMock[0].id);

    expect(spy).toHaveBeenCalledWith([]);
  });

  it('should update members control', () => {
    component.generalGroupMembers = [];
    component.generalGroupFormGroup.get('members')?.patchValue([]);
    component.generalGroupFormGroup.markAsPristine();

    component.updateMembersControl(generalGroupMembersMock);

    expect(component.generalGroupMembers).toMatchObject(generalGroupMembersMock);
    expect(component.generalGroupFormGroup.get('members')?.value).toMatchObject(
      generalGroupMembersMock
    );
    expect(component.generalGroupFormGroup.dirty).toBeTruthy();
  });

  describe('canDeactivate', () => {
    it('should return true if form group is pristine', () => {
      component.generalGroupFormGroup.reset();
      const canDeactivate = component.canDeactivate();
      expect(canDeactivate).toBeTruthy();
    });
  });
});
