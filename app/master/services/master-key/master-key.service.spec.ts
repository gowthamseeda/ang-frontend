import { TestBed } from '@angular/core/testing';
import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { TestingModule } from '../../../testing/testing.module';
import {
  getMasterKeyTypesMock,
  getNewMasterKeyTypeMock,
  getUpdateMasterKeyTypeMock
} from './master-key.mock';
import { MasterKeyService } from './master-key.service';

describe('MasterKeyTypeService', () => {
  let service: MasterKeyService;
  const keyTypeMock = getMasterKeyTypesMock();
  const newKeyTypeMock = getNewMasterKeyTypeMock();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ApiService, LoggingService, MasterKeyService]
    });
    service = TestBed.inject(MasterKeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get()', () => {
    it('should get specific keyType from the traits contract', done => {
      service.get('COFICO01').subscribe(result => {
        expect(result).toEqual(getMasterKeyTypesMock().keyTypes[0]);
        done();
      });
    });
  });

  describe('getAll()', () => {
    it('should get all keyTypes from the traits contract', done => {
      service.getAll().subscribe(keyTypes => {
        expect(keyTypes).toEqual(keyTypeMock.keyTypes);
        done();
      });
    });
  });

  describe('create()', () => {
    it('should create keyType from the traits contract', done => {
      let status = false;
      service.create(newKeyTypeMock).subscribe(() => {
        status = true;
      });
      expect(status).toBeTruthy();
      done();
    });
  });

  describe('update()', () => {
    it('should update keyType from the traits contract', done => {
      let status = false;
      service.update(getUpdateMasterKeyTypeMock()).subscribe(() => {
        status = true;
      });
      expect(status).toBeTruthy();
      done();
    });
  });

  describe('delete()', () => {
    it('should delete specific keyType from the traits contract', done => {
      let status = false;
      service.delete('COFICO02').subscribe(() => {
        status = true;
      });
      expect(status).toBeTruthy();
      done();
    });
  });
});
