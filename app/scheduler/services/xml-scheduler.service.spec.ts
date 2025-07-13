import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { TestingModule } from '../../testing/testing.module';

import { XmlSchedulerService } from './xml-scheduler.service';

describe('XmlSchedulerService', () => {
  let service: XmlSchedulerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ApiService, LoggingService, XmlSchedulerService]
    });
    service = TestBed.inject(XmlSchedulerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
