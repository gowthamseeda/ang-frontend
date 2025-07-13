import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { SortingService } from '../../../shared/services/sorting/sorting.service';
import { AppStoreModule } from '../../../store/app-store.module';
import { TestingModule } from '../../../testing/testing.module';

import { MasterLanguageMock } from './master-language.mock';
import { MasterLanguage } from './master-language.model';
import { MasterLanguageModule } from './master-language.module';
import { MasterLanguageService } from './master-language.service';
import { MasterLanguageCollectionService } from './store/master-language-collection.service';

describe('MasterLanguageService', () => {
  const languageMock = MasterLanguageMock.asList();
  let service: MasterLanguageService;

  let sortingServiceSpy: Spy<SortingService>;
  let masterLanguageCollectionService: MasterLanguageCollectionService;

  beforeEach(() => {
    sortingServiceSpy = createSpyFromClass(SortingService);

    TestBed.configureTestingModule({
      imports: [TestingModule, MasterLanguageModule, AppStoreModule],
      providers: [
        MasterLanguageService,
        ApiService,
        LoggingService,
        MasterLanguageCollectionService,
        { provide: SortingService, useValue: sortingServiceSpy }
      ]
    });

    masterLanguageCollectionService = TestBed.inject(MasterLanguageCollectionService);

    service = TestBed.inject(MasterLanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should get all languages', done => {
      service.getAll().subscribe(result => {
        expect(result).toEqual(languageMock);
        done();
      });
    });
  });

  describe('getBy()', () => {
    it('should get language by', done => {
      const expected = languageMock[0];

      service.getBy('en-UK').subscribe(language => {
        expect(language).toEqual(expected);
        done();
      });
    });
  });

  describe('getLanguage()', () => {
    it('should get language', done => {
      const language: MasterLanguage = {
        id: 'en-UK',
        name: 'English (United Kingdom)',
        representation: 'English (United Kingdom)'
      };
      service.language = languageMock[0];

      expect(service.getLanguage()).toEqual(language);
      done();
    });
  });

  describe('create()', () => {
    it('should call MasterLanguageCollectionService.add', () => {
      const language: MasterLanguage = {
        id: 'en-DE',
        name: 'Germany',
        representation: 'Germany'
      };
      service.create(language).subscribe(result => {
        expect(result.id).toEqual(language.id);
        expect(result.name).toEqual(language.name);
        expect(result.representation).toEqual(language.representation);

        expect(masterLanguageCollectionService.add).toHaveBeenCalledWith(language);
      });
    });
  });

  describe('delete()', () => {
    it('should call MasterLanguageCollectionService.delete', () => {
      service.delete('en-UK').subscribe(() => {
        expect(masterLanguageCollectionService.delete).toHaveBeenCalled();
      });
    });
  });

  describe('update()', () => {
    it('should call MasterLanguageCollectionService.update', () => {
      const language: MasterLanguage = languageMock[0];
      language.name = 'updatedValue';

      service.update(language).subscribe(result => {
        expect(result.name).toEqual(language.name);

        expect(masterLanguageCollectionService.update).toHaveBeenCalledWith(language);
      });
    });
  });
});
