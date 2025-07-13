import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { TestingModule } from '../../testing/testing.module';
import { DealerGroup, DealerGroups } from '../models/dealer-group.model';

import { DealerGroupsService } from './dealer-groups.service';
import {
  dealerGroupsMock,
  getDealerGroupMockForCreate,
  getDealerGroupMockForUpdate
} from './model/dealer-groups.mock';

describe('DealerGroupsService', () => {
  let dealerGroupsService: DealerGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [DealerGroupsService, ApiService, LoggingService]
    });

    dealerGroupsService = TestBed.inject(DealerGroupsService);
  });

  it('should be created', () => {
    expect(dealerGroupsService).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should get all dealer groups from the structures contract', done => {
      dealerGroupsService.getAll().subscribe((dealerGroups: DealerGroups) => {
        expect(dealerGroups).toEqual(dealerGroupsMock);
        done();
      });
    });
  });

  describe('get()', () => {
    it('should get a specific dealer group from the structure contract', done => {
      dealerGroupsService.get('DG00000001').subscribe((dealerGroup: DealerGroup) => {
        expect(dealerGroup).toEqual(dealerGroupsMock.dealerGroups[0]);
        done();
      });
    });
  });

  describe('create()', () => {
    it('should create a dealer group from the structure contract', done => {
      dealerGroupsService.create(getDealerGroupMockForCreate).subscribe(response => {
        expect(response.id).toEqual(getDealerGroupMockForCreate.id);
        done();
      });
    });
  });

  describe('update()', () => {
    it('should update a dealer group from the structure contract', done => {
      dealerGroupsService.update('DG00000001', getDealerGroupMockForUpdate).subscribe(response => {
        expect(response.status).toEqual('UPDATED');
        done();
      });
    });
  });
});
