import { TestBed } from '@angular/core/testing';

import { AppStoreModule } from '../../../../store/app-store.module';
import { MasterLanguageMock } from '../master-language.mock';
import { MasterLanguageModule } from '../master-language.module';

import { MasterLanguageCollectionService } from './master-language-collection.service';

describe('MasterLanguageCollectionService', () => {
  const languageMock = MasterLanguageMock.asMap();
  let service: MasterLanguageCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppStoreModule, MasterLanguageModule]
    });
    service = TestBed.inject(MasterLanguageCollectionService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('select()', () => {
    it('should select language for a given ID', () => {
      const selection = service.select('en-UK').projector(languageMock);
      expect(selection.id).toEqual('en-UK');
    });

    it('should throw an error if no language is found for the given ID', () => {
      expect(() => service.select('MM').projector([])).toThrowError();
    });
  });
});
