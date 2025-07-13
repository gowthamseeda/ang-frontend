import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { TestingModule } from '../../testing/testing.module';

import { HistorizationService } from './historization.service';

describe('HistorizationService', () => {
  let service: HistorizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [HistorizationService, ApiService, LoggingService]
    });
    service = TestBed.inject(HistorizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
