import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { TestingModule } from '../../testing/testing.module';
import { AuditLogCleanSchedulerService } from './audit-log-clean-scheduler.service';


describe('AuditLogCleanSchedulerService', () => {
  let service: AuditLogCleanSchedulerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ApiService, LoggingService, AuditLogCleanSchedulerService]
    });
    service = TestBed.inject(AuditLogCleanSchedulerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
