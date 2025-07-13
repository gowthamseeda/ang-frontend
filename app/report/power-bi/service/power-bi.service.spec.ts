import { TestBed } from '@angular/core/testing';

import { PowerBiService } from './power-bi.service';
import { ApiService } from '../../../shared/services/api/api.service';
import { TestingModule } from '../../../testing/testing.module';
import { LoggingService } from '../../../shared/services/logging/logging.service';

describe('PowerBiService', () => {
  let service: PowerBiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers:[ApiService, LoggingService]
    });
    service = TestBed.inject(PowerBiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
