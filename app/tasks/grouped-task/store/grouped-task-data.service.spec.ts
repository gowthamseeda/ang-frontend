import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { AppStoreModule } from '../../../store/app-store.module';
import { TestingModule } from '../../../testing/testing.module';
import { GroupedTaskMock } from '../../grouped-task.mock';

import { GroupedTaskDataService } from './grouped-task-data.service';

describe('GroupedTaskDataService', () => {
  let service: GroupedTaskDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, AppStoreModule],
      providers: [GroupedTaskDataService, ApiService, LoggingService]
    });
    service = TestBed.inject(GroupedTaskDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should return tasks from contracts', done => {
      const expected = GroupedTaskMock.forContracts();
      service.getAll().subscribe(groupedTasks => {
        expect(groupedTasks).toEqual(expected);
        done();
      });
    });
  });
});
