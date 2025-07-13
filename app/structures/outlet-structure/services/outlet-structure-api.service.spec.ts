import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { TestingModule } from '../../../testing/testing.module';
import { getOutletStructuresMock } from '../model/outlet-structure-api.mock';

import { OutletStructureApiService } from './outlet-structure-api.service';

describe('OutletStructureApiService test suite', () => {
  let outletStructureApiService: OutletStructureApiService;
  const outletStructureMock = getOutletStructuresMock();
  const routerStub = {
    events: new BehaviorSubject<any>('')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ApiService,
        LoggingService,
        OutletStructureApiService,
        { provide: Router, useValue: routerStub }
      ]
    });
    outletStructureApiService = TestBed.inject(OutletStructureApiService);
  });

  test('should create', () => {
    expect(outletStructureApiService).toBeTruthy();
  });

  describe('get()', () => {
    test('should get a specific outlet structure from the structure contract', done => {
      outletStructureApiService.get('GS00000002').subscribe(outletStructure => {
        expect(outletStructure).toEqual(outletStructureMock);
        done();
      });
    });
  });
});
