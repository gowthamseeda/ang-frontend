import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UserService } from '../../../../iam/user/user.service';
import { SearchFilterFlag, SearchFilterTag } from '../../../../search/models/search-filter.model';
import { SearchItem } from '../../../../search/models/search-item.model';
import { SearchResultMessage } from '../../../../search/search-result/search-result.component';
import { SearchFieldInput } from '../../../../search/searchfield/searchfield-input.model';
import { SearchFieldSettings } from '../../../../search/searchfield/searchfield-settings.model';
import { OutletResult } from '../../../../search/shared/outlet-result/outlet-result.model';
import { replaceAll } from '../../../../shared/util/strings';
import { DealerGroupHeadquarterAdded } from '../../../models/dealer-group.model';

const HIGHLIGHT_MARKER = '***';

export class HeadquarterSelectionData {
  excludedHeadquarterId?: string;
}

@Component({
  selector: 'gp-dealer-group-headquarter-selection',
  templateUrl: './dealer-group-headquarter-selection.component.html',
  styleUrls: ['./dealer-group-headquarter-selection.component.scss']
})
export class DealerGroupHeadquarterSelectionComponent implements OnInit {
  searchFieldInput: SearchFieldInput;
  searchFieldSettings: SearchFieldSettings;

  dealerGroupHeadquarter?: DealerGroupHeadquarterAdded;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<DealerGroupHeadquarterSelectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HeadquarterSelectionData
  ) {}

  ngOnInit(): void {
    this.initSearchFieldInput();
    this.initSearchFieldSettings();
  }

  searchItemRetrieved(searchItem: SearchItem<OutletResult>): void {
    const payload = searchItem.payload;

    Object.keys(payload).forEach(key => {
      if (typeof payload[key] === 'string') {
        payload[key] = replaceAll(payload[key], HIGHLIGHT_MARKER, '');
      }
    });

    this.dealerGroupHeadquarter = {
      id: searchItem.id,
      legalName: payload.legalName,
      address: {
        street: payload.street,
        streetNumber: payload.streetNumber,
        city: payload.city,
        zipCode: payload.zipCode
      },
      isRegisteredOffice: payload.registeredOffice,
      countryId: payload.countryId,
      countryName: payload.countryName
    };
    this.dialogRef.close(this.dealerGroupHeadquarter);
  }

  searchItemsReset(): void {
    this.dealerGroupHeadquarter = undefined;
  }

  private initSearchFieldInput(): void {
    const defaultSearchInput = new SearchFieldInput({
      placeHolderText: 'ENTER_KEYWORDS_TO_FIND_OUTLET',
      predefinedSearchFilters: [
        new SearchFilterFlag('registeredOffice'),
        new SearchFilterFlag('active'),
        new SearchFilterTag('type=BusinessSite')
      ],
      searchResultMessage: new SearchResultMessage('OUTLET_FOUND', 'OUTLETS_FOUND')
    });

    this.userService.getCountryRestrictions().subscribe(countryRestrictions => {
      if (countryRestrictions.length !== 0) {
        defaultSearchInput.predefinedSearchFilters?.push(
          new SearchFilterTag('countryId=' + countryRestrictions.join(' '))
        );
      }
      this.searchFieldInput = defaultSearchInput;
    });
  }

  private initSearchFieldSettings(): void {
    this.searchFieldSettings = new SearchFieldSettings({
      saveSearchQuery: false,
      contextId: 'AddDealerGroupHeadquarter'
    });
  }
}
