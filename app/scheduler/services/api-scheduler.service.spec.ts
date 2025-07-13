import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { TestingModule } from '../../testing/testing.module';

import { ApiSchedulerService } from './api-scheduler.service';

describe('ApiSchedulerService', () => {
  let service: ApiSchedulerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ApiService, LoggingService, ApiSchedulerService]
    });
    service = TestBed.inject(ApiSchedulerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
