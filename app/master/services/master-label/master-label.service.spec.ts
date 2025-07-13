import { TestBed } from '@angular/core/testing';
import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { TestingModule } from '../../../testing/testing.module';
import {
  getMasterLabelsMock,
  getMasterNewLabelMock,
  getMasterUpateLabelMock
} from './master-label.mock';
import { MasterLabelService } from './master-label.service';

describe('MasterLabelService', () => {
  let service: MasterLabelService;
  const labelMock = getMasterLabelsMock();
  const newLabelMock = getMasterNewLabelMock();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ApiService, LoggingService, MasterLabelService]
    });
    service = TestBed.inject(MasterLabelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get()', () => {
    it('should get specific label from the traits contract', done => {
      service.get('1').subscribe(result => {
        expect(result).toEqual(getMasterLabelsMock().labels[0]);
        done();
      });
    });
  });

  describe('getAll()', () => {
    it('should get all labels from the traits contract', done => {
      service.getAll().subscribe(labels => {
        expect(labels).toEqual(labelMock.labels);
        done();
      });
    });
  });

  describe('create()', () => {
    it('should create label from the traits contract', done => {
      let status = false;
      service.create(newLabelMock).subscribe(() => {
        status = true;
      });
      expect(status).toBeTruthy();
      done();
    });
  });

  describe('update()', () => {
    it('should update label from the traits contract', done => {
      let status = false;
      service.update(getMasterUpateLabelMock()).subscribe(() => {
        status = true;
      });
      expect(status).toBeTruthy();
      done();
    });
  });

  describe('delete()', () => {
    it('should delete specific label from the traits contract', done => {
      let status = false;
      service.delete(1).subscribe(() => {
        status = true;
      });
      expect(status).toBeTruthy();
      done();
    });
  });
});
