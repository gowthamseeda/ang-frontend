import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { AppStoreModule } from '../../store/app-store.module';
import { TestingModule } from '../../testing/testing.module';
import { GroupedTaskMock } from '../grouped-task.mock';

import { GroupedTaskModule } from './groupedTask.module';
import { GroupedTaskService } from './groupedTask.service';
import { GroupedTaskCollectionService } from './store/grouped-task-collection.service';

describe('TaskService', () => {
  let service: GroupedTaskService;
  let groupedTaskCollectionServiceSpy: Spy<GroupedTaskCollectionService>;

  beforeEach(() => {
    groupedTaskCollectionServiceSpy = createSpyFromClass(GroupedTaskCollectionService);

    TestBed.configureTestingModule({
      imports: [TestingModule, GroupedTaskModule, AppStoreModule],
      providers: [
        ApiService,
        LoggingService,
        {
          provide: GroupedTaskCollectionService,
          useValue: groupedTaskCollectionServiceSpy
        }
      ]
    });
    service = TestBed.inject(GroupedTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllGroupedTasks()', () => {
    it('should return all grouped tasks from the current state store', done => {
      const expected = GroupedTaskMock.asList();
      groupedTaskCollectionServiceSpy.selectAll.mockReturnValue(() => expected);

      service.getAllGroupedTasks().subscribe(groupedTasks => {
        expect(groupedTasks).toEqual(expected);
        done();
      });
    });
  });
});
