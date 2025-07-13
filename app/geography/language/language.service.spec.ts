import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { TestingModule } from '../../testing/testing.module';
import { getLanguageMock, languageMockMap } from './language.mock';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;
  const languageMock = getLanguageMock();

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
    it('should get all languages from the geography contract', done => {
      service.getAll().subscribe(languages => {
        expect(languages).toEqual(languageMock.languages);
        done();
      });
    });
  });

  describe('getAllAsMap()', () => {
    it('should get all languages as map from the geography contract', done => {
      service.getAllAsMap().subscribe(languagesMap => {
        expect(languagesMap).toEqual(languageMockMap);
        done();
      });
    });
  });

  describe('get()', () => {
    it('should get a specific language from the geography contract', done => {
      service.get('en-UK').subscribe(language => {
        expect(language).toEqual(languageMock.languages[0]);
        done();
      });
    });
  });
});
