import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SearchFilterTag } from '../../../../search/models/search-filter.model';
import { SearchItem } from '../../../../search/models/search-item.model';
import { SearchResultMessage } from '../../../../search/search-result/search-result.component';
import { SearchFieldInput } from '../../../../search/searchfield/searchfield-input.model';
import { SearchFieldSettings } from '../../../../search/searchfield/searchfield-settings.model';
import { OutletResult } from '../../../../search/shared/outlet-result/outlet-result.model';

@Component({
  selector: 'gp-outlet-selection',
  templateUrl: './outlet-selection.component.html',
  styleUrls: ['./outlet-selection.component.scss']
})
export class OutletSelectionComponent implements OnInit {
  searchFieldInput: SearchFieldInput;
  searchFieldSettings: SearchFieldSettings;

  constructor(
    public dialogRef: MatDialogRef<OutletSelectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { excludedOutletIds: string[] }
  ) {}

  ngOnInit(): void {
    this.initSearchFieldInput();
    this.initSearchFieldSettings();
  }

  searchItemRetrieved(searchItem: SearchItem<OutletResult>): void {
    this.dialogRef.close(searchItem.id);
  }

  private initSearchFieldInput(): void {
    this.searchFieldInput = new SearchFieldInput({
      placeHolderText: 'ENTER_KEYWORDS_TO_FIND_OUTLET',
      predefinedSearchFilters: [new SearchFilterTag('type=BusinessSite')],
      searchResultMessage: new SearchResultMessage('OUTLET_FOUND', 'OUTLETS_FOUND')
    });
  }

  private initSearchFieldSettings(): void {
    this.searchFieldSettings = new SearchFieldSettings({
      searchResultItemClickAction: 'singleselect',
      saveSearchQuery: false,
      contextId: 'AddOutletRelationship'
    });
  }
}
