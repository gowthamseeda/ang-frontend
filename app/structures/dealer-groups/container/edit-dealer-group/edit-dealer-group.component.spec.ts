import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { OutletStructureApiService } from '../../../outlet-structure/services/outlet-structure-api.service';
import { DealerGroupsService } from '../../dealer-groups.service';
import {
  dealerGroupMembersMock,
  dealerGroupMembersWithDifferentROMock,
  dealerGroupsMock
} from '../../model/dealer-groups.mock';

import { EditDealerGroupComponent } from './edit-dealer-group.component';
import { TranslateCountryPipe } from '../../../../shared/pipes/translate-country/translate-country.pipe';
import { ApiService } from '../../../../shared/services/api/api.service';
import { LoggingService } from '../../../../shared/services/logging/logging.service';
import { CountryService } from '../../../../geography/country/country.service';
import { UserService } from '../../../../iam/user/user.service';
import { TestingModule } from '../../../../testing/testing.module';
import { TranslateDataPipe } from '../../../../shared/pipes/translate-data/translate-data.pipe';

const outletStructure = {
  companyLegalName: 'John Gill',
  companyCity: 'London',
  companyId: 'GC00000001',
  outlets: [
    {
      active: true,
      brandCodes: [],
      businessNames: [],
      businessSiteId: 'GS00000002',
      city: 'London',
      companyId: 'GC00000001',
      countryId: 'GB',
      distributionLevels: ['WHOLESALER'],
      legalName: 'John Gill',
      marketStructureEnabled: true,
      registeredOffice: false,
      subOutlet: false,
      subOutlets: [
        {
          active: true,
          brandCodes: [],
          businessNames: [],
          businessSiteId: 'GS00000008',
          city: 'London',
          companyId: 'GC00000001',
          countryId: 'GB',
          distributionLevels: ['WHOLESALER'],
          legalName: 'John Gill',
          marketStructureEnabled: true,
          registeredOffice: false,
          subOutlet: true,
          mainOutlet: false
        }
      ],
      mainOutlet: true
    }
  ]
};

class OutletStructureApiServiceStub {
  get(outletId) {
    return of(outletStructure);
  }
}

describe('EditDealerGroupComponent', () => {
  let component: EditDealerGroupComponent;
  let fixture: ComponentFixture<EditDealerGroupComponent>;
  let dealerGroupsServiceSpy: Spy<DealerGroupsService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let matDialogSpy: Spy<MatDialog>;
  let userServiceSpy: Spy<UserService>;

  const outletStructureServiceStub = new OutletStructureApiServiceStub();
  const dealerGroupMock = dealerGroupsMock.dealerGroups[0];

  dealerGroupMock.members?.push({
    id: 'GS00000003',
    companyId: 'GC00000001',
    legalName: 'John Gill',
    address: {
      city: 'London'
    },
    isRegisteredOffice: true,
    country: {
      id: 'GB',
      name: 'United Kingdom'
    },
    active: true
  });

  dealerGroupMock.members?.push({
    id: 'GS00000008',
    companyId: 'GC00000001',
    legalName: 'John Gill',
    address: {
      city: 'London'
    },
    isRegisteredOffice: false,
    country: {
      id: 'GB',
      name: 'United Kingdom'
    },
    active: true
  });

  beforeEach(waitForAsync(() => {
    dealerGroupsServiceSpy = createSpyFromClass(DealerGroupsService);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    matDialogSpy = createSpyFromClass(MatDialog);
    userServiceSpy = createSpyFromClass(UserService);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatDialogModule,
        TestingModule
      ],
      declarations: [EditDealerGroupComponent, TranslateCountryPipe],
      providers: [
        ApiService,
        LoggingService,
        CountryService,
        TranslateDataPipe,
        { provide: DealerGroupsService, useValue: dealerGroupsServiceSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        {
          provide: UserAuthorizationService,
          useValue: { isAuthorizedFor: userAuthorizationServiceSpy }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ dealerGroupId: 'DG00000001' }))
          }
        },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: OutletStructureApiService, useValue: outletStructureServiceStub },
        { provide: UserService, useValue: userServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    dealerGroupsServiceSpy.get.nextWith(dealerGroupMock);
    dealerGroupsServiceSpy.update.complete();
    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.country.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.verify.nextWith(true);

    fixture = TestBed.createComponent(EditDealerGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize form group with dealer group data', () => {
      const expected = {
        name: dealerGroupMock.name,
        active: dealerGroupMock.active,
        members: dealerGroupMock.members,
        headquarterId: dealerGroupMock.headquarter.id,
        successorGroupId: dealerGroupMock.successorGroup?.id
      };
      expect(component.dealerGroupFormGroup.getRawValue()).toEqual(expected);
    });

    it('should initialize properties', () => {
      expect(component.dealerGroupId).toEqual(dealerGroupMock.dealerGroupId);
      expect(component.dealerGroupCountry).toEqual(dealerGroupMock.country);
      expect(component.headquarter).toEqual(dealerGroupMock.headquarter);
      expect(component.successorGroupName).toBeNull();
      expect(component.hasSuccessor).toEqual(!!dealerGroupMock.successorGroup);

      expect(component.dealerGroupMembers).toEqual(dealerGroupMock.members);
    });

    it('should split members to ro and non ro', () => {
      spyOn(outletStructureServiceStub, 'get').and.returnValue(of(outletStructure));

      expect(component.dealerGroupMembers).toEqual(dealerGroupMock.members);
      expect(component.dealerGroupMembersWithRO).toEqual([
        {
          registeredOffice: {
            id: 'GS00000003',
            companyId: 'GC00000001',
            legalName: 'John Gill',
            address: {
              city: 'London'
            },
            isRegisteredOffice: true,
            country: {
              id: 'GB',
              name: 'United Kingdom'
            },
            active: true
          },
          members: [
            {
              id: 'GS00000002',
              companyId: 'GC00000001',
              legalName: 'John Gill',
              address: {
                city: 'London'
              },
              isRegisteredOffice: false,
              brandCodes: [
                {
                  brandCode: '12345',
                  brandId: 'MB'
                }
              ],
              country: {
                id: 'GB',
                name: 'United Kingdom'
              },
              active: true
            },
            {
              id: 'GS00000008',
              companyId: 'GC00000001',
              legalName: 'John Gill',
              address: {
                city: 'London'
              },
              isRegisteredOffice: false,
              country: {
                id: 'GB',
                name: 'United Kingdom'
              },
              active: true
            }
          ]
        }
      ]);
      expect(component.dealerGroupMembersWithoutRO).toEqual([]);
    });
  });

  describe('save', () => {
    it('should save form data of dealer group', () => {
      const requestValue = {
        name: 'Changed dealer group',
        active: true,
        headquarterId: dealerGroupMock.headquarter.id,
        successorGroupId: dealerGroupMock.successorGroup?.id,
        members: dealerGroupMock.members
      };

      const expected = {
        name: 'Changed dealer group',
        active: true,
        headquarterId: dealerGroupMock.headquarter.id,
        successorGroupId: dealerGroupMock.successorGroup?.id,
        members: [
          dealerGroupMock.members![0].id,
          dealerGroupMock.members![1].id,
          dealerGroupMock.members![2].id
        ]
      };

      component.dealerGroupFormGroup.patchValue(requestValue);
      component.save();
      expect(dealerGroupsServiceSpy.update).toHaveBeenCalledWith(
        dealerGroupMock.dealerGroupId,
        expected
      );
    });
  });

  describe('reset', () => {
    it('should reset form group', () => {
      component.dealerGroupFormGroup.patchValue({ name: 'any name' });
      const expected = {
        name: dealerGroupMock.name,
        active: dealerGroupMock.active,
        headquarterId: dealerGroupMock.headquarter.id,
        successorGroupId: dealerGroupMock.successorGroup?.id,
        members: dealerGroupMock.members
      };
      component.reset();
      expect(component.dealerGroupFormGroup.getRawValue()).toEqual(expected);
    });
  });

  describe('getCountry', () => {
    it('should return country id if country exists', () => {
      expect(component.getCountryIdFormGroup().get('countryId')?.value).toEqual('GB');
    });

    it('should return empty if country not exists', () => {
      component.dealerGroupCountry = undefined;
      expect(component.getCountryIdFormGroup().get('countryId')?.value).toBeUndefined();
    });
  });

  describe('removeHeadquarter', () => {
    it('should set headquarter in form to empty and set country and headquarter to undefined', () => {
      component.removeHeadquarter();
      expect(component.dealerGroupFormGroup.getRawValue().headquarterId).toEqual('');
      expect(component.dealerGroupCountry).toBeUndefined();
      expect(component.headquarter).toBeUndefined();
      expect(component.dealerGroupFormGroup.dirty).toBeTruthy();
    });
  });

  describe('addOrUpdateHeadquarter', () => {
    it('should update headquarter, country and form value and set form to dirty', () => {
      const addHeadquarter = {
        id: 'GS7654321',
        legalName: 'string',
        address: {
          street: 'BK',
          streetNumber: '1',
          city: 'Puchong',
          zipCode: '47180'
        },
        isRegisteredOffice: true,
        countryId: 'MY',
        countryName: 'Malaysia'
      };

      component.addOrUpdateHeadquarter(addHeadquarter);
      expect(component.dealerGroupFormGroup.getRawValue().headquarterId).toEqual('GS7654321');
      expect(component.dealerGroupFormGroup.dirty).toBeTruthy();
      expect(component.dealerGroupCountry).toEqual({
        id: addHeadquarter.countryId,
        name: addHeadquarter.countryName
      });
      expect(component.headquarter).toEqual(addHeadquarter);
    });
  });

  describe('addDealerGroupMembers', () => {
    it('should add general group members', () => {
      matDialogSpy.open.mockReturnValue({ afterClosed: () => of(dealerGroupMembersMock) });
      component.openDealerGroupMembersList();
      expect(component.dealerGroupFormGroup.get('members')?.value).toMatchObject([
        ...(dealerGroupMock.members || []),
        ...dealerGroupMembersMock
      ]);
    });

    it('should not add existing general group members', () => {
      matDialogSpy.open.mockReturnValue({ afterClosed: () => of(dealerGroupMock.members) });
      component.openDealerGroupMembersList();
      expect(component.dealerGroupFormGroup.get('members')?.value.length).toBe(3);
    });

    it('should do nothing if close dialog', () => {
      const spy = spyOn(component, 'addDealerGroupMembers');
      matDialogSpy.open.mockReturnValue({ afterClosed: () => of(false) });
      component.openDealerGroupMembersList();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('updateMembersControl', () => {
    it('should update members control', () => {
      component.dealerGroupMembers = [];
      component.dealerGroupFormGroup.get('members')?.patchValue([]);
      component.dealerGroupFormGroup.markAsPristine();

      component.updateMembersControl(dealerGroupMembersMock);

      expect(component.dealerGroupMembers).toMatchObject(dealerGroupMembersMock);
      expect(component.dealerGroupFormGroup.get('members')?.value).toMatchObject(
        dealerGroupMembersMock
      );
    });

    it('should run observable in sequence', () => {
      const spy = spyOn(outletStructureServiceStub, 'get').and.callThrough();
      component.updateMembersControl(dealerGroupMembersWithDifferentROMock);

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveBeenNthCalledWith(1, 'GS00000003');
      expect(spy).toHaveBeenNthCalledWith(2, 'GS00000031');
      expect(spy).toHaveBeenNthCalledWith(3, 'GS00000021');
    });
  });

  describe('removeDealerGroupMember', () => {
    it('should remove dealer group member', () => {
      const spy = spyOn(component, 'updateMembersControl');

      component.dealerGroupFormGroup.get('members')?.patchValue(dealerGroupMembersMock);
      component.removeDealerGroupMember(dealerGroupMembersMock[0].id);

      expect(spy).toHaveBeenCalledWith([]);
    });

    it('should remove member and remain RO when removing member only', () => {
      component.removeDealerGroupMember('GS00000002');
      expect(component.dealerGroupFormGroup.getRawValue().members.map(member => member.id)).toEqual(
        ['GS00000003', 'GS00000008']
      );
      expect(component.dealerGroupMembers.map(member => member.id)).toEqual([
        'GS00000003',
        'GS00000008'
      ]);
      expect(component.dealerGroupMembersWithRO.map(member => member.registeredOffice.id)).toEqual([
        'GS00000003'
      ]);
      expect(component.dealerGroupMembersWithoutRO).toEqual([]);
    });
  });

  describe('removeDealerGroupMemberWithRO', () => {
    it('should remove member together with RO when removing RO', () => {
      expect(component.dealerGroupFormGroup.getRawValue().members.map(member => member.id)).toEqual(
        ['GS00000002', 'GS00000003', 'GS00000008']
      );
      expect(component.dealerGroupMembersWithoutRO).toEqual([]);
      component.removeDealerGroupMemberWithRO('GS00000003');
      expect(component.dealerGroupFormGroup.getRawValue().members).toEqual([]);
      expect(component.dealerGroupMembers).toEqual([]);
      expect(component.dealerGroupMembersWithRO).toEqual([]);
      expect(component.dealerGroupMembersWithoutRO).toEqual([]);
    });
  });

  describe('sortChange', () => {
    it('should setEvent sort when sort change', () => {
      const sort = new MatSort();
      component.sortChanged(sort);
      expect(component.sortEvent).toEqual(sort);
    });
  });

  describe('filter', () => {
    it('should set filter value when search for outlets', () => {
      const filterValue = 'anything';
      component.filter(filterValue);
      expect(component.filterValue).toEqual(filterValue);
    });
  });

  describe('should handle add successor', () => {
    it('should add dealer group successor', () => {
      const dealerGroupMock = dealerGroupsMock.dealerGroups[0];
      matDialogSpy.open.mockReturnValue({ afterClosed: () => of(dealerGroupMock) });

      component.openDealerGroupSuccessorList();

      expect(component.dealerGroupFormGroup.get('successorGroupId')?.value).toBe(
        dealerGroupMock.dealerGroupId
      );
      expect(component.successorGroupName).toBe(dealerGroupMock.name);
      expect(component.dealerGroupFormGroup.get('active')?.disabled).toBeTruthy();
      expect(component.hasSuccessor).toBeTruthy();
      expect(component.dealerGroupFormGroup.dirty).toBeTruthy();
    });

    it('should do nothing if close dialog', () => {
      const spy = spyOn(component, 'setDealerGroupSuccessor');
      matDialogSpy.open.mockReturnValue({ afterClosed: () => of(false) });
      component.openDealerGroupSuccessorList();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('removeDealerGroupSuccessor', () => {
    it('should remove successor', () => {
      component.removeDealerGroupSuccessor();
      expect(component.hasSuccessor).toBeFalsy();
      expect(component.dealerGroupFormGroup.get('active')?.disabled).toBeFalsy();
      expect(component.dealerGroupFormGroup.get('successorGroupId')?.value).toBeNull();
      expect(component.successorGroupName).toBeNull();
      expect(component.dealerGroupFormGroup.dirty).toBeTruthy();
    });
  });

  describe('canDeactivate', () => {
    it('should return true if form group is pristine', () => {
      component.dealerGroupFormGroup.reset();
      const canDeactivate = component.canDeactivate();
      expect(canDeactivate).toBeTruthy();
    });
  });
});
