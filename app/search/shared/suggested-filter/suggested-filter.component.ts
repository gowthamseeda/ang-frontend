import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FilterGroup } from '../../models/filter-group.model';
import { TypedFilterOption } from '../../models/filter-option.model';

@Component({
  selector: 'gp-suggested-filter',
  templateUrl: './suggested-filter.component.html',
  styleUrls: ['./suggested-filter.component.scss']
})
export class SuggestedFilterComponent implements OnInit {
  @Input()
  suggestedFilters: TypedFilterOption[];
  @Input()
  isHidden: boolean;
  @Output()
  filterSelect = new EventEmitter<TypedFilterOption>();

  filterGroupsToDisplay: FilterGroup[];

  constructor() {}

  ngOnInit(): void {
    this.filterGroupsToDisplay = [
      FilterGroup.ADDRESS,
      FilterGroup.MARKET_STRUCTURE,
      FilterGroup.OUTLET,
      FilterGroup.BRAND,
      FilterGroup.KEY,
      FilterGroup.DISTRIBUTION_LEVEL,
      FilterGroup.SERVICES,
      FilterGroup.PRODUCT_GROUP,
      FilterGroup.OTHERS
    ];
  }

  getFilterOptionsBy(filterGroup: FilterGroup): TypedFilterOption[] {
    return this.suggestedFilters.filter(suggestedFilter => suggestedFilter.group === filterGroup);
  }

  emitSelectedFilter(filterOption: TypedFilterOption): void {
    this.filterSelect.emit(filterOption);
  }
}
