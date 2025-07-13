import { TestBed } from '@angular/core/testing';

import { AppStoreModule } from '../../../store/app-store.module';
import { GroupedTaskMock } from '../../grouped-task.mock';
import { GroupedTaskModule } from '../groupedTask.module';

import { GroupedTaskCollectionService } from './grouped-task-collection.service';

describe('GroupedTaskCollectionService', () => {
  let service: GroupedTaskCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AppStoreModule, GroupedTaskModule] });
    service = TestBed.inject(GroupedTaskCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('selectAll()', () => {
    it('should return grouped tasks from store', () => {
      const projection = {
        ids: Object.keys(GroupedTaskMock.asMap()),
        entities: GroupedTaskMock.asMap()
      };
      const selection = service.selectAll().projector(projection);
      expect(selection).toEqual(GroupedTaskMock.asList());
    });
  });
});
