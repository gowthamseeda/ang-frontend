import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { CountryService } from '../../../../geography/country/country.service';
import { TranslateCountryPipe } from '../../../../shared/pipes/translate-country/translate-country.pipe';
import { ApiService } from '../../../../shared/services/api/api.service';
import { StructuresMember } from '../../models/shared.model';
import { UserService } from '../../../../iam/user/user.service';
import { TranslateDataPipe } from '../../../../shared/pipes/translate-data/translate-data.pipe';
import { TestingModule } from '../../../../testing/testing.module';
import { LoggingService } from '../../../../shared/services/logging/logging.service';

import { MembersTableComponent } from './members-table.component';

@Component({
  template:
    '<gp-members-table [members]="membersFromHost" [nonRoMember]="nonROMemberFromHost" [sortEvent]="sortEventFromHost" [filterValue]="filterValueFromHost" [disabled]="disabledValueFromHost" [readOnly]="readOnlyValueFromHost"></gp-members-table>'
})
class TestMembersTableComponentHostComponent {
  @ViewChild(MembersTableComponent)
  membersTableComponent: any;
  membersFromHost: StructuresMember[] = [];
  nonROMemberFromHost: boolean;
  sortEventFromHost: MatSort;
  filterValueFromHost: string;
  disabledValueFromHost: boolean;
  readOnlyValueFromHost: boolean;
}

const mockMember1 = {
  id: 'GS00000002',
  companyId: 'GC00000001',
  legalName: 'John Gill',
  address: {
    city: 'Washington'
  },
  isRegisteredOffice: false,
  country: {
    id: 'GB',
    name: 'United Kingdom'
  },
  active: true,
  brandCodes: [
    {
      brandCode: '12345',
      brandId: 'MB'
    }
  ]
};

const mockMember2 = {
  id: 'GS00000003',
  companyId: 'GC00000001',
  legalName: 'John Cena',
  address: {
    city: 'London'
  },
  isRegisteredOffice: false,
  country: {
    id: 'GB',
    name: 'United Kingdom'
  },
  active: true,
  brandCodes: [
    {
      brandCode: '54321',
      brandId: 'MB'
    }
  ]
};

describe('MembersTableComponent', () => {
  let component: MembersTableComponent;
  let fixture: ComponentFixture<MembersTableComponent>;
  let userServiceSpy: Spy<UserService>;

  beforeEach(async () => {
    userServiceSpy = createSpyFromClass(UserService);

    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        TestingModule
      ],
      declarations: [MembersTableComponent, TranslateCountryPipe],
      providers: [
        CountryService,
        ApiService,
        LoggingService,
        TranslateDataPipe,
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event on remove member', () => {
    const spy = spyOn(component.memberRemoved, 'emit');
    const memberId = 'GS0000001';
    component.removeMember(memberId);
    expect(spy).toHaveBeenCalledWith(memberId);
  });
});

describe('TestMembersTableComponentHostComponent', () => {
  let hostComponent: TestMembersTableComponentHostComponent;
  let fixture: ComponentFixture<TestMembersTableComponentHostComponent>;
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
          MembersTableComponent,
          TestMembersTableComponentHostComponent
        ],
        providers: [
          CountryService,
          ApiService,
          LoggingService,
          TranslateDataPipe,
          { provide: UserService, useValue: userServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestMembersTableComponentHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnChanges', () => {
    it('should get dealer group member with ro list', () => {
      const mockMembers = [
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
        }
      ];

      hostComponent.membersFromHost = mockMembers;
      hostComponent.nonROMemberFromHost = true;

      const childComponent = hostComponent.membersTableComponent;

      spyOn(childComponent, 'ngOnChanges').and.callThrough();
      fixture.detectChanges();
      expect(childComponent.ngOnChanges).toHaveBeenCalled();
      expect(childComponent.dataSource.data).toEqual(mockMembers);
    });

    it('should get dealer group member with non ro assigned and sort being triggered', () => {
      const mockMembers = [
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
          id: 'GS00000003',
          companyId: 'GC00000001',
          legalName: 'John Cena',
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
      ];

      hostComponent.membersFromHost = mockMembers;
      hostComponent.nonROMemberFromHost = true;
      const sortEventFromHost = new MatSort();
      sortEventFromHost.active = 'legalName';
      sortEventFromHost.direction = 'asc';
      hostComponent.sortEventFromHost = sortEventFromHost;

      const childComponent = hostComponent.membersTableComponent;
      const currentSortEvent = new MatSort();
      currentSortEvent.active = 'address';
      currentSortEvent.direction = 'desc';
      childComponent.sort = currentSortEvent;

      spyOn(childComponent, 'ngOnChanges').and.callThrough();
      fixture.detectChanges();

      expect(childComponent.ngOnChanges).toHaveBeenCalled();

      expect(childComponent.dataSource.data).toEqual(mockMembers);
      expect(childComponent.sort.active).toEqual(sortEventFromHost.active);
      expect(childComponent.sort.direction).toEqual(sortEventFromHost.direction);
    });

    it('should get dealer group member with non ro assigned and filter being triggered', () => {
      const mockMembers = [
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
          id: 'GS00000003',
          companyId: 'GC00000001',
          legalName: 'John Cena',
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
      ];

      hostComponent.membersFromHost = mockMembers;
      hostComponent.nonROMemberFromHost = true;
      hostComponent.filterValueFromHost = mockMembers[0].legalName;

      const childComponent = hostComponent.membersTableComponent;

      spyOn(childComponent, 'ngOnChanges').and.callThrough();
      fixture.detectChanges();

      expect(childComponent.ngOnChanges).toHaveBeenCalled();
      expect(childComponent.dataSource.data).toEqual(mockMembers);
      expect(childComponent.dataSource.filteredData.length).toBe(1);
      expect(
        childComponent.dataSource.filteredData.find((member: StructuresMember) => member.legalName === mockMembers[0].legalName)
      ).toBeTruthy();
    });
  });

  describe('filterTable', () => {
    it('should filter table by legal name', () => {
      const mockMembers = [mockMember1, mockMember2];

      hostComponent.membersFromHost = mockMembers;
      hostComponent.filterValueFromHost = mockMembers[1].legalName;
      fixture.detectChanges();

      const childComponent = hostComponent.membersTableComponent;

      expect(childComponent.dataSource.data.length).toEqual(2);
      expect(childComponent.dataSource.filteredData.length).toEqual(1);
    });

    it('should filter table by outlet id', () => {
      const mockMembers = [mockMember1, mockMember2];

      hostComponent.membersFromHost = mockMembers;
      hostComponent.filterValueFromHost = mockMembers[1].id;
      fixture.detectChanges();

      const childComponent = hostComponent.membersTableComponent;

      expect(childComponent.dataSource.data.length).toEqual(2);
      expect(childComponent.dataSource.filteredData.length).toEqual(1);
    });

    it('should filter table by company id', () => {
      const mockMembers = [mockMember1, mockMember2];

      hostComponent.membersFromHost = mockMembers;
      hostComponent.filterValueFromHost = mockMembers[1].companyId;
      fixture.detectChanges();

      const childComponent = hostComponent.membersTableComponent;

      expect(childComponent.dataSource.data.length).toEqual(2);
      expect(childComponent.dataSource.filteredData.length).toEqual(2);
    });

    it('should filter table by address', () => {
      const mockMembers = [mockMember1, mockMember2];

      hostComponent.membersFromHost = mockMembers;
      hostComponent.filterValueFromHost = mockMembers[1].address?.city;
      fixture.detectChanges();

      const childComponent = hostComponent.membersTableComponent;

      expect(childComponent.dataSource.data.length).toEqual(2);
      expect(childComponent.dataSource.filteredData.length).toEqual(1);
    });

    it('should filter table by country name', () => {
      const mockMembers = [mockMember1, mockMember2];

      hostComponent.membersFromHost = mockMembers;
      hostComponent.filterValueFromHost = mockMembers[1].country.name;
      fixture.detectChanges();

      const childComponent = hostComponent.membersTableComponent;

      expect(childComponent.dataSource.data.length).toEqual(2);
      expect(childComponent.dataSource.filteredData.length).toEqual(2);
    });

    it('should filter table by brand codes', () => {
      const mockMembers = [mockMember1, mockMember2];

      hostComponent.membersFromHost = mockMembers;
      hostComponent.filterValueFromHost = mockMembers[1].brandCodes[0].brandCode;
      fixture.detectChanges();

      const childComponent = hostComponent.membersTableComponent;

      expect(childComponent.dataSource.data.length).toEqual(2);
      expect(childComponent.dataSource.filteredData.length).toEqual(1);
    });
  });

  describe('show display column', () => {
    it('should get 4 columns when readOnly is true and disabled is false', () => {
      const childComponent = hostComponent.membersTableComponent;

      hostComponent.disabledValueFromHost = false;
      hostComponent.readOnlyValueFromHost = true;

      spyOn(childComponent, 'ngOnChanges').and.callThrough();
      fixture.detectChanges();

      expect(childComponent.displayedColumns.length).toBe(4);
      expect(childComponent.displayedColumns).toStrictEqual(['legalName', 'address', 'brandCode', 'type']);
    });

    it('should get 4 columns when readOnly is false & disabled is true', () => {
      const childComponent = hostComponent.membersTableComponent;

      hostComponent.disabledValueFromHost = true;
      hostComponent.readOnlyValueFromHost = false;


      spyOn(childComponent, 'ngOnChanges').and.callThrough();
      fixture.detectChanges();

      expect(childComponent.displayedColumns.length).toBe(4);
      expect(childComponent.displayedColumns).toStrictEqual(['legalName', 'address', 'brandCode', 'type']);
    });

    it('should get 4 columns when readOnly & disabled is true', () => {
      const childComponent = hostComponent.membersTableComponent;

      hostComponent.disabledValueFromHost = true;
      hostComponent.readOnlyValueFromHost = true;


      spyOn(childComponent, 'ngOnChanges').and.callThrough();
      fixture.detectChanges();

      expect(childComponent.displayedColumns.length).toBe(4);
      expect(childComponent.displayedColumns).toStrictEqual(['legalName', 'address', 'brandCode', 'type']);
    });

    it('should get 5 columns when readOnly is false & disabled is false', () => {
      const childComponent = hostComponent.membersTableComponent;

      hostComponent.disabledValueFromHost = false;
      hostComponent.readOnlyValueFromHost = false;


      spyOn(childComponent, 'ngOnChanges').and.callThrough();
      fixture.detectChanges();

      expect(childComponent.displayedColumns.length).toBe(5);
      expect(childComponent.displayedColumns).toStrictEqual(['legalName', 'address', 'brandCode', 'type', 'cancel']);
    });
  });
});
