import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import {
  SearchFilter,
  SearchFilterFlag,
  SearchFilterTag
} from '../../../search/models/search-filter.model';
import { SearchItem } from '../../../search/models/search-item.model';
import { SearchFieldSettings } from '../../../search/searchfield/searchfield-settings.model';
import { Address } from '../../model/address.model';
import { BusinessSite } from '../../model/business-site.model';

const defaultSearchFilters: SearchFilter[] = [
  new SearchFilterFlag('registeredOffice'),
  new SearchFilterFlag('activeOrInPlanning'),
  new SearchFilterTag('type=BusinessSite')
];

@Component({
  selector: 'gp-contract-partner-search',
  templateUrl: './contract-partner-search.component.html',
  styleUrls: ['./contract-partner-search.component.scss']
})
export class ContractPartnerSearchComponent implements OnInit, OnChanges {
  @Input() contractPartner?: BusinessSite & Address;
  @Input() countryRestrictions: string[];
  @Input() readOnly = false;
  @Input() contextId: string;
  @Output() contractPartnerIdSelect = new EventEmitter<string>();
  @Output() contractPartnerDelete = new EventEmitter<string>();
  @Output() contractPartnerNavigate = new EventEmitter<string>();

  searchFieldSettings: SearchFieldSettings;
  searchFilters: SearchFilter[];

  constructor() {}

  ngOnInit(): void {
    this.initSearchFieldSettings();
  }

  ngOnChanges(): void {
    this.initSearchFilter();
  }

  get contractPartnerTooltip(): string {
    return this.contractPartner?.legalName ? this.contractPartner.legalName : '';
  }

  getSearchFieldSettings(): SearchFieldSettings {
    this.searchFieldSettings.contextId = this.contextId;
    return this.searchFieldSettings;
  }

  emitSelectedContractPartnerId(searchItem: SearchItem<any>): void {
    this.contractPartnerIdSelect.emit(searchItem.id);
  }

  emitDeletedContractPartner(contractPartnerId: string): void {
    this.contractPartner = undefined;
    this.contractPartnerDelete.emit(contractPartnerId);
  }

  emitNavigateToContractPartner(contractPartnerId: string): void {
    this.contractPartnerNavigate.emit(contractPartnerId);
  }

  private initSearchFieldSettings(): void {
    this.searchFieldSettings = new SearchFieldSettings({
      contextId: 'ContractPartnerSearch'
    });
  }

  private initSearchFilter(): void {
    if (!this.countryRestrictions) {
      return;
    }

    if (this.countryRestrictions.length === 0) {
      this.searchFilters = defaultSearchFilters;
    } else {
      this.searchFilters = [
        ...defaultSearchFilters,
        ...[new SearchFilterTag('countryId=' + this.countryRestrictions.join(' '))]
      ];
    }
  }
}
