import { TestBed } from '@angular/core/testing';
import { ServiceTableStatusService } from './service-table-status.service';

describe('ServiceTableStatusService', () => {
  let service: ServiceTableStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceTableStatusService]
    });
    service = TestBed.inject(ServiceTableStatusService);
  });

  it('should be created', () => {
    const service: ServiceTableStatusService = TestBed.inject(ServiceTableStatusService);
    expect(service).toBeTruthy();
  });

  describe('pristine', () => {
    it('should change pristine to false', done => {
      service.changePristineTo(false);
      service.pristine.subscribe(pristine => {
        expect(pristine).toBeFalsy();
        done();
      });
    });
  });

  describe('serviceTableSaved', () => {
    it('should change saved to false', done => {
      service.changeServiceTableSavedStatusTo(false);
      service.serviceTableSaved.subscribe(saved => {
        expect(saved).toBeFalsy();
        done();
      });
    });
  });
});
