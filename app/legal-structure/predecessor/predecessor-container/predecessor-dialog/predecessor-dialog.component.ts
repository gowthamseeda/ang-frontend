import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { SearchItem } from '../../../../search/models/search-item.model';
import { SearchFieldSettings } from '../../../../search/searchfield/searchfield-settings.model';
import { PredecessorItem } from '../../predecessor/predecessor.model';

@Component({
  selector: 'gp-predecessor-dialog',
  templateUrl: './predecessor-dialog.component.html',
  styleUrls: ['./predecessor-dialog.component.scss']
})
export class PredecessorDialogComponent implements OnInit {
  searchFieldSettings = new SearchFieldSettings({
    saveSearchQuery: false
  });

  searchFilters = [];

  constructor(public dialogRef: MatDialogRef<PredecessorDialogComponent, PredecessorItem>) {}

  ngOnInit(): void {}

  closeDialog(searchItem: SearchItem<any>): void {
    this.dialogRef.close({ businessSiteId: searchItem.id });
  }
}
