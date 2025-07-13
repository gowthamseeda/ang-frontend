import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../../testing/testing.module';
import { dealerGroupsMock } from '../../model/dealer-groups.mock';

import { DealerGroupsService } from '../../dealer-groups.service';
import { DealerGroupsComponent } from './dealer-groups.component';
import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { UserService } from '../../../../iam/user/user.service';
import { TranslateCountryPipe } from '../../../../shared/pipes/translate-country/translate-country.pipe';
import { ApiService } from '../../../../shared/services/api/api.service';
import { LoggingService } from '../../../../shared/services/logging/logging.service';
import { CountryService } from '../../../../geography/country/country.service';
import { TranslateDataPipe } from '../../../../shared/pipes/translate-data/translate-data.pipe';

@Component({
  template: '<gp-dealer-groups></gp-dealer-groups>'
})
class TestComponent {
  @ViewChild(DealerGroupsComponent)
  dealerGroupsComponent: DealerGroupsComponent;
}

describe('DealerGroupsComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  let dealerGroupsServiceSpy: Spy<DealerGroupsService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let userServiceSpy: Spy<UserService>;

  const mockDealerGroups = dealerGroupsMock;
  mockDealerGroups.dealerGroups.forEach((dealerGroup, index) => {
    dealerGroup.name = `${dealerGroup.name + ' ' + index}`;
  });
  mockDealerGroups.dealerGroups[0].headquarter.brandCodes = [
    {
      brandCode: '12345',
      brandId: 'MB'
    }
  ];

  beforeEach(
    waitForAsync(() => {
      dealerGroupsServiceSpy = createSpyFromClass(DealerGroupsService);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);
      userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
      userServiceSpy = createSpyFromClass(UserService);

      dealerGroupsServiceSpy.getAll.nextWith(mockDealerGroups);

      TestBed.configureTestingModule({
        declarations: [DealerGroupsComponent, TestComponent, TranslateCountryPipe],
        imports: [
          TestingModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateFakeLoader
            }
          })
        ],
        providers: [
          ApiService,
          LoggingService,
          CountryService,
          TranslateDataPipe,
          TranslateService,
          {
            provide: DealerGroupsService,
            useValue: dealerGroupsServiceSpy
          },
          { provide: SnackBarService, useValue: snackBarServiceSpy },
          {
            provide: UserAuthorizationService,
            useValue: {
              isAuthorizedFor: userAuthorizationServiceSpy
            }
          },
          { provide: UserService, useValue: userServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.verify.nextWith(true);

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should transform dealer group data correctly', () => {
    expect(component.dealerGroupsComponent.dealerGroupTableRows).toEqual([
      {
        country: 'United Kingdom of Great Britain and Northern Ireland',
        dealerGroupId: 'DG00000001',
        dealerGroupName: 'Dealer Group 0',
        headquarter: 'Auto Lang',
        headquarterId: 'GS00000001',
        headquarterBrandCodes: [
          {
            brandCode: '12345',
            brandId: 'MB'
          }
        ],
        activeState: true,
        activeStateText: 'ACTIVE'
      },
      {
        country: 'United Kingdom of Great Britain and Northern Ireland',
        dealerGroupId: 'DG00000002',
        dealerGroupName: 'Dealer Group 1',
        headquarter: 'John Gill',
        headquarterId: 'GS00000002',
        headquarterBrandCodes: [
          {
            brandCode: '12345',
            brandId: 'MB'
          }
        ],
        activeState: true,
        activeStateText: 'ACTIVE'
      },
      {
        country: 'United Kingdom of Great Britain and Northern Ireland',
        dealerGroupId: 'DG00000003',
        dealerGroupName: 'Dealer Group 2',
        headquarter: 'John Gill',
        headquarterBrandCodes: [
          {
            brandCode: '12345',
            brandId: 'MB'
          }
        ],
        headquarterId: 'GS00000002',
        activeState: true,
        activeStateText: 'ACTIVE'
      },
      {
        country: 'UK',
        dealerGroupId: 'DG00000004',
        dealerGroupName: 'Dealer Group (inactive) 3',
        headquarter: 'John Gill',
        headquarterBrandCodes: [
          {
            brandCode: '12345',
            brandId: 'MB'
          }
        ],
        headquarterId: 'GS00000002',
        activeState: false,
        activeStateText: 'INACTIVE',
        successor: 'Dealer Group',
        successorId: 'DG00000002'
      }
    ]);
  });

  describe('filterTable', () => {
    it('should filter table by dealer group name', () => {
      const mockData = dealerGroupsMock.dealerGroups[0];

      const filterValue = mockData.name;
      component.dealerGroupsComponent.filterTable(filterValue);

      expect(component.dealerGroupsComponent.dealerGroupsDataSource.data.length).toEqual(4);
      expect(component.dealerGroupsComponent.dealerGroupsDataSource.filteredData.length).toEqual(1);
    });

    it('should filter table by dealer group country', () => {
      const mockData = dealerGroupsMock.dealerGroups[0];

      const filterValue = mockData.country.name;
      component.dealerGroupsComponent.filterTable(filterValue);

      expect(component.dealerGroupsComponent.dealerGroupsDataSource.data.length).toEqual(4);
      expect(component.dealerGroupsComponent.dealerGroupsDataSource.filteredData.length).toEqual(3);
    });

    it('should filter table by dealer group id', () => {
      const mockData = dealerGroupsMock.dealerGroups[3];

      const filterValue = mockData.dealerGroupId;
      component.dealerGroupsComponent.filterTable(filterValue);

      expect(component.dealerGroupsComponent.dealerGroupsDataSource.data.length).toEqual(4);
      expect(component.dealerGroupsComponent.dealerGroupsDataSource.filteredData.length).toEqual(1);
    });

    it('should filter table by dealer group headquarter', () => {
      const mockData = dealerGroupsMock.dealerGroups[1];

      const filterValue = mockData.headquarter.legalName;
      component.dealerGroupsComponent.filterTable(filterValue);

      expect(component.dealerGroupsComponent.dealerGroupsDataSource.data.length).toEqual(4);
      expect(component.dealerGroupsComponent.dealerGroupsDataSource.filteredData.length).toEqual(3);
    });

    it('should filter table by dealer group brand codes', () => {
      const mockData = dealerGroupsMock.dealerGroups[0];

      const filterValue = mockData.headquarter.brandCodes!![0].brandCode;
      component.dealerGroupsComponent.filterTable(filterValue);

      expect(component.dealerGroupsComponent.dealerGroupsDataSource.data.length).toEqual(4);
      expect(component.dealerGroupsComponent.dealerGroupsDataSource.filteredData.length).toEqual(4);
    });

    it('should filter table by dealer group active state', () => {
      const filterValue = 'INACTIVE';
      component.dealerGroupsComponent.filterTable(filterValue);

      expect(component.dealerGroupsComponent.dealerGroupsDataSource.data.length).toEqual(4);
      expect(component.dealerGroupsComponent.dealerGroupsDataSource.filteredData.length).toEqual(1);
    });
  });
});
