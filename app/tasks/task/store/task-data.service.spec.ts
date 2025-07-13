import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { AppStoreModule } from '../../../store/app-store.module';
import { TestingModule } from '../../../testing/testing.module';

import { TaskDataService } from './task-data.service';

describe('TaskDataService', () => {
  let service: TaskDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, AppStoreModule],
      providers: [TaskDataService, ApiService, LoggingService]
    });
    service = TestBed.inject(TaskDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
