import { TestBed } from '@angular/core/testing';
import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { TestingModule } from '../../testing/testing.module';
import { getLanguageListMock } from './language.mock';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ApiService, LoggingService, LanguageService]
    });

    service = TestBed.inject(LanguageService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should return all languages from the tpro contract', done => {
      service.getAll().subscribe(languages => {
        expect(languages).toContainEqual(getLanguageListMock()[0]);
        done();
      });
    });
  });
});
