import { Injectable } from '@angular/core';
import { Angulartics2 } from 'angulartics2';

export class SearchProperties {
  keyword: string;
  category: string | boolean;
  searchCount: number | boolean;

  constructor(
    keyword: string,
    category: string | boolean = false,
    searchCount: number | boolean = false
  ) {
    this.keyword = keyword;
    this.category = category;
    this.searchCount = searchCount;
  }
}

@Injectable()
export class MatomoEventTracker {
  constructor(private angulartics2: Angulartics2) {}

  trackSiteSearch(searchProperties: SearchProperties): void {
    this.angulartics2.eventTrack.next({
      action: 'trackSiteSearch',
      properties: {
        keyword: searchProperties.keyword,
        category: searchProperties.category,
        searchCount: searchProperties.searchCount
      }
    });
  }
}
