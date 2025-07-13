import { TestBed, waitForAsync } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { OfferedService } from '../../offered-service/offered-service.model';
import { ServiceFilterCriteria, ServiceTableRow } from '../models/service-table-row.model';
import { Service } from '../models/service.model';

import { ServiceTableFilterService } from './service-table-filter.service';

describe('ServiceTableFilterService', () => {
  const services: Service[] = [
    {
      id: 1,
      name: 'Sales',
      position: 0,
      active: true,
      openingHoursSupport: true
    },
    {
      id: 2,
      name: 'Parts Sales',
      position: 1,
      active: true,
      openingHoursSupport: false
    },
    {
      id: 3,
      name: 'Electric Drive Service',
      position: 2,
      active: true,
      openingHoursSupport: false
    }
  ];

  const serviceTableRow1: ServiceTableRow = {
    entry: services[0]
  };
  const serviceTableRow2: ServiceTableRow = {
    entry: services[1]
  };
  const serviceTableRow3: ServiceTableRow = {
    entry: services[2]
  };

  const offeredService: OfferedService[] = [
    {
      id: 'GS0000001-1',
      serviceId: 1,
      productCategoryId: 1,
      brandId: 'MB',
      productGroupId: 'PC'
    }
  ];

  describe('ServiceTableFilterService', () => {
    let serviceTableFilterService: ServiceTableFilterService;
    let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;

    beforeEach(
      waitForAsync(() => {
        userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
        userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
        userAuthorizationServiceSpy.verify.nextWith(false);

        TestBed.configureTestingModule({
          providers: [
            ServiceTableFilterService,
            {
              provide: UserAuthorizationService,
              useValue: { isAuthorizedFor: userAuthorizationServiceSpy }
            }
          ]
        });

        serviceTableFilterService = TestBed.inject(ServiceTableFilterService);

        const serviceTableRows = [serviceTableRow1, serviceTableRow2, serviceTableRow3];
        serviceTableFilterService.initServiceFilterSearchData(serviceTableRows, offeredService);
      })
    );

    it('should be created', () => {
      expect(serviceTableFilterService).toBeTruthy();
    });

    describe('initServiceFilterSearchData', () => {
      it('init services and offered service data', done => {
        userAuthorizationServiceSpy.verify.nextWith(true);
        expect(serviceTableFilterService.pristineServiceRows).toEqual(
          expect.arrayContaining([
            expect.objectContaining(serviceTableRow1),
            expect.objectContaining(serviceTableRow2),
            expect.objectContaining(serviceTableRow3)
          ])
        );
        expect(serviceTableFilterService.pristineOfferedService).toEqual(
          expect.arrayContaining(offeredService)
        );
        done();
      });
    });

    describe('servicesFilter', () => {
      it('filter with offered service', done => {
        const serviceFilterCriteria: ServiceFilterCriteria = {
          isOfferedService: {
            value: true,
            isEnabled: false
          }
        };

        serviceTableFilterService.servicesFilter(serviceFilterCriteria).subscribe(row => {
          expect(row).toEqual(expect.arrayContaining([expect.objectContaining(serviceTableRow1)]));
        });
        done();
      });

      it('filter without offered service', done => {
        const serviceFilterCriteria: ServiceFilterCriteria = {
          isOfferedService: {
            value: false,
            isEnabled: true
          }
        };

        serviceTableFilterService.servicesFilter(serviceFilterCriteria).subscribe(row => {
          expect(row).toEqual(
            expect.arrayContaining([
              expect.objectContaining(serviceTableRow1),
              expect.objectContaining(serviceTableRow2),
              expect.objectContaining(serviceTableRow3)
            ])
          );
        });
        done();
      });
    });

    describe('pristineFilterCriteria', () => {
      it('init filter criteria with allowed role', done => {
        userAuthorizationServiceSpy.verify.nextWith(true);

        serviceTableFilterService.filterCriteria.subscribe(data => {
          expect(data.isOfferedService.value).toEqual(true);
          expect(data.isOfferedService.isEnabled).toEqual(false);
        });
        done();
      });
      it('init filter criteria with not allowed role', done => {
        serviceTableFilterService.filterCriteria.subscribe(data => {
          expect(data.isOfferedService.value).toEqual(false);
          expect(data.isOfferedService.isEnabled).toEqual(true);
        });
        done();
      });
    });
  });
});
