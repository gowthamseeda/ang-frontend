import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SearchFilterFlag, SearchFilterTag } from '../../../../search/models/search-filter.model';
import { SearchItem } from '../../../../search/models/search-item.model';
import { SearchResultMessage } from '../../../../search/search-result/search-result.component';
import { SearchFieldInput } from '../../../../search/searchfield/searchfield-input.model';
import { SearchFieldSettings } from '../../../../search/searchfield/searchfield-settings.model';
import { OutletResult } from '../../../../search/shared/outlet-result/outlet-result.model';
import { replaceAll } from '../../../../shared/util/strings';
import { StructuresMember } from '../../models/shared.model';

const HIGHLIGHT_MARKER = '***';

export class MembersSelectionData {
  countryName: string;
  excludedMembers: string[];
}

@Component({
  selector: 'gp-members-selection',
  templateUrl: './members-selection.component.html',
  styleUrls: ['./members-selection.component.scss']
})
export class MembersSelectionComponent implements OnInit {
  searchFieldInput: SearchFieldInput;
  searchFieldSettings: SearchFieldSettings;

  members: StructuresMember[] = [];

  constructor(
    public dialogRef: MatDialogRef<MembersSelectionComponent>,
    private changeDetector: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: MembersSelectionData
  ) {}

  ngOnInit(): void {
    this.initSearchFieldInput();
    this.initSearchFieldSettings();
  }

  searchItemsRetrieved(searchItems: SearchItem<OutletResult>[]): void {
    const members: StructuresMember[] = [];

    searchItems.forEach(searchItem => {
      members.push(this.convertToMember(searchItem.payload));
    });

    this.members = members;
    this.changeDetector.detectChanges();
  }

  convertToMember(payload: OutletResult): StructuresMember {
    Object.keys(payload).forEach(key => {
      if (typeof payload[key] === 'string') {
        payload[key] = replaceAll(payload[key], HIGHLIGHT_MARKER, '');
      }
    });

    return {
      id: payload.id,
      companyId: payload.companyId,
      legalName: payload.legalName,
      address: {
        street: payload.street,
        streetNumber: payload.streetNumber,
        zipCode: payload.zipCode,
        city: payload.city
      },
      isRegisteredOffice: payload.registeredOffice,
      country: {
        id: payload.countryId,
        name: payload.countryName
      },
      active: payload.active,
      brandCodes: payload.brandCodes.map(brandCode => ({ brandId: '', brandCode })),
    };
  }

  searchItemsReset(): void {
    this.members = [];
  }

  private initSearchFieldInput(): void {
    this.searchFieldInput = new SearchFieldInput({
      placeHolderText: 'ENTER_KEYWORDS_TO_FIND_OUTLET',
      predefinedSearchFilters: [
        new SearchFilterFlag('activeOrInPlanning'),
        new SearchFilterTag('type=BusinessSite')
      ],
      searchResultMessage: new SearchResultMessage('OUTLET_FOUND', 'OUTLETS_FOUND')
    });
  }

  private initSearchFieldSettings(): void {
    this.searchFieldSettings = new SearchFieldSettings({
      searchResultItemClickAction: 'multiselect',
      saveSearchQuery: false,
      contextId: 'AddMember'
    });
  }
}
