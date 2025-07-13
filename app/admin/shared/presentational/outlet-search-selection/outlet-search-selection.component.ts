import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SearchFilterFlag, SearchFilterTag } from 'app/search/models/search-filter.model';

import { SearchItem } from '../../../../search/models/search-item.model';
import { SearchResultMessage } from '../../../../search/search-result/search-result.component';
import { SearchFieldInput } from '../../../../search/searchfield/searchfield-input.model';
import { SearchFieldSettings } from '../../../../search/searchfield/searchfield-settings.model';
import { OutletResult } from '../../../../search/shared/outlet-result/outlet-result.model';
import { OutletStatus } from '../../models/outlet.model';
import { OutletSearchService } from '../../service/outlet-search.service';

export class OutletSelectionData {
  outlets: OutletStatus;
  previousTitle: string;
  currentTitle: string;
  currentSearchFilter: (SearchFilterTag | SearchFilterFlag)[];
  previousSearchFilter: (SearchFilterTag | SearchFilterFlag)[];
}

@Component({
  selector: 'gp-outlet-search-selection',
  templateUrl: './outlet-search-selection.component.html',
  styleUrls: ['./outlet-search-selection.component.scss']
})
export class OutletSearchSelectionComponent implements OnInit {
  outletType: OutletStatus;
  excludedOutletIds: string[];
  title: string;
  searchFieldInput: SearchFieldInput;
  searchFieldSettings: SearchFieldSettings;

  constructor(
    public dialogRef: MatDialogRef<OutletSearchSelectionComponent>,
    public outletSearchService: OutletSearchService,
    @Inject(MAT_DIALOG_DATA) public data: OutletSelectionData
  ) {}

  ngOnInit(): void {
    this.outletType = this.data.outlets;

    this.initTitle();
    this.initSearchFieldInput();
    this.initSearchFieldSettings();
    this.filterExcludedOutletIds();
  }

  searchItemRetrieved(searchItem: SearchItem<OutletResult>): void {
    if (this.outletType.isAddPreviousSelected) {
      this.outletType.previous = this.outletSearchService.convertToOutletDetails(
        searchItem.payload
      );
    }
    if (this.outletType.isAddCurrentSelected) {
      this.outletType.current = this.outletSearchService.convertToOutletDetails(searchItem.payload);
    }

    this.close();
  }

  filterExcludedOutletIds(): void {
    const excludedOutlets = [
      this.outletType.current?.outletId ?? null,
      this.outletType.previous?.outletId ?? null
    ];

    this.excludedOutletIds = excludedOutlets.filter(outletId => outletId != null) as string[];
  }

  initTitle(): void {
    this.title = this.outletType.isAddCurrentSelected
      ? this.data.currentTitle
      : this.data.previousTitle;
  }

  initSearchFieldInput(): void {
    const filterSetting = this.outletType.isAddPreviousSelected
      ? this.data.previousSearchFilter
      : this.data.currentSearchFilter;

    this.searchFieldInput = new SearchFieldInput({
      placeHolderText: 'ENTER_KEYWORDS_TO_FIND_OUTLET',
      predefinedSearchFilters: filterSetting,
      searchResultMessage: new SearchResultMessage('OUTLET_FOUND', 'OUTLETS_FOUND')
    });
  }

  initSearchFieldSettings(): void {
    this.searchFieldSettings = new SearchFieldSettings({
      saveSearchQuery: false
    });
  }

  close(): void {
    this.dialogRef.close(this.outletType);
  }
}
