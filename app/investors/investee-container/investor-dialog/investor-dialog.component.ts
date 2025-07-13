import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Investment } from 'app/investors/investee/investee.model';
import { SearchFilterFlag, SearchFilterTag } from 'app/search/models/search-filter.model';
import { SearchItem } from 'app/search/models/search-item.model';
import { SearchFieldSettings } from 'app/search/searchfield/searchfield-settings.model';

@Component({
  selector: 'gp-investor-dialog',
  templateUrl: './investor-dialog.component.html',
  styleUrls: ['./investor-dialog.component.scss']
})
export class InvestorDialogComponent implements OnInit {
  searchFieldSettings = new SearchFieldSettings({
    saveSearchQuery: false
  });

  searchFilters = [
    new SearchFilterFlag('registeredOffice'),
    new SearchFilterTag('type=BusinessSite')
  ];

  constructor(public dialogRef: MatDialogRef<InvestorDialogComponent, Investment>) {}

  ngOnInit(): void {}

  closeDialog(searchItem: SearchItem<any>): void {
    this.dialogRef.close({ investorId: searchItem.id });
  }
}
