import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { OfferedService } from '../../offered-service/offered-service.model';
import { OfferedServiceService } from '../../offered-service/offered-service.service';
import { ValidityTableRow } from '../validity.model';

import { ValidityTableService } from './validity-table.service';

describe('ValidityTableService', () => {
  let service: ValidityTableService;
  let offeredServiceServiceSpy: Spy<OfferedServiceService>;

  beforeEach(() => {
    offeredServiceServiceSpy = createSpyFromClass(OfferedServiceService);
    offeredServiceServiceSpy.getAllForServiceWith.nextWith([]);

    TestBed.configureTestingModule({
      providers: [
        ValidityTableService,
        {
          provide: OfferedServiceService,
          useValue: offeredServiceServiceSpy
        }
      ]
    });
    service = TestBed.inject(ValidityTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initValidityTableRows()', () => {
    it('should init validity table rows with empty', done => {
      const serviceId = 1;
      const offeredServices: OfferedService[] = [
        {
          id: 'GS0000001-1',
          serviceId: 1,
          productCategoryId: 1,
          brandId: 'MB',
          productGroupId: 'PC'
        },
        {
          id: 'GS0000001-2',
          serviceId: 1,
          productCategoryId: 1,
          brandId: 'MYB',
          productGroupId: 'PC'
        }
      ];

      offeredServiceServiceSpy.getAllForServiceWith.nextWith(offeredServices);
      service.initValidityTableRows(serviceId);
      service.getValidityTableRows().subscribe((validityTableRows: ValidityTableRow[]) => {
        expect(validityTableRows.length).toEqual(1);
        expect(validityTableRows[0].application).toBeFalsy();
        expect(validityTableRows[0].applicationValidUntil).toBeFalsy();
        expect(validityTableRows[0].validFrom).toBeFalsy();
        expect(validityTableRows[0].validUntil).toBeFalsy();
        expect(validityTableRows[0].offeredServicesMap).toBeTruthy();
        expect(Object.keys(validityTableRows[0].offeredServicesMap).length).toEqual(2);
        done();
      });
    });

    it('should init validity table rows with asc validFrom validity', done => {
      const serviceId = 1;
      const offeredServices: OfferedService[] = [
        {
          id: 'GS0000001-1',
          serviceId: 1,
          productCategoryId: 1,
          brandId: 'MB',
          productGroupId: 'PC',
          validity: {
            validFrom: '2020-01-01'
          }
        },
        {
          id: 'GS0000001-2',
          serviceId: 1,
          productCategoryId: 1,
          brandId: 'MYB',
          productGroupId: 'PC',
          validity: {
            validFrom: '2019-12-31'
          }
        }
      ];
      offeredServiceServiceSpy.getAllForServiceWith.nextWith(offeredServices);
      service.initValidityTableRows(serviceId);
      service.getValidityTableRows().subscribe((validityTableRows: ValidityTableRow[]) => {
        expect(validityTableRows.length).toEqual(2);
        expect(validityTableRows[0].validFrom).toEqual('2019-12-31');
        expect(validityTableRows[1].validFrom).toEqual('2020-01-01');
        done();
      });
    });
    it('should init validity table rows and group them accordingly', done => {
      const serviceId = 1;
      const offeredServices: OfferedService[] = [
        {
          id: 'GS0000001-1',
          serviceId: 1,
          productCategoryId: 1,
          brandId: 'MB',
          productGroupId: 'PC',
          validity: {
            validFrom: '2020-01-01'
          }
        },
        {
          id: 'GS0000001-2',
          serviceId: 1,
          productCategoryId: 1,
          brandId: 'MYB',
          productGroupId: 'PC',
          validity: {
            validFrom: '2019-12-31'
          }
        },
        {
          id: 'GS0000001-3',
          serviceId: 1,
          productCategoryId: 1,
          brandId: 'MB',
          productGroupId: 'VAN',
          validity: {
            validFrom: '2020-01-01'
          }
        }
      ];
      offeredServiceServiceSpy.getAllForServiceWith.nextWith(offeredServices);
      service.initValidityTableRows(serviceId);
      service.getValidityTableRows().subscribe((validityTableRows: ValidityTableRow[]) => {
        expect(validityTableRows.length).toEqual(2);
        expect(Object.keys(validityTableRows[0].offeredServicesMap).length).toEqual(1);
        expect(Object.keys(validityTableRows[1].offeredServicesMap).length).toEqual(2);
        expect(validityTableRows[1].offeredServicesMap['GS0000001-1']).toBeTruthy();
        expect(validityTableRows[1].offeredServicesMap['GS0000001-2']).toBeFalsy();
        expect(validityTableRows[1].offeredServicesMap['GS0000001-3']).toBeTruthy();
        done();
      });
    });
  });

  describe('moveValidityDown()', () => {
    it('should create a new validity table row when none is present', done => {
      const serviceId = 1;
      const offeredServiceToMove = {
        id: 'GS0000001-1',
        serviceId: 1,
        productCategoryId: 1,
        brandId: 'MB',
        productGroupId: 'PC'
      };
      const offeredServices: OfferedService[] = [
        offeredServiceToMove,
        {
          id: 'GS0000001-2',
          serviceId: 1,
          productCategoryId: 1,
          brandId: 'MYB',
          productGroupId: 'PC'
        }
      ];
      offeredServiceServiceSpy.getAllForServiceWith.nextWith(offeredServices);
      service.initValidityTableRows(serviceId);
      service.moveValidityDown(0, offeredServiceToMove, {}, {});
      service.getValidityTableRows().subscribe((validityTableRows: ValidityTableRow[]) => {
        expect(validityTableRows.length).toEqual(2);
        expect(validityTableRows[0].offeredServicesMap['GS0000001-2']).toBeTruthy();
        expect(validityTableRows[0].offeredServicesMap['GS0000001-1']).toBeFalsy();
        expect(validityTableRows[1].offeredServicesMap['GS0000001-1']).toBeTruthy();
        expect(validityTableRows[1].offeredServicesMap['GS0000001-2']).toBeFalsy();
        done();
      });
    });

    it('should move validity in an existing one down', done => {
      const serviceId = 1;
      const offeredServiceToMove = {
        id: 'GS0000001-1',
        serviceId: 1,
        productCategoryId: 1,
        brandId: 'MB',
        productGroupId: 'PC',
        validity: {
          validFrom: '2019-12-31'
        }
      };
      const offeredServices: OfferedService[] = [
        offeredServiceToMove,
        {
          id: 'GS0000001-2',
          serviceId: 1,
          productCategoryId: 1,
          brandId: 'MYB',
          productGroupId: 'PC',
          validity: {
            validFrom: '2019-12-31'
          }
        },
        {
          id: 'GS0000001-3',
          serviceId: 1,
          productCategoryId: 1,
          brandId: 'MB',
          productGroupId: 'VAN',
          validity: {
            validFrom: '2020-01-01'
          }
        }
      ];
      offeredServiceServiceSpy.getAllForServiceWith.nextWith(offeredServices);
      service.initValidityTableRows(serviceId);
      service.moveValidityDown(
        0,
        offeredServiceToMove,
        { validFrom: '2019-12-31' },
        { validFrom: '2020-01-01' }
      );
      service.getValidityTableRows().subscribe((validityTableRows: ValidityTableRow[]) => {
        expect(validityTableRows.length).toEqual(2);
        expect(Object.keys(validityTableRows[0].offeredServicesMap).length).toEqual(1);
        expect(Object.keys(validityTableRows[1].offeredServicesMap).length).toEqual(2);
        expect(
          validityTableRows[1].offeredServicesMap[offeredServiceToMove.id].validity?.validFrom
        ).toEqual('2020-01-01');
        done();
      });
    });

    it('should move validity down and delete old validity table row if left empty', done => {
      const serviceId = 1;
      const offeredServiceToMove = {
        id: 'GS0000001-1',
        serviceId: 1,
        productCategoryId: 1,
        brandId: 'MB',
        productGroupId: 'PC',
        validity: {
          validFrom: '2019-12-31'
        }
      };
      const offeredServices: OfferedService[] = [
        offeredServiceToMove,
        {
          id: 'GS0000001-3',
          serviceId: 1,
          productCategoryId: 1,
          brandId: 'MB',
          productGroupId: 'VAN',
          validity: {
            validFrom: '2020-01-01'
          }
        }
      ];
      offeredServiceServiceSpy.getAllForServiceWith.nextWith(offeredServices);
      service.initValidityTableRows(serviceId);
      service.moveValidityDown(
        0,
        offeredServiceToMove,
        { validFrom: '2019-12-31' },
        { validFrom: '2020-01-01' }
      );
      service.getValidityTableRows().subscribe((validityTableRows: ValidityTableRow[]) => {
        expect(validityTableRows.length).toEqual(1);
        expect(Object.keys(validityTableRows[0].offeredServicesMap).length).toEqual(2);
        expect(
          validityTableRows[0].offeredServicesMap[offeredServiceToMove.id].validity?.validFrom
        ).toEqual('2020-01-01');
        done();
      });
    });
  });

  describe('moveValidityUp()', () => {
    it('should move validity in an existing one up', done => {
      const serviceId = 1;
      const offeredServiceToMove = {
        id: 'GS0000001-3',
        serviceId: 1,
        productCategoryId: 1,
        brandId: 'MB',
        productGroupId: 'VAN',
        validity: {
          validFrom: '2020-01-01'
        }
      };
      const offeredServices: OfferedService[] = [
        offeredServiceToMove,
        {
          id: 'GS0000001-2',
          serviceId: 1,
          productCategoryId: 1,
          brandId: 'MYB',
          productGroupId: 'PC',
          validity: {
            validFrom: '2020-01-01'
          }
        },
        {
          id: 'GS0000001-1',
          serviceId: 1,
          productCategoryId: 1,
          brandId: 'MB',
          productGroupId: 'PC',
          validity: {
            validFrom: '2019-12-31'
          }
        }
      ];
      offeredServiceServiceSpy.getAllForServiceWith.nextWith(offeredServices);
      service.initValidityTableRows(serviceId);
      service.moveValidityUp(
        1,
        offeredServiceToMove,
        { validFrom: '2020-01-01' },
        { validFrom: '2019-12-31' }
      );
      service.getValidityTableRows().subscribe((validityTableRows: ValidityTableRow[]) => {
        expect(validityTableRows.length).toEqual(2);
        expect(Object.keys(validityTableRows[0].offeredServicesMap).length).toEqual(2);
        expect(Object.keys(validityTableRows[1].offeredServicesMap).length).toEqual(1);
        expect(
          validityTableRows[0].offeredServicesMap[offeredServiceToMove.id].validity?.validFrom
        ).toEqual('2019-12-31');
        done();
      });
    });

    it('should move validity up and delete old validity table row if left empty', done => {
      const serviceId = 1;
      const offeredServiceToMove = {
        id: 'GS0000001-3',
        serviceId: 1,
        productCategoryId: 1,
        brandId: 'MB',
        productGroupId: 'VAN',
        validity: {
          validFrom: '2020-01-01'
        }
      };
      const offeredServices: OfferedService[] = [
        offeredServiceToMove,
        {
          id: 'GS0000001-1',
          serviceId: 1,
          productCategoryId: 1,
          brandId: 'MB',
          productGroupId: 'PC',
          validity: {
            validFrom: '2019-12-31'
          }
        }
      ];
      offeredServiceServiceSpy.getAllForServiceWith.nextWith(offeredServices);
      service.initValidityTableRows(serviceId);
      service.moveValidityUp(
        1,
        offeredServiceToMove,
        { validFrom: '2020-01-01' },
        { validFrom: '2019-12-31' }
      );
      service.getValidityTableRows().subscribe((validityTableRows: ValidityTableRow[]) => {
        expect(validityTableRows.length).toEqual(1);
        expect(Object.keys(validityTableRows[0].offeredServicesMap).length).toEqual(2);
        expect(validityTableRows[0].validFrom).toEqual('2019-12-31');
        expect(
          validityTableRows[0].offeredServicesMap[offeredServiceToMove.id].validity?.validFrom
        ).toEqual('2019-12-31');
        done();
      });
    });
  });

  describe('changeApplication()', () => {
    it('should change applicant status in first table row', done => {
      const serviceId = 1;
      const application = true;
      const indexRow = 0;
      const offeredServices: OfferedService[] = [
        {
          id: 'GS0000001-1',
          serviceId: 1,
          productCategoryId: 1,
          brandId: 'MB',
          productGroupId: 'PC'
        }
      ];
      offeredServiceServiceSpy.getAllForServiceWith.nextWith(offeredServices);
      service.initValidityTableRows(serviceId);
      service.changeApplication(indexRow, application);
      service.getValidityTableRows().subscribe((validityTableRows: ValidityTableRow[]) => {
        expect(validityTableRows[0].application).toBeTruthy();
        expect(
          validityTableRows[0].offeredServicesMap['GS0000001-1'].validity?.application
        ).toBeTruthy();
        done();
      });
    });
  });

  describe('changeValidFrom()', () => {
    it('should change validFrom in first table row', done => {
      const serviceId = 1;
      const validFrom = '2020-03-01';
      const indexRow = 0;
      const offeredServices: OfferedService[] = [
        {
          id: 'GS0000001-1',
          serviceId: 1,
          productCategoryId: 1,
          brandId: 'MB',
          productGroupId: 'PC'
        }
      ];
      offeredServiceServiceSpy.getAllForServiceWith.nextWith(offeredServices);
      service.initValidityTableRows(serviceId);
      service.changeValidFrom(indexRow, validFrom);
      service.getValidityTableRows().subscribe((validityTableRows: ValidityTableRow[]) => {
        expect(validityTableRows[0].validFrom).toEqual('2020-03-01');
        expect(validityTableRows[0].offeredServicesMap['GS0000001-1'].validity?.validFrom).toEqual(
          '2020-03-01'
        );
        done();
      });
    });
  });

  describe('changeValid()', () => {
    it('should change valid in first table row', done => {
      const serviceId = 1;
      const indexRow = 0;
      const offeredServices: OfferedService[] = [
        {
          id: 'GS0000001-1',
          serviceId: 1,
          productCategoryId: 1,
          brandId: 'MB',
          productGroupId: 'PC'
        }
      ];
      offeredServiceServiceSpy.getAllForServiceWith.nextWith(offeredServices);
      service.initValidityTableRows(serviceId);
      service.changeValid(indexRow, true);
      service.getValidityTableRows().subscribe((validityTableRows: ValidityTableRow[]) => {
        expect(validityTableRows[0].valid).toBeTruthy();
        expect(validityTableRows[0].offeredServicesMap['GS0000001-1'].validity?.valid).toBeTruthy();
        done();
      });
    });
  });
});
