import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { NgxPermissionsAllowStubDirective } from 'ngx-permissions';
import { CountryService } from '../../../../geography/country/country.service';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { UserService } from '../../../../iam/user/user.service';
import { MasterBrandService } from '../../../../master/brand/master-brand/master-brand.service';
import { TranslateCountryPipe } from '../../../../shared/pipes/translate-country/translate-country.pipe';
import { TranslateDataPipe } from '../../../../shared/pipes/translate-data/translate-data.pipe';
import { ApiService } from '../../../../shared/services/api/api.service';
import { LoggingService } from '../../../../shared/services/logging/logging.service';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../../testing/testing.module';
import { GeneralGroupsService } from '../../general-groups.service';
import { generalGroupsMock } from '../../model/general-groups.mock';

import { GeneralGroupsComponent } from './general-groups.component';

describe('GeneralGroupsComponent', () => {
  let component: GeneralGroupsComponent;
  let generalGroupsServiceSpy: Spy<GeneralGroupsService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let masterBrandSpy: Spy<MasterBrandService>;
  let fixture: ComponentFixture<GeneralGroupsComponent>;
  let userServiceSpy: Spy<UserService>;

  beforeEach(
    waitForAsync(() => {
      generalGroupsServiceSpy = createSpyFromClass(GeneralGroupsService);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);
      userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
      masterBrandSpy = createSpyFromClass(MasterBrandService);
      userServiceSpy = createSpyFromClass(UserService);

      TestBed.configureTestingModule({
        declarations: [
          GeneralGroupsComponent,
          NgxPermissionsAllowStubDirective,
          TranslateCountryPipe
        ],
        imports: [TranslateModule.forRoot(), NoopAnimationsModule, TestingModule],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          ApiService,
          LoggingService,
          CountryService,
          TranslateDataPipe,
          { provide: GeneralGroupsService, useValue: generalGroupsServiceSpy },
          { provide: SnackBarService, useValue: snackBarServiceSpy },
          {
            provide: UserAuthorizationService,
            useValue: {
              isAuthorizedFor: userAuthorizationServiceSpy
            }
          },
          { provide: MasterBrandService, useValue: masterBrandSpy },
          { provide: UserService, useValue: userServiceSpy }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    generalGroupsServiceSpy.getAll.nextWith(generalGroupsMock);

    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.verify.nextWith(true);
    masterBrandSpy.sort.nextWith(generalGroupsMock.generalGroups[0].brandProductGroupServices);

    fixture = TestBed.createComponent(GeneralGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('brandsBy', () => {
    it('should provide brands by general group id', () => {
      const brandsBy = component.brandsBy('GG00000001');
      expect(masterBrandSpy.sort).toHaveBeenCalled();
      brandsBy.subscribe(brands => {
        expect(brands).toEqual([{ id: 'MB', name: 'Mercedes-Benz' }]);
      });
    });
  });

  describe('productGroupsBy', () => {
    it('should provide product groups by general group id and brand id', () => {
      const productGroups = component.productGroupsBy('GG00000001', 'MB');
      expect(productGroups).toEqual([{ id: 'PC', name: 'Passenger-Car' }]);
    });
  });

  describe('rowContainsProductGroupId', () => {
    it('should provide true if row contains product group id', () => {
      const contains = component.rowContainsProductGroupId('GG00000001', 'MB', 'PC');
      expect(contains).toEqual(true);
    });
    it('should provide false if row does not contain product group id', () => {
      const contains = component.rowContainsProductGroupId('GG00000001', 'MB', 'TRUCK');
      expect(contains).toEqual(false);
    });
  });

  describe('transformToMatDataSource', () => {
    const expected = [
      {
        generalGroupId: 'GG00000001',
        name: 'General Group',
        active: true,
        status: 'ACTIVE',
        country: 'United Kingdom of Great Britain and Northern Ireland',
        brandProductGroupServices: [
          {
            brand: {
              id: 'MB',
              name: 'Mercedes-Benz'
            },
            productGroup: {
              id: 'PC',
              name: 'Passenger-Car'
            },
            service: {
              id: 170,
              name: 'Used Cars'
            }
          }
        ],
        successor: undefined,
        successorId: undefined
      },
      {
        generalGroupId: 'GG00000002',
        name: 'General Group',
        active: true,
        status: 'ACTIVE',
        country: 'United Kingdom of Great Britain and Northern Ireland',
        successor: undefined,
        successorId: undefined
      },
      {
        generalGroupId: 'GG00000003',
        name: 'General Group',
        active: true,
        status: 'ACTIVE',
        country: 'United Kingdom of Great Britain and Northern Ireland',
        successor: undefined,
        successorId: undefined
      },
      {
        generalGroupId: 'GG00000004',
        name: 'General Group (inactive)',
        active: false,
        status: 'INACTIVE',
        country: 'United Kingdom of Great Britain and Northern Ireland',
        successor: 'General Group',
        successorId: 'GG00000002'
      }
    ];

    it('should transform to sortable mat Data Source', () => {
      fixture.detectChanges();
      expect(component.dataSource.data).toEqual(expected);
    });
  });
});
