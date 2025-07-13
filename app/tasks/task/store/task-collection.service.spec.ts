import { TestBed } from '@angular/core/testing';

import { AppStoreModule } from '../../../store/app-store.module';
import { TaskMock } from '../../task.mock';
import { TaskModule } from '../task.module';

import { TaskCollectionService } from './task-collection.service';

describe('TaskCollectionService', () => {
  let service: TaskCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AppStoreModule, TaskModule] });
    service = TestBed.inject(TaskCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('selectBy()', () => {
    it('should return single task with taskId 1 from store', () => {
      const projection = TaskMock.mock;
      const selection = service.selectBy(1).projector(projection);

      const expected = TaskMock.mock[1];
      expect(selection).toEqual(expected);
    });
  });
});
