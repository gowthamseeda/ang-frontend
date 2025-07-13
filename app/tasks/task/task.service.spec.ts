import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { AppStoreModule } from '../../store/app-store.module';
import { TestingModule } from '../../testing/testing.module';
import { TaskMock } from '../task.mock';

import { TaskCollectionService } from './store/task-collection.service';
import { TaskDataService } from './store/task-data.service';
import { TaskModule } from './task.module';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let taskCollectionServiceSpy: Spy<TaskCollectionService>;
  let taskDataServiceSpy: Spy<TaskDataService>;

  beforeEach(() => {
    taskCollectionServiceSpy = createSpyFromClass(TaskCollectionService);
    taskCollectionServiceSpy.getByKey.nextWith();

    taskDataServiceSpy = createSpyFromClass(TaskDataService);

    TestBed.configureTestingModule({
      imports: [TestingModule, TaskModule, AppStoreModule],
      providers: [
        TaskService,
        ApiService,
        LoggingService,
        {
          provide: TaskCollectionService,
          useValue: taskCollectionServiceSpy
        },
        {
          provide: TaskDataService,
          useValue: taskDataServiceSpy
        }
      ]
    });
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBy()', () => {
    it('should return task with taskId 1 from the current state store', done => {
      const expected = TaskMock.forContract();
      taskCollectionServiceSpy.selectBy.mockReturnValue(() => expected);

      service.getBy(1).subscribe(task => {
        expect(task).toEqual(expected);
        done();
      });
    });
  });
});
