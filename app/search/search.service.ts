import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../shared/services/api/api.service';
import { CustomEncoder } from '../shared/services/api/custom-encoder';

import { FilterOption, TypedFilterOption } from './models/filter-option.model';
import { FilterType } from './models/filter-type.model';
import { SearchFilter, SearchFilterTag } from './models/search-filter.model';
import { SearchItem } from './models/search-item.model';
import { OutletResult } from './shared/outlet-result/outlet-result.model';

const searchTagValueUrl = '/search/api/v1/tag-values';
const searchTagNameUrl = '/search/api/v1/tag-names';
const searchFlagNameUrl = '/search/api/v1/flag-names';
const searchItemUrl = '/search/api/v1/search-items';

export class SearchTagValuesResponse {
  tagValues: FilterOption[] = [];
}

export class SearchItemResponse {
  total: number;
  searchItems: SearchItem<OutletResult>[] = [];
}

class SearchTagNamesResponse {
  tagNames: FilterOption[];
}

class SearchFlagNamesResponse {
  flagNames: FilterOption[];
}

@Injectable()
export class SearchService {
  constructor(private apiService: ApiService) {}

  searchTopMatches(
    searchFilters: SearchFilter[],
    searchValue: string = ''
  ): Observable<FilterOption[]> {
    searchFilters = SearchFilter.splitSearchFilterGroups(searchFilters);
    const params = this.buildParams(true, searchFilters, searchValue, undefined, 3);

    return this.apiService
      .get<SearchTagValuesResponse>(searchTagValueUrl, params)
      .pipe(map(response => response.tagValues));
  }

  searchTagNamesFilter(
    searchFilters: SearchFilter[],
    searchValue: string = ''
  ): Observable<TypedFilterOption[]> {
    searchFilters = SearchFilter.splitSearchFilterGroups(searchFilters);
    const params = this.buildParams(false, searchFilters, searchValue);

    return this.apiService
      .get<SearchTagNamesResponse>(searchTagNameUrl, params)
      .pipe(map(response => this.convertTagsToFilter(response)));
  }

  searchFlagNamesFilter(
    searchFilters: SearchFilter[],
    searchValue?: string
  ): Observable<TypedFilterOption[]> {
    searchFilters = SearchFilter.splitSearchFilterGroups(searchFilters);
    const params = this.buildParams(false, searchFilters, searchValue);

    return this.apiService
      .get<SearchFlagNamesResponse>(searchFlagNameUrl, params)
      .pipe(map(response => this.convertFlagsToFilter(response)));
  }

  search(
    searchFilters: SearchFilter[],
    page: number,
    pageSize: number
  ): Observable<SearchItemResponse> {
    searchFilters = SearchFilter.splitSearchFilterGroups(searchFilters);
    const params = this.buildParams(true, searchFilters, undefined, page, pageSize);
    return this.apiService.get<SearchItemResponse>(searchItemUrl, params);
  }

  public buildParams(
    exactMatch: boolean,
    searchFilters: SearchFilter[],
    searchValue?: string,
    page?: number,
    pageSize?: number
  ): HttpParams {
    let params = new HttpParams({ encoder: new CustomEncoder() });

    searchFilters.forEach(searchFilter => {
      switch (searchFilter.type) {
        case FilterType.TAG:
          if (searchFilter.name) {
            params = params.append('tags', searchFilter.name + '=' + searchFilter.value);
          } else if (
            exactMatch &&
            searchFilter instanceof SearchFilterTag &&
            !searchFilter.name &&
            searchFilter.value &&
            searchFilter.exactMatch
          ) {
            params = params.append('tags', 'exactMatch=' + searchFilter.value);
          } else if (searchFilter.value) {
            params = params.append('tags', searchFilter.value);
          }
          break;
        case FilterType.FLAG:
          if (searchFilter.name) {
            params = params.append('flags', searchFilter.name);
          }
      }
    });

    if (searchValue !== undefined) {
      params = params.append('value', searchValue);
    }
    if (page !== undefined) {
      params = params.append('page', String(page));
    }
    if (pageSize !== undefined) {
      params = params.append('pageSize', String(pageSize));
    }

    return params;
  }

  private convertFlagsToFilter(response: SearchFlagNamesResponse): TypedFilterOption[] {
    const typedSearchFilter: TypedFilterOption[] = [];

    response.flagNames.forEach(searchFlagFilter => {
      typedSearchFilter.push(new TypedFilterOption(searchFlagFilter, FilterType.FLAG));
    });

    FilterOption.setGroupOf(typedSearchFilter);

    return typedSearchFilter;
  }

  private convertTagsToFilter(response: SearchTagNamesResponse): TypedFilterOption[] {
    const typedSearchFilter: TypedFilterOption[] = [];

    response.tagNames.forEach(searchTagFilter => {
      typedSearchFilter.push(new TypedFilterOption(searchTagFilter, FilterType.TAG));
    });

    FilterOption.setGroupOf(typedSearchFilter);

    return typedSearchFilter;
  }
}
