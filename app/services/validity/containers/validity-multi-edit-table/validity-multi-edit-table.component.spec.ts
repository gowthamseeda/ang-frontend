import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { UserService } from '../../../../iam/user/user.service';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { OfferedServiceService } from '../../../offered-service/offered-service.service';
import { MultiSelectDataService } from '../../../service/services/multi-select-service-data.service';
import { MultiSelectDataServiceMock } from '../../../service/services/multi-select-service-data.service.mock';
import { ValidityTableStatusService } from '../../services/validity-table-status.service';
import { ValidityTableService } from '../../services/validity-table.service';
import { ValidityTableRow } from '../../validity.model';

import { ValidityMultiEditTableComponent } from './validity-multi-edit-table.component';

describe('ValidityMultiEditTableComponent', () => {
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

  let component: ValidityMultiEditTableComponent;
  let fixture: ComponentFixture<ValidityMultiEditTableComponent>;

  beforeEach(
    waitForAsync(() => {
      offeredServiceServiceSpy = createSpyFromClass(OfferedServiceService);
      offeredServiceServiceSpy.getAll.nextWith(offeredServicesList);
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
          },
          {
            provide: MultiSelectDataService,
            useClass: MultiSelectDataServiceMock
          }
        ],
        declarations: [ValidityMultiEditTableComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidityMultiEditTableComponent);
    component = fixture.componentInstance;

    component.outletId = 'GS00000001';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should init brand product groups', done => {
      const expected = {
        MB: [{ brandId: 'MB', productGroupId: 'PC' }]
      };

      component.brandProductGroups.subscribe(brandProductGroups => {
        expect(brandProductGroups).toEqual(expected);
        done();
      });
    });
  });
});
