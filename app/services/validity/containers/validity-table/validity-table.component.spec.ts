import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { UserService } from '../../../../iam/user/user.service';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { OfferedServiceService } from '../../../offered-service/offered-service.service';
import { ValidityTableStatusService } from '../../services/validity-table-status.service';
import { ValidityTableService } from '../../services/validity-table.service';
import { ValidityTableRow } from '../../validity.model';

import { ValidityTableComponent } from './validity-table.component';

describe('ValidityTableComponent', () => {
  const offeredServicesList = [
    {
      id: 'GS0000001-1',
      serviceId: 2,
      productCategoryId: 2,
      brandId: 'MB',
      productGroupId: 'PC'
    },
    {
      id: 'GS0000001-2',
      serviceId: 2,
      productCategoryId: 2,
      brandId: 'MYB',
      productGroupId: 'PC'
    }
  ];

  const validityTableRows: ValidityTableRow[] = [
    {
      application: true,
      applicationValidUntil: '2019-01-01',
      validFrom: '2019-01-02',
      validUntil: '2019-01-31',
      offeredServicesMap: {
        'GS0000001-3': {
          id: 'GS0000001-3',
          serviceId: 2,
          productCategoryId: 2,
          brandId: 'MB',
          productGroupId: 'PC',
          validity: {
            application: true,
            applicationValidUntil: '2019-01-01',
            validFrom: '2019-01-02',
            validUntil: '2019-01-31'
          }
        }
      }
    },
    {
      application: undefined,
      applicationValidUntil: undefined,
      validFrom: undefined,
      validUntil: undefined,
      offeredServicesMap: {
        'GS0000001-1': offeredServicesList[0],
        'GS0000001-2': offeredServicesList[1]
      }
    }
  ];

  let offeredServiceServiceSpy: Spy<OfferedServiceService>;
  let validityTableServiceSpy: Spy<ValidityTableService>;
  let userServiceSpy: Spy<UserService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let routerSpy: Spy<Router>;

  let component: ValidityTableComponent;
  let fixture: ComponentFixture<ValidityTableComponent>;

  beforeEach(
    waitForAsync(() => {
      offeredServiceServiceSpy = createSpyFromClass(OfferedServiceService);
      offeredServiceServiceSpy.getAllForServiceWith.nextWith(offeredServicesList);
      validityTableServiceSpy = createSpyFromClass(ValidityTableService);
      validityTableServiceSpy.getValidityTableRows.nextWith(validityTableRows);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);
      routerSpy = createSpyFromClass(Router);

      userServiceSpy = createSpyFromClass(UserService);

      TestBed.configureTestingModule({
        providers: [
          ValidityTableStatusService,
          {
            provide: OfferedServiceService,
            useValue: offeredServiceServiceSpy
          },
          {
            provide: ValidityTableService,
            useValue: validityTableServiceSpy
          },
          {
            provide: UserService,
            useValue: userServiceSpy
          },
          {
            provide: SnackBarService,
            useValue: snackBarServiceSpy
          },
          {
            provide: Router,
            useValue: routerSpy
          }
        ],
        declarations: [ValidityTableComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidityTableComponent);
    component = fixture.componentInstance;

    component.outletId = 'GS00000001';
    component.serviceId = 1;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should init brand product groups', done => {
      const expected = {
        MB: [{ brandId: 'MB', productGroupId: 'PC' }],
        MYB: [{ brandId: 'MYB', productGroupId: 'PC' }]
      };

      component.brandProductGroups.subscribe(brandProductGroups => {
        expect(brandProductGroups).toEqual(expected);
        done();
      });
    });
  });
});
