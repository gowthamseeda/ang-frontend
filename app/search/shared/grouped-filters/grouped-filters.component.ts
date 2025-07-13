import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FilterGroupDefinitions } from '../../models/filter-group.model';
import { FilterOption, TypedFilterOption } from '../../models/filter-option.model';
import { FilterType } from '../../models/filter-type.model';

@Component({
  selector: 'gp-grouped-filters',
  templateUrl: './grouped-filters.component.html',
  styleUrls: ['./grouped-filters.component.scss']
})
export class GroupedFiltersComponent {
  @Input()
  filterOptions: TypedFilterOption[];
  @Output()
  filterSelect = new EventEmitter<TypedFilterOption>();

  speechBubbleOpened = false;

  emitSelectedFilter(filterOption: TypedFilterOption): void {
    this.filterSelect.emit(filterOption);
  }

  emitSelectedFilterGroup(): void {
    const filterGroup = new TypedFilterOption(
      new FilterOption({
        value: FilterGroupDefinitions.get(this.filterOptions[0].group).name,
        group: this.filterOptions[0].group
      }),
      FilterType.TAG
    );

    this.emitSelectedFilter(filterGroup);
  }

  getFilterOutput(filterOption: TypedFilterOption) {
    if (this.isBrandFilterFlag(filterOption)) {
      return 'brand';
    } else if (this.isProductGroupFlag(filterOption)) {
      return 'productGroup';
    } else {
      return 'other';
    }
  }

  isBrandFilterFlag(filterOption: TypedFilterOption): boolean {
    return FilterOption.isBrand(filterOption);
  }

  isProductGroupFlag(filterOption: TypedFilterOption): boolean {
    return FilterOption.isProductGroup(filterOption);
  }

  isSelectableFilterGroup(): boolean {
    return FilterGroupDefinitions.get(this.filterOptions[0].group).isSelectableFilter;
  }

  getFilterGroupName(): string {
    return FilterGroupDefinitions.get(this.filterOptions[0].group).name;
  }
}
