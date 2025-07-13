import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
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
  dealerGroupMembersWithROMock,
  dealerGroupsMock
} from '../../model/dealer-groups.mock';

import { AddDealerGroupComponent } from './add-dealer-group.component';

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

class ActivatedRouteStub {
  queryParams = of({});

  params = of({});
}

describe('AddDealerGroupComponent', () => {
  let component: AddDealerGroupComponent;
  let fixture: ComponentFixture<AddDealerGroupComponent>;
  let dealerGroupServiceSpy: Spy<DealerGroupsService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let matDialogSpy: Spy<MatDialog>;
  let routerSpy: Spy<Router>;

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
    dealerGroupServiceSpy = createSpyFromClass(DealerGroupsService);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    matDialogSpy = createSpyFromClass(MatDialog);
    routerSpy = createSpyFromClass(Router);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), ReactiveFormsModule],
      declarations: [AddDealerGroupComponent],
      providers: [
        { provide: DealerGroupsService, useValue: dealerGroupServiceSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        {
          provide: UserAuthorizationService,
          useValue: { isAuthorizedFor: userAuthorizationServiceSpy }
        },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: OutletStructureApiService, useValue: outletStructureServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    dealerGroupServiceSpy.create.complete();
    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.verify.nextWith(true);

    fixture = TestBed.createComponent(AddDealerGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize empty form group', () => {
      const expected = { name: '', active: true, headquarterId: '', members: [] };
      expect(component.dealerGroupFormGroup.value).toEqual(expected);
    });
  });

  describe('save', () => {
    it('should save form data of dealer group', () => {
      const expected = {
        name: 'New dealer group',
        headquarterId: 'new headquarter id',
        active: true,
        members: []
      };
      component.dealerGroupFormGroup.patchValue(expected);
      component.save();
      expect(dealerGroupServiceSpy.create).toHaveBeenCalledWith(expected);
    });
  });

  describe('reset', () => {
    it('should reset properties', () => {
      component.reset();
      expect(component.dealerGroupCountry).toBeUndefined();
      expect(component.headquarter).toBeUndefined();
      expect(component.dealerGroupMembers).toEqual([]);
      expect(component.dealerGroupMembersWithRO).toEqual([]);
      expect(component.dealerGroupMembersWithoutRO).toEqual([]);
    });

    it('should reset form group', () => {
      component.dealerGroupFormGroup.patchValue({ name: 'any name' });
      const expected = { name: '', active: true, headquarterId: '', members: [] };
      component.reset();
      expect(component.dealerGroupFormGroup.value).toEqual(expected);
    });
  });

  describe('removeHeadquarter', () => {
    it('should set headquarter in form to empty and set country and headquarter to undefined', () => {
      component.removeHeadquarter();
      expect(component.dealerGroupFormGroup.getRawValue().headquarterId).toEqual('');
      expect(component.dealerGroupCountry).toBeUndefined();
      expect(component.headquarter).toBeUndefined();
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
      expect(component.dealerGroupFormGroup.get('members')?.value).toMatchObject(
        dealerGroupMembersMock
      );
    });

    it('should not add existing general group members', () => {
      matDialogSpy.open.mockReturnValue({ afterClosed: () => of(dealerGroupMembersMock) });
      component.dealerGroupFormGroup.patchValue(dealerGroupMembersMock);
      component.openDealerGroupMembersList();
      expect(component.dealerGroupFormGroup.get('members')?.value.length).toBe(1);
    });

    it('should do nothing if close dialog', () => {
      const spy = spyOn(component, 'addDealerGroupMembers');
      matDialogSpy.open.mockReturnValue({ afterClosed: () => of(false) });
      component.openDealerGroupMembersList();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('removeDealerGroupMember', () => {
    it('should remove members', () => {
      const spy = spyOn(component, 'updateMembersControl');

      component.dealerGroupFormGroup.patchValue({ members: dealerGroupMembersMock });
      component.removeDealerGroupMember(dealerGroupMembersMock[0].id);

      expect(spy).toHaveBeenCalledWith([]);
    });
  });

  describe('removeDealerGroupMemberWithRO', () => {
    it('should remove member together with RO when removing RO', () => {
      component.updateMembersControl(dealerGroupMembersWithROMock);

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

  describe('updateMembersControl', () => {
    it('should update members control', () => {
      component.dealerGroupMembers = [];
      component.dealerGroupFormGroup.patchValue({ members: [] });
      component.dealerGroupFormGroup.markAsPristine();

      component.updateMembersControl(dealerGroupMembersMock);

      expect(component.dealerGroupMembers).toMatchObject(dealerGroupMembersMock);
      expect(component.dealerGroupFormGroup.get('members')?.value).toMatchObject(
        dealerGroupMembersMock
      );
      expect(component.dealerGroupFormGroup.dirty).toBeTruthy();
    });

    it('should split members to ro and non ro', () => {
      jest.spyOn(outletStructureServiceStub, 'get').mockReturnValue(of(outletStructure));

      component.updateMembersControl(dealerGroupMembersWithROMock);
      expect(component.dealerGroupMembers).toEqual(dealerGroupMembersWithROMock);
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

    it('should run observable in sequence', () => {
      const spy = spyOn(outletStructureServiceStub, 'get').and.callThrough();
      component.updateMembersControl(dealerGroupMembersWithDifferentROMock);

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveBeenNthCalledWith(1, 'GS00000003');
      expect(spy).toHaveBeenNthCalledWith(2, 'GS00000031');
      expect(spy).toHaveBeenNthCalledWith(3, 'GS00000021');
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

  describe('canDeactivate', () => {
    it('should return true if form group is pristine', () => {
      component.dealerGroupFormGroup.reset();
      const canDeactivate = component.canDeactivate();
      expect(canDeactivate).toBeTruthy();
    });
  });
});
