import { TestBed } from '@angular/core/testing';

import { ContractsDataService, UpdateContract } from './contracts.data-service';
import { ApiService } from '../shared/services/api/api.service';
import { TestingModule } from '../testing/testing.module';
import { LoggingService } from '../shared/services/logging/logging.service';
import { contractMock } from './model/contract.mock';
import { offeredServiceMock } from './model/offered-service.mock';
import { outletMock } from './model/outlet.mock';
import ObjectContaining = jasmine.ObjectContaining;

describe('ContractsDataService', () => {
  let service: ContractsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ApiService, LoggingService, ContractsDataService]
    });

    service = TestBed.inject(ContractsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should get contracts of a contractor from the contracts contract', done => {
      service.get(contractMock[0].contractor.id).subscribe(contracts => {
        const objectsContaining: ObjectContaining[] = [];
        contractMock.forEach(contract => {
          objectsContaining.push(
            jasmine.objectContaining({ contractor: jasmine.objectContaining(contract.contractor) })
          );
          objectsContaining.push(
            jasmine.objectContaining({ contractee: jasmine.objectContaining(contract.contractee) })
          );
          objectsContaining.push(
            jasmine.objectContaining({
              offeredService: jasmine.objectContaining(contract.offeredService)
            })
          );
        });
        expect(contracts).toEqual(jasmine.arrayContaining(objectsContaining));
        done();
      });
    });
  });

  describe('update', () => {
    it('should update contracts of a contractor from the contracts contract', done => {
      let updated = false;
      const contractsToUpdate: UpdateContract[] = [
        {
          offeredServiceId: 'GS20000001-1',
          contracteeId: 'GS30000001'
        }
      ];
      service.update('GS20000001', contractsToUpdate).subscribe(() => {
        updated = true;
        done();
      });
      expect(updated).toBeTruthy();
    });
  });

  describe('getOfferedServices', () => {
    it('should get offered services of a contractor from the contracts contract', done => {
      service.getOfferedServices(contractMock[0].contractor.id).subscribe(offeredServices => {
        const expected = jasmine.arrayContaining(
          offeredServiceMock.map(offeredService => jasmine.objectContaining(offeredService))
        );
        expect(offeredServices).toEqual(expected);
        done();
      });
    });
  });

  describe('getContractor', () => {
    it('should get a contractor for a given outlet ID from the contracts contract', done => {
      service.getContractor(contractMock[0].contractor.id).subscribe(contractor => {
        expect(contractor).toEqual(contractMock[0].contractor);
        done();
      });
    });
  });

  describe('getContractee', () => {
    it('should get a contractee for a given outlet ID from the contracts contract', done => {
      service.getContractee(outletMock.outletId).subscribe(contractee => {
        const expected = {
          id: outletMock.outletId,
          legalName: outletMock.legalName,
          street: outletMock.street,
          streetNumber: outletMock.streetNumber,
          zipCode: outletMock.zipCode,
          city: outletMock.city,
          country: outletMock.country
        };
        expect(contractee).toEqual(expected);
        done();
      });
    });
  });
});
