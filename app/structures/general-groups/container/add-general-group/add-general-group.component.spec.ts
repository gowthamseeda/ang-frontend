import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { GeneralGroupsService } from '../../general-groups.service';
import { brandProductGroupServicesMock } from '../../model/brand-product-group-service.mock';
import { generalGroupMembersMock, generalGroupsMock } from '../../model/general-groups.mock';

import { AddGeneralGroupComponent } from './add-general-group.component';

class ActivatedRouteStub {
  queryParams = of({});

  params = of({});
}

describe('AddGeneralGroupComponent', () => {
  let component: AddGeneralGroupComponent;
  let fixture: ComponentFixture<AddGeneralGroupComponent>;
  let generalGroupsServiceSpy: Spy<GeneralGroupsService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let matDialogSpy: Spy<MatDialog>;
  let routerSpy: Spy<Router>;

  const generalGroupMock = generalGroupsMock.generalGroups[0];

  beforeEach(waitForAsync(() => {
    generalGroupsServiceSpy = createSpyFromClass(GeneralGroupsService);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    matDialogSpy = createSpyFromClass(MatDialog);
    routerSpy = createSpyFromClass(Router);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        MatDialogModule
      ],
      declarations: [AddGeneralGroupComponent],
      providers: [
        { provide: GeneralGroupsService, useValue: generalGroupsServiceSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    generalGroupsServiceSpy.create.complete();

    fixture = TestBed.createComponent(AddGeneralGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize empty form group', () => {
      const expected = {
        name: '',
        countryId: '',
        active: true,
        brandProductGroupServices: null,
        members: []
      };
      expect(component.generalGroupFormGroup.value).toEqual(expected);
    });
  });

  describe('save', () => {
    it('should save form data of general group', () => {
      const expected = {
        name: 'New general group',
        countryId: 'DE',
        active: true,
        brandProductGroupServices: [brandProductGroupServicesMock[0]],
        members: generalGroupMock.members
      };
      component.generalGroupFormGroup.patchValue(expected);
      component.save();
      expect(generalGroupsServiceSpy.create).toHaveBeenCalledWith({
        ...expected,
        members: [(generalGroupMock.members || [])[0].id]
      });
    });
  });

  describe('reset', () => {
    it('should reset form group', () => {
      component.generalGroupFormGroup.patchValue({ name: 'any name' });
      const expected = {
        name: '',
        countryId: '',
        active: true,
        brandProductGroupServices: null,
        members: []
      };
      component.reset();
      expect(component.generalGroupFormGroup.value).toEqual(expected);
    });
  });

  describe('updateBrandProductGroupServicesControl', () => {
    it('should update form control with brand product groups services', () => {
      component.generalGroupFormGroup.patchValue({
        name: 'any name',
        countryId: 'DE',
        active: true,
        brandProductGroupServices: [],
        members: []
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
        members: []
      };
      expect(component.generalGroupFormGroup.value).toEqual(expected);
    });
  });

  describe('should handle add members', () => {
    it('should add general group members', () => {
      matDialogSpy.open.mockReturnValue({ afterClosed: () => of(generalGroupMembersMock) });
      component.openGeneralGroupMembersList();
      expect(component.generalGroupFormGroup.get('members')?.value).toMatchObject(
        generalGroupMembersMock
      );
    });

    it('should not add existing general group members', () => {
      matDialogSpy.open.mockReturnValue({ afterClosed: () => of(generalGroupMembersMock) });
      component.generalGroupFormGroup.patchValue(generalGroupMembersMock);
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

    component.generalGroupFormGroup.patchValue({ members: generalGroupMembersMock });
    component.removeGeneralGroupMember(generalGroupMembersMock[0].id);

    expect(spy).toHaveBeenCalledWith([]);
  });

  it('should update members control', () => {
    component.generalGroupMembers = [];
    component.generalGroupFormGroup.patchValue({ members: [] });
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
