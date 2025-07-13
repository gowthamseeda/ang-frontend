import { TestBed } from '@angular/core/testing';

import { ApiService } from '../shared/services/api/api.service';
import { LoggingService } from '../shared/services/logging/logging.service';
import { TestingModule } from '../testing/testing.module';

import { FilterType } from './models/filter-type.model';
import { SearchFilter, SearchFilterTag } from './models/search-filter.model';
import {
  getAutoLangSearchItemMock,
  getSwitzerlandBusinessSiteFilterOptionMock
} from './models/search.mock';
import { SearchService } from './search.service';

describe('SearchService', () => {
  const autoLangSearchItemMock = getAutoLangSearchItemMock();
  const switzerlandBusinessSiteSearchTagMock = getSwitzerlandBusinessSiteFilterOptionMock();
  let service: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ApiService, LoggingService, SearchService]
    });

    service = TestBed.inject(SearchService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('search()', () => {
    it(' should call the GET-method of apiService', done => {
      service
        .search(
          [new SearchFilterTag('type=BusinessSite'), new SearchFilterTag('Auto Lang', 'legalName')],
          0,
          50
        )
        .subscribe(searchItemsResponse => {
          expect(searchItemsResponse.searchItems).toContainEqual(autoLangSearchItemMock);
          done();
        });
    });
  });

  describe('buildParams()', () => {
    it(' should encode the plus character (The given encoder from angular currently does not)', () => {
      const httpParams = service.buildParams(false, [
        new SearchFilter(FilterType.TAG, 'legalName', 'Test +')
      ]);
      expect(httpParams.toString()).toEqual('tags=legalName%3DTest%20%2B');
    });

    it(' should encode exactMatch tag name to exactMatch (to be used for marking exact search)', () => {
      const httpParams = service.buildParams(true, [
        new SearchFilterTag('exact match').matchExact(true)
      ]);
      expect(httpParams.toString()).toEqual('tags=exactMatch%3Dexact%20match');
    });
  });

  describe('searchTopMatches()', () => {
    it('should call the GET-method of apiService', () => {
      let topMatches;
      service.searchTopMatches([], 'switzerland').subscribe(searchTagNamesResponse => {
        topMatches = searchTagNamesResponse;
      });

      expect(topMatches).toContainEqual(switzerlandBusinessSiteSearchTagMock);
    });
  });
});
