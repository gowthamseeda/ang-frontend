import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { BrandProductGroup } from '../../brand-product-group/brand-product-group.model';
import { OfferedService } from '../../offered-service/offered-service.model';
import { OfferedServiceService } from '../../offered-service/offered-service.service';
import { ServiceVariant } from '../../service-variant/service-variant.model';
import { ServiceVariantService } from '../../service-variant/service-variant.service';
import { ServiceTableRow } from '../models/service-table-row.model';
import { Service } from '../models/service.model';

import { ServiceTableService } from './service-table.service';
import { ServiceService } from './service.service';

describe('ServiceTableService', () => {
  const services: Service[] = [
    {
      id: 1,
      name: 'Sales',
      position: 0,
      active: true,
      openingHoursSupport: false
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
  const serviceVariants: ServiceVariant[] = [
    {
      id: 1,
      serviceId: 1,
      productCategoryId: 1,
      brandId: 'MB',
      productGroupId: 'PC',
      onlineOnlyAllowed: true,
      active: true
    },
    {
      id: 2,
      serviceId: 1,
      productCategoryId: 1,
      brandId: 'MB',
      productGroupId: 'VAN',
      onlineOnlyAllowed: true,
      active: true
    },
    {
      id: 3,
      serviceId: 1,
      productCategoryId: 1,
      brandId: 'MB',
      productGroupId: 'PC',
      onlineOnlyAllowed: true,
      active: true
    },
    {
      id: 4,
      serviceId: 2,
      productCategoryId: 1,
      brandId: 'SMT',
      productGroupId: 'PC',
      onlineOnlyAllowed: true,
      active: true
    },
    {
      id: 5,
      serviceId: 2,
      productCategoryId: 1,
      brandId: 'SMT',
      productGroupId: 'PC',
      onlineOnlyAllowed: true,
      active: true
    }
  ];
  const extractedBrandProductGroups: BrandProductGroup[] = [
    {
      brandId: 'MB',
      productGroupId: 'PC'
    },
    {
      brandId: 'MB',
      productGroupId: 'VAN'
    },
    {
      brandId: 'SMT',
      productGroupId: 'PC'
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

  let service: ServiceTableService;
  let serviceServiceSpy: Spy<ServiceService>;
  let serviceVariantServiceSpy: Spy<ServiceVariantService>;
  let offeredServiceServiceSpy: Spy<OfferedServiceService>;

  beforeEach(() => {
    serviceServiceSpy = createSpyFromClass(ServiceService);
    serviceServiceSpy.getAllWithServiceVariantsAndOfferedServices.nextWith(services);
    serviceVariantServiceSpy = createSpyFromClass(ServiceVariantService);
    serviceVariantServiceSpy.getAll.nextWith(serviceVariants);
    serviceVariantServiceSpy.extractUniqueBrandProductGroups.nextWith(extractedBrandProductGroups);
    offeredServiceServiceSpy = createSpyFromClass(OfferedServiceService);
    offeredServiceServiceSpy.getAll.nextWith(offeredService);
    offeredServiceServiceSpy.extractUniqueBrandProductGroups.nextWith(extractedBrandProductGroups);

    TestBed.configureTestingModule({
      providers: [
        ServiceTableService,
        {
          provide: ServiceService,
          useValue: serviceServiceSpy
        },
        {
          provide: ServiceVariantService,
          useValue: serviceVariantServiceSpy
        },
        {
          provide: OfferedServiceService,
          useValue: offeredServiceServiceSpy
        }
      ]
    });

    service = TestBed.inject(ServiceTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initServiceTableRows', () => {
    it('should show extracted serviceTableRows with services', done => {
      service.serviceTableRows.subscribe(serviceTableRows => {
        expect(serviceTableRows).toEqual(
          expect.arrayContaining([
            expect.objectContaining(serviceTableRow1),
            expect.objectContaining(serviceTableRow2),
            expect.objectContaining(serviceTableRow3)
          ])
        );
        done();
      });
    });
  });

  describe('initBrandProductGroups', () => {
    it('should return brandProductGroup map', done => {
      service.brandProductGroups.subscribe(brandProductGroup => {
        expect(brandProductGroup).toEqual({
          MB: [extractedBrandProductGroups[0], extractedBrandProductGroups[1]],
          SMT: [extractedBrandProductGroups[2]]
        });
        done();
      });
    });
  });

  describe('initPageIndex', () => {
    it('should return pageIndex from serviceService', done => {
      serviceServiceSpy.getPageIndex.nextWith(2);
      service.initPageIndex().subscribe(pageIndex => {
        expect(pageIndex).toBe(2);
        done();
      });
    });
  });
});
