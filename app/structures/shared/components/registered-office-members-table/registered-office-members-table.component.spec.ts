
import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { UserService } from '../../../../iam/user/user.service';
import { TranslateCountryPipe } from '../../../../shared/pipes/translate-country/translate-country.pipe';
import { ApiService } from '../../../../shared/services/api/api.service';
import { TestingModule } from '../../../../testing/testing.module';
import { dealerGroupMembersMock, dealerGroupMembersWithRO } from '../../../dealer-groups/model/dealer-groups.mock';
import { DealerGroupMember, DealerGroupMemberWithRO } from '../../../models/dealer-group.model';
import { TranslateDataPipe } from '../../../../shared/pipes/translate-data/translate-data.pipe';
import { CountryService } from '../../../../geography/country/country.service';

import { RegisteredOfficeMembersTableComponent } from './registered-office-members-table.component';
import { LoggingService } from '../../../../shared/services/logging/logging.service';
@Component({
  template:
    '<gp-registered-office-members-table [membersWithRO]="dealerGroupMemberWithROFromHost" [membersWithoutRO]="dealerGroupMemberWithoutROFromHost" [disabled]="disabledValueFromHost" [readOnly]="readOnlyValueFromHost"></gp-registered-office-members-table>'
})
class TestRegisteredOfficeMembersTableComponentHostComponent {
  @ViewChild(RegisteredOfficeMembersTableComponent)
  registeredOfficeMembersTableComponent: any;
  dealerGroupMemberWithROFromHost: DealerGroupMemberWithRO[];
  dealerGroupMemberWithoutROFromHost: DealerGroupMember[];
  disabledValueFromHost: boolean;
  readOnlyValueFromHost: boolean;
}

@Component({
  selector: 'gp-brand-code',
  template: ''
})
class MockBrandCodeComponent {
}

@Component({
  selector: 'gp-members-table',
  template: ''
})
class MockMembersTableComponent {
}

describe('RegisteredOfficeMembersTableComponent', () => {
  let component: RegisteredOfficeMembersTableComponent;
  let fixture: ComponentFixture<RegisteredOfficeMembersTableComponent>;
  let matDialogSpy: Spy<MatDialog>;
  let userServiceSpy: Spy<UserService>;

  beforeEach(async () => {
    matDialogSpy = createSpyFromClass(MatDialog);
    userServiceSpy = createSpyFromClass(UserService);

    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        TranslateModule.forRoot(),
        TestingModule
      ],
      declarations: [
        RegisteredOfficeMembersTableComponent,
        TranslateCountryPipe,
        MockBrandCodeComponent,
        MockMembersTableComponent
      ],
      providers: [
        ApiService,
        LoggingService,
        CountryService,
        TranslateDataPipe,
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: UserService, useValue: userServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredOfficeMembersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('removeMemberWithRO', () => {
    it('should emit event on remove member with RO', () => {
      const spy = spyOn(component.memberWithRORemoved, 'emit');
      const memberId = 'GS0000001';
      component.expandedOutletIdList = [memberId];
      component.removeMemberWithRO(memberId);
      expect(spy).toHaveBeenCalledWith(memberId);
      expect(component.expandedOutletIdList.length).toEqual(0);
    });
  });

  describe('removeMember', () => {
    it('should emit event on remove member with RO', () => {
      const spy = spyOn(component.memberRemoved, 'emit');
      const memberId = 'GS0000002';
      component.removeMember(memberId);
      expect(spy).toHaveBeenCalledWith(memberId);
    });
  });

  describe('getROMemberDetails', () => {
    it('should return members if RO is found', () => {
      component.membersWithRO = dealerGroupMembersWithRO;
      expect(component.getROMemberDetails('GS00000001')).toEqual(dealerGroupMembersWithRO[0].members);
    });
    it('should return undefined if RO is not found', () => {
      component.membersWithRO = dealerGroupMembersWithRO;
      expect(component.getROMemberDetails('GS00000002')).toBeUndefined();
    });
  });

  describe('isExpandable', () => {
    it('should return true if has at least one member', () => {
      component.membersWithRO = dealerGroupMembersWithRO;
      expect(component.isExpandable('GS00000001')).toBeTruthy();
    });
    it('should return false if RO not found', () => {
      component.membersWithRO = dealerGroupMembersWithRO;
      expect(component.isExpandable('GS00000002')).toBeFalsy();
    });
    it('should return false if no member', () => {
      component.membersWithRO = dealerGroupMembersWithRO;
      expect(component.isExpandable('GS00000003')).toBeFalsy();
    });
  });

  describe('showDetail', () => {
    it('should set show to true if is expandable when on click show detail', () => {
      component.membersWithRO = dealerGroupMembersWithRO;
      component.dataSource.data = dealerGroupMembersWithRO.map(member => ({
        row: member.registeredOffice,
        show: false
      }));
      component.showDetail(component.dataSource.data[0]);
      expect(component.expandedOutletIdList).toEqual(['GS00000001']);
      expect(component.dataSource.data[0].show).toBeTruthy();
    });
  });

  describe('sortChange', () => {
    it('should emit event on sort change', () => {
      const spy = spyOn(component.sortChangeEvent, 'emit');
      component.sortChange('anything');
      expect(spy).toHaveBeenCalledWith('anything');
    });
  });

  describe('filterTable - RO', () => {
    it('should filter table and emit event on search for outlet', () => {
      component.dataSource.data = dealerGroupMembersWithRO.map(member => ({
        row: member.registeredOffice,
        show: false
      }));

      const filterValue = dealerGroupMembersWithRO[1].registeredOffice.legalName;

      const spy = spyOn(component.filterEvent, 'emit');
      component.filterTable(filterValue);
      expect(spy).toHaveBeenCalledWith(filterValue);

      expect(component.dataSource.filteredData.length).toBe(1);
      expect(
        component.dataSource.filteredData.find(member => member.row.legalName === filterValue)
      ).toBeTruthy();
    });

    it('should filter table by legal name', () => {
      component.dataSource.data = dealerGroupMembersWithRO.map(member => ({
        row: member.registeredOffice,
        show: false
      }));

      const filterValue = dealerGroupMembersWithRO[1].registeredOffice.legalName;

      component.filterTable(filterValue);

      expect(component.dataSource.data.length).toBe(2);
      expect(component.dataSource.filteredData.length).toBe(1);
    });

    it('should filter table by outlet id', () => {
      component.dataSource.data = dealerGroupMembersWithRO.map(member => ({
        row: member.registeredOffice,
        show: false
      }));

      const filterValue = dealerGroupMembersWithRO[1].registeredOffice.id;

      component.filterTable(filterValue);

      expect(component.dataSource.data.length).toBe(2);
      expect(component.dataSource.filteredData.length).toBe(1);
    });

    it('should filter table by company id', () => {
      component.dataSource.data = dealerGroupMembersWithRO.map(member => ({
        row: member.registeredOffice,
        show: false
      }));

      const filterValue = dealerGroupMembersWithRO[1].registeredOffice.companyId;

      component.filterTable(filterValue);

      expect(component.dataSource.data.length).toBe(2);
      expect(component.dataSource.filteredData.length).toBe(1);
    });

    it('should filter table by address', () => {
      component.dataSource.data = dealerGroupMembersWithRO.map(member => ({
        row: member.registeredOffice,
        show: false
      }));

      const filterValue = dealerGroupMembersWithRO[1].registeredOffice.address.street + ' ' + dealerGroupMembersWithRO[1].registeredOffice.address.streetNumber;

      component.filterTable(filterValue);

      expect(component.dataSource.data.length).toBe(2);
      expect(component.dataSource.filteredData.length).toBe(1);
    });

    it('should filter table by country name', () => {
      component.dataSource.data = dealerGroupMembersWithRO.map(member => ({
        row: member.registeredOffice,
        show: false
      }));

      const filterValue = dealerGroupMembersWithRO[1].registeredOffice.country.name;

      component.filterTable(filterValue);

      expect(component.dataSource.data.length).toBe(2);
      expect(component.dataSource.filteredData.length).toBe(2);
    });

    it('should filter table by brand codes', () => {
      dealerGroupMembersWithRO[1].registeredOffice.brandCodes = [
        {
          brandCode: '12345',
          brandId: 'MB'
        }
      ];
      component.dataSource.data = dealerGroupMembersWithRO.map(member => ({
        row: member.registeredOffice,
        show: false
      }));

      const filterValue = dealerGroupMembersWithRO[1].registeredOffice.brandCodes[0].brandCode;

      component.filterTable(filterValue);

      expect(component.dataSource.data.length).toBe(2);
      expect(component.dataSource.filteredData.length).toBe(1);
    });
  });

  describe('filterTable - members', () => {
    it('should filter table by ro members outlet id', () => {
      component.membersWithRO = dealerGroupMembersWithRO;
      component.dataSource.data = dealerGroupMembersWithRO.map(member => ({
        row: member.registeredOffice,
        show: false
      }));

      const filterValue = dealerGroupMembersWithRO[0].members[0].id;

      component.filterTable(filterValue);

      expect(component.dataSource.data.length).toBe(2);
      expect(component.dataSource.filteredData.length).toBe(1);
    });

    it('should filter table by ro members company id', () => {
      component.membersWithRO = dealerGroupMembersWithRO;
      component.dataSource.data = dealerGroupMembersWithRO.map(member => ({
        row: member.registeredOffice,
        show: false
      }));

      const filterValue = dealerGroupMembersWithRO[0].members[0].companyId;

      component.filterTable(filterValue);

      expect(component.dataSource.data.length).toBe(2);
      expect(component.dataSource.filteredData.length).toBe(1);
    });

    it('should filter table by ro members address', () => {
      component.membersWithRO = dealerGroupMembersWithRO;
      component.dataSource.data = dealerGroupMembersWithRO.map(member => ({
        row: member.registeredOffice,
        show: false
      }));

      const filterValue = dealerGroupMembersWithRO[0].members[0].address.street + ' ' + dealerGroupMembersWithRO[0].members[0].address.streetNumber;

      component.filterTable(filterValue);

      expect(component.dataSource.data.length).toBe(2);
      expect(component.dataSource.filteredData.length).toBe(1);
    });

    it('should filter table by ro members country name', () => {
      component.membersWithRO = dealerGroupMembersWithRO;
      component.dataSource.data = dealerGroupMembersWithRO.map(member => ({
        row: member.registeredOffice,
        show: false
      }));

      const filterValue = dealerGroupMembersWithRO[0].members[0].country.name;

      component.filterTable(filterValue);

      expect(component.dataSource.data.length).toBe(2);
      expect(component.dataSource.filteredData.length).toBe(2);
    });

    it('should filter table by ro members brand codes', () => {
      dealerGroupMembersWithRO[0].members[0].brandCodes = [
        {
          brandCode: '54321',
          brandId: 'MB'
        }
      ];
      component.membersWithRO = dealerGroupMembersWithRO;
      component.dataSource.data = dealerGroupMembersWithRO.map(member => ({
        row: member.registeredOffice,
        show: false
      }));

      const filterValue = dealerGroupMembersWithRO[0].members[0].brandCodes[0].brandCode;

      component.filterTable(filterValue);

      expect(component.dataSource.data.length).toBe(2);
      expect(component.dataSource.filteredData.length).toBe(1);
    });
  });
});

describe('TestRegisteredOfficeMembersTableComponentHostComponent', () => {
  let hostComponent: TestRegisteredOfficeMembersTableComponentHostComponent;
  let fixture: ComponentFixture<TestRegisteredOfficeMembersTableComponentHostComponent>;
  let userServiceSpy: Spy<UserService>;

  beforeEach(
    waitForAsync(() => {
      userServiceSpy = createSpyFromClass(UserService);

      TestBed.configureTestingModule({
        imports: [
          TranslateModule.forRoot(),
          TestingModule
        ],
        declarations: [
          RegisteredOfficeMembersTableComponent,
          TestRegisteredOfficeMembersTableComponentHostComponent
        ],
        providers: [
          ApiService,
          LoggingService,
          CountryService,
          TranslateDataPipe,
          { provide: MatDialog, useValue: {} },
          { provide: UserService, useValue: userServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestRegisteredOfficeMembersTableComponentHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnChanges', () => {
    it('should get dealer group member with ro list', () => {
      hostComponent.dealerGroupMemberWithROFromHost = dealerGroupMembersWithRO;
      const childComponent = hostComponent.registeredOfficeMembersTableComponent;

      spyOn(childComponent, 'ngOnChanges').and.callThrough();
      fixture.detectChanges();
      expect(childComponent.ngOnChanges).toHaveBeenCalled();

      expect(childComponent.membersWithRO).toEqual(dealerGroupMembersWithRO);
      expect(childComponent.dataSource.data).toEqual(
        dealerGroupMembersWithRO.map(member => ({
          row: member.registeredOffice,
          show: false
        })));
      expect(childComponent.dataSource.sort).toEqual(childComponent.sort);
    });

    it('should get dealer group member with expanded ro list', () => {
      hostComponent.dealerGroupMemberWithROFromHost = [dealerGroupMembersWithRO[0]];
      const childComponent = hostComponent.registeredOfficeMembersTableComponent;
      childComponent.expandedOutletIdList = ['GS00000001'];

      spyOn(childComponent, 'ngOnChanges').and.callThrough();
      fixture.detectChanges();
      expect(childComponent.ngOnChanges).toHaveBeenCalled();

      expect(childComponent.membersWithRO).toEqual([dealerGroupMembersWithRO[0]]);
      expect(childComponent.dataSource.data).toEqual([{
        row: dealerGroupMembersWithRO[0].registeredOffice,
        show: true
      }]);
      expect(childComponent.dataSource.sort).toEqual(childComponent.sort);
    });

    it('should get dealer group member without ro list', () => {
      hostComponent.dealerGroupMemberWithoutROFromHost = dealerGroupMembersMock;
      const childComponent = hostComponent.registeredOfficeMembersTableComponent;

      spyOn(childComponent, 'ngOnChanges').and.callThrough();
      fixture.detectChanges();
      expect(childComponent.ngOnChanges).toHaveBeenCalled();

      expect(childComponent.membersWithoutRO).toEqual(dealerGroupMembersMock);

    });
  });

  describe('show display columns', () => {
    it('should get 5 columns when readOnly is true and disabled is false', () => {
      const childComponent = hostComponent.registeredOfficeMembersTableComponent;

      hostComponent.disabledValueFromHost = false;
      hostComponent.readOnlyValueFromHost = true;

      spyOn(childComponent, 'ngOnChanges').and.callThrough();
      fixture.detectChanges();

      expect(childComponent.displayedColumns.length).toBe(5);
      expect(childComponent.displayedColumns).toStrictEqual(['expansionIndicator', 'legalName', 'address', 'brandCode', 'type']);

    });

    it('should get 5 columns when readOnly is false & disabled is true', () => {
      const childComponent = hostComponent.registeredOfficeMembersTableComponent;

      hostComponent.disabledValueFromHost = true;
      hostComponent.readOnlyValueFromHost = false;

      spyOn(childComponent, 'ngOnChanges').and.callThrough();
      fixture.detectChanges();

      expect(childComponent.displayedColumns.length).toBe(5);
      expect(childComponent.displayedColumns).toStrictEqual(['expansionIndicator', 'legalName', 'address', 'brandCode', 'type']);
    });

    it('should get 5 columns when readOnly & disabled is true', () => {
      const childComponent = hostComponent.registeredOfficeMembersTableComponent;

      hostComponent.disabledValueFromHost = true;
      hostComponent.readOnlyValueFromHost = true;

      spyOn(childComponent, 'ngOnChanges').and.callThrough();
      fixture.detectChanges();

      expect(childComponent.displayedColumns.length).toBe(5);
      expect(childComponent.displayedColumns).toStrictEqual(['expansionIndicator', 'legalName', 'address', 'brandCode', 'type']);
    });

    it('should get 6 columns when readOnly is false & disabled is false', () => {
      const childComponent = hostComponent.registeredOfficeMembersTableComponent;

      hostComponent.disabledValueFromHost = false;
      hostComponent.readOnlyValueFromHost = false;

      spyOn(childComponent, 'ngOnChanges').and.callThrough();
      fixture.detectChanges();

      expect(childComponent.displayedColumns.length).toBe(6);
      expect(childComponent.displayedColumns).toStrictEqual(['expansionIndicator', 'legalName', 'address', 'brandCode', 'type', 'cancel']);
    });
  });
});
