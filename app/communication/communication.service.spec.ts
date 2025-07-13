import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { BehaviorSubject, of } from 'rxjs';

import { LegalStructureRoutingService } from '../legal-structure/legal-structure-routing.service';
import { OfferedServiceService } from '../services/offered-service/offered-service.service';
import { ApiService } from '../shared/services/api/api.service';
import { LoggingService } from '../shared/services/logging/logging.service';
import { TestingModule } from '../testing/testing.module';

import { CommunicationService } from './communication.service';
import {
  generalCommunicationDataMock,
  putMultiCommunicationDataMock
} from './model/communication-data.mock';
import { communicationFieldMock } from './model/communication-field.mock';
import { offeredServiceMock } from './model/offered-service.mock';

class LegalStructureRoutingServiceStub {
  outletIdChanges = new BehaviorSubject<string>('');
}

describe('CommunicationService contract test suite', () => {
  const legalStructureRoutingServiceStub = new LegalStructureRoutingServiceStub();
  let service: CommunicationService;
  let offeredServiceServiceSpy: Spy<OfferedServiceService>;

  beforeEach(() => {
    offeredServiceServiceSpy = createSpyFromClass(OfferedServiceService);
    offeredServiceServiceSpy.fetchAllForOutlet.mockReturnValue([
      offeredServiceMock[0],
      offeredServiceMock[1]
    ]);
    offeredServiceServiceSpy.getAll.mockReturnValue(
      of([offeredServiceMock[0], offeredServiceMock[1]])
    );

    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ApiService,
        LoggingService,
        CommunicationService,
        { provide: LegalStructureRoutingService, useValue: legalStructureRoutingServiceStub },
        { provide: OfferedServiceService, useValue: offeredServiceServiceSpy }
      ]
    });

    service = TestBed.inject(CommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCommunicationData', () => {
    beforeEach(() => {
      legalStructureRoutingServiceStub.outletIdChanges.next('GS00000001');
    });

    it('should get communication data from the communications contract', done => {
      service.getServiceCommunicationDataOfOutlet().subscribe(communicationData => {
        expect(communicationData).toEqual([
          {
            offeredServiceId: 'GS00000001-1',
            communicationFieldId: 'URL',
            value: 'http://foo.bar'
          },
          {
            offeredServiceId: 'GS00000001-2',
            communicationFieldId: 'TEL',
            value: '4711'
          }
        ]);
        done();
      });
    });
  });

  describe('getCommunicationFields', () => {
    beforeEach(() => {
      legalStructureRoutingServiceStub.outletIdChanges.next('GS00000001');
    });

    it('should get communication fields from the communications contract', done => {
      service.getCommunicationFields().subscribe(communicationFields => {
        expect(communicationFields).toEqual([communicationFieldMock[0]]);
        done();
      });
    });
  });

  describe('getOfferedServicesOfOutlet', () => {
    beforeEach(() => {
      legalStructureRoutingServiceStub.outletIdChanges.next('GS00000001');
    });

    it('should get offered services of Outlet from the communications contract', done => {
      service.getOfferedServicesOfOutlet().subscribe(offeredServices => {
        expect(offeredServices).toEqual([offeredServiceMock[0], offeredServiceMock[1]]);
        done();
      });
    });
  });

  describe('getGeneralCommunicationDataOfOutlet', () => {
    beforeEach(() => {
      legalStructureRoutingServiceStub.outletIdChanges.next('GS00000001');
    });

    it('should get general communication data of outlet from the communications contract', done => {
      service.getGeneralCommunicationDataOfOutlet().subscribe(communicationData => {
        expect(communicationData).toEqual([generalCommunicationDataMock[0]]);
        done();
      });
    });
  });

  describe('getSpokenLanguageIdsOfOutlet', () => {
    beforeEach(() => {
      legalStructureRoutingServiceStub.outletIdChanges.next('GS00000016');
    });

    it('should get spoken language data of outlet', done => {
      service.getSpokenLanguageIdsOfOutlet().subscribe(communicationData => {
        expect(communicationData).toEqual(['de']);
        done();
      });
    });
  });

  describe('updateServiceCommunicationDataOf', () => {
    beforeEach(() => {
      legalStructureRoutingServiceStub.outletIdChanges.next('GS00000001');
    });

    it('should return success modified offered service', done => {
      service.updateServiceCommunicationData(putMultiCommunicationDataMock).subscribe(result => {
        expect(result.success.length).toEqual(2);
        expect(result.success[0].offeredServiceId).toEqual('GS00000001-1');
        expect(result.success[0].communicationFieldId).toEqual('URL');
        expect(result.success[1].offeredServiceId).toEqual('GS00000001-2');
        expect(result.success[1].communicationFieldId).toEqual('TEL');
        expect(result.fail.length).toEqual(0);
        done();
      });
    });
  });

  describe('updateServiceCommunicationDataOf', () => {
    beforeEach(() => {
      legalStructureRoutingServiceStub.outletIdChanges.next('GS66600124');
    });
    it('should return success and failed offered service', done => {
      service
        .updateServiceCommunicationData([
          putMultiCommunicationDataMock[0],
          {
            offeredServiceId: 'GS66600666-2',
            communicationFieldId: 'TEL',
            value: '0815'
          }
        ])
        .subscribe(result => {
          expect(result.success.length).toEqual(1);
          expect(result.success[0].offeredServiceId).toEqual('GS66600124-1');
          expect(result.success[0].communicationFieldId).toEqual('URL');
          expect(result.fail.length).toEqual(1);
          expect(result.fail[0].offeredServiceId).toEqual('GS66600666-2');
          expect(result.fail[0].communicationFieldId).toEqual('TEL');
          done();
        });
    });
  });

  describe('updateServiceCommunicationDataOf', () => {
    beforeEach(() => {
      legalStructureRoutingServiceStub.outletIdChanges.next('DOESNOTEXIST');
    });

    it('should return 404 when business site not found', done => {
      service.updateServiceCommunicationData(putMultiCommunicationDataMock).subscribe(result => {
        expect(result).toEqual(null);
        done();
      });
    });
  });
});
