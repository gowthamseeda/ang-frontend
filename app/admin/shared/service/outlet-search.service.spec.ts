import { TestBed } from '@angular/core/testing';

import { OutletResult } from '../../../search/shared/outlet-result/outlet-result.model';

import { OutletSearchService } from './outlet-search.service';

describe('OutletSearchService', () => {
  const outletResultMock: OutletResult = {
    active: true,
    city: 'Berlin',
    countryId: 'DE',
    countryName: 'Germany',
    id: '***GS000***0022',
    companyId: 'GC00000001',
    legalName: 'Herbrand GmbH',
    registeredOffice: false,
    street: 'Dieselstraße',
    streetNumber: '6',
    zipCode: '47533',
    brandCodes: ['12345', '54321']
  } as OutletResult;

  describe('ServiceTableStatusService', () => {
    let service: OutletSearchService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [OutletSearchService]
      });
      service = TestBed.inject(OutletSearchService);
    });

    it('should be created', () => {
      const service: OutletSearchService = TestBed.inject(OutletSearchService);
      expect(service).toBeTruthy();
    });

    describe('convertToOutletDetails', () => {
      it('outlet id with HIGHLIGHT_MARKER is removed after convert', done => {
        const result = service.convertToOutletDetails(outletResultMock);
        expect(result.outletId).toEqual('GS0000022');
        done();
      });
    });
  });
});
