import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatChipGrid } from '@angular/material/chips';

import { FilterType } from '../../models/filter-type.model';
import { SearchFilter, SearchFilterFlag } from '../../models/search-filter.model';

@Component({
  selector: 'gp-search-filter-chip-list',
  templateUrl: './search-filter-chip-list.component.html',
  styleUrls: ['./search-filter-chip-list.component.scss']
})
export class SearchFilterChipListComponent {
  @Input()
  searchFilters: SearchFilter[] = [];
  @Output()
  searchFiltersChange: EventEmitter<SearchFilter[]> = new EventEmitter<SearchFilter[]>();

  @ViewChild(MatChipGrid, { read: MatChipGrid, static: true }) matChipList: MatChipGrid;

  constructor() {}

  removeSearchFilter(searchFilter: SearchFilter): void {
    const searchFilterIndex = this.searchFilters.indexOf(searchFilter);

    if (searchFilterIndex >= 0) {
      this.searchFilters.splice(searchFilterIndex, 1);
    }

    this.searchFiltersChange.emit(this.searchFilters);
  }

  removeNameFromSearchFilter(searchFilter: SearchFilter): void {
    if (searchFilter.type === FilterType.FLAG) {
      this.removeSearchFilter(searchFilter);
      return;
    }

    this.searchFilters = this.searchFilters.map(currentSearchFilter => {
      if (currentSearchFilter === searchFilter) {
        const { name, ...noName } = currentSearchFilter;
        return noName;
      }
      return currentSearchFilter;
    });

    this.searchFiltersChange.emit(this.searchFilters);
  }

  isSearchFilterTag(searchFilter: SearchFilter): boolean {
    return searchFilter.type === FilterType.TAG;
  }

  isSearchFilterFlag(searchFilter: SearchFilter): boolean {
    return searchFilter.type === FilterType.FLAG;
  }

  isBrandFilterFlag(searchFilter: SearchFilter): boolean {
    return this.isSearchFilterFlag(searchFilter) && SearchFilterFlag.isBrand(searchFilter);
  }

  isProductGroupFilterFlag(searchFilter: SearchFilter): boolean {
    return this.isSearchFilterFlag(searchFilter) && SearchFilterFlag.isProductGroup(searchFilter);
  }

  getFilterFlag(searchFilter: SearchFilterFlag) {
    if (this.isBrandFilterFlag(searchFilter)) {
      return 'brand';
    } else if (this.isProductGroupFilterFlag(searchFilter)) {
      return 'productGroup';
    } else {
      return 'other';
    }
  }
}
