import {TestBed} from '@angular/core/testing';
import {ApiService} from '../../../shared/services/api/api.service';
import {LoggingService} from '../../../shared/services/logging/logging.service';
import {TestingModule} from '../../../testing/testing.module';
import {
  getMasterOutletRelationshipMock,
  getNewMasterOutletRelationshipMock,
  getUpdateMasterOutletRelationshipMock
} from "./master-outlet-relationship.mock";
import {MasterOutletRelationshipService} from "./master-outlet-relationship.service";

describe('MasterOutletRelationshipService', () => {
  let service: MasterOutletRelationshipService;
  const outletRelationshipMock = getMasterOutletRelationshipMock();
  const newOutletRelationshipMock = getNewMasterOutletRelationshipMock();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ApiService, LoggingService, MasterOutletRelationshipService]
    });
    service = TestBed.inject(MasterOutletRelationshipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('create()', () => {
    it('should create outlet relationship from the traits contract', done => {
      let status = false;
      service.create(newOutletRelationshipMock).subscribe(() => {
        status = true;
      });
      expect(status).toBeTruthy();
      done();
    });
  });

  describe('get()', () => {
    it('should get specific outlet relationship from the traits contract', done => {
      service.get('is_Branch_of').subscribe(result => {
        expect(result).toEqual(outletRelationshipMock.outletRelationships[0]);
        done();
      });
    });
  });

  describe('getAll()', () => {
    it('should get all outlet relationship from the traits contract', done => {
      service.getAll().subscribe(result => {
        expect(result).toEqual(outletRelationshipMock.outletRelationships);
        done();
      });
    });
  });

  describe('update()', () => {
    it('should update outlet relationship from the traits contract', done => {
      let status = false;
      service.update(getUpdateMasterOutletRelationshipMock()).subscribe(() => {
        status = true;
      });
      expect(status).toBeTruthy();
      done();
    });
  });

  describe('delete()', () => {
    it('should delete outlet relationship from the traits contract', done => {
      let status = false;
      service.delete('is_Branch_of').subscribe(() => {
        status = true;
      });
      expect(status).toBeTruthy();
      done();
    });
  });
});
