import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../../../shared/services/api/api.service';
import { LoggingService } from '../../../../shared/services/logging/logging.service';
import { AppStoreModule } from '../../../../store/app-store.module';
import { TestingModule } from '../../../../testing/testing.module';
import {MasterLanguageGermanMock, MasterLanguageMock} from '../master-language.mock';
import { MasterLanguageModule } from '../master-language.module';

import { MasterLanguageDataService } from './master-language-data.service';
import { MasterLanguage } from '../master-language.model';

describe('MasterLanguageDataService', () => {
  const languageMock = MasterLanguageMock.asList();
  let service: MasterLanguageDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, MasterLanguageModule, AppStoreModule],
      providers: [MasterLanguageDataService, ApiService, LoggingService]
    });

    service = TestBed.inject(MasterLanguageDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should get all languages from the geography contract', done => {
      service.getAll().subscribe(language => {
        expect(language).toEqual(languageMock);
        done();
      });
    });
  });

  describe('getById()', () => {
    it('should get a specific language from the geography contract', done => {
      service.getById('en-UK').subscribe(country => {
        expect(country).toEqual(languageMock[0]);
        done();
      });
    });
  });

  describe('create()', () => {
    it('should create language from the geography contract', done => {
      const language: MasterLanguage = {
        id: 'en-DE',
        name: 'Germany',
        representation: 'Germany'
      };
      service.add(language).subscribe(result => {
        expect(result.status).toEqual('CREATED');
        done();
      });
    });
  });

  describe('update()', () => {
    it('should update language from the geography contract', done => {
      const languageMock = MasterLanguageGermanMock.asList();
      service.update(languageMock[0]).subscribe(result => {
        expect(result.status).toEqual('UPDATED');
        done();
      });
    });
  });

  describe('delete()', () => {
    it('should delete specific language from the geography contract', done => {
      service.delete('de-DE').subscribe(result => {
        expect(result.status).toEqual('DELETED');
        done();
      });
    });
  });
});
