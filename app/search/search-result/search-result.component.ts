import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LegalStructureRoutingService } from '../../legal-structure/legal-structure-routing.service';
import { SearchFilter } from '../models/search-filter.model';
import { SearchItem } from '../models/search-item.model';
import { OutletResult } from '../shared/outlet-result/outlet-result.model';

export class SearchResultMessage {
  singular: string;
  plural: string;

  constructor(singular: string, plural: string) {
    this.singular = singular;
    this.plural = plural;
  }
}

@Component({
  selector: 'gp-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit, OnDestroy {
  @Input()
  searchItems: Observable<SearchItem<OutletResult>[]>;
  @Input()
  checkedSearchItems: SearchItem<OutletResult>[];
  @Input()
  total: number;
  @Input()
  searchFilters: SearchFilter[];
  @Input()
  disabledRouting: boolean;
  @Input()
  searchResultMessage: SearchResultMessage;
  @Input()
  error: Error;
  @Input()
  isMultiSelect = false;
  @Output()
  searchItemsClicked = new EventEmitter<SearchItem<OutletResult>[] | SearchItem<OutletResult>>();

  selectedOutletId: string | null;
  selectedSearchItems: SearchItem<OutletResult>[] = [];
  searchItemsWithCheckedStatus: { checked: boolean; searchItem: SearchItem<OutletResult> }[];

  private unsubscribe = new Subject<void>();

  constructor(
    private legalStructureRoutingService: LegalStructureRoutingService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.legalStructureRoutingService.outletIdChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(outletId => (this.selectedOutletId = outletId));

    this.searchItems.pipe(takeUntil(this.unsubscribe)).subscribe(items => {
      this.searchItemsWithCheckedStatus = items.map(item => {
        return {
          checked: this.checkedSearchItems.map(checkedItem => checkedItem.id).includes(item.id),
          searchItem: item
        };
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSearchItemClick(searchItem: SearchItem<any>): void {
    if (!this.isMultiSelect) {
      this.searchItemsClicked.emit(searchItem);
      return;
    }

    const selectedSearchItem = this.searchItemsWithCheckedStatus.find(
      element => element.searchItem.id === searchItem.id
    );
    if (selectedSearchItem) {
      selectedSearchItem.checked = !selectedSearchItem.checked;

      if (selectedSearchItem.checked) {
        this.selectedSearchItems.push(selectedSearchItem.searchItem);
      } else {
        this.selectedSearchItems = this.selectedSearchItems.filter(
          item => item.id !== selectedSearchItem.searchItem.id
        );
      }
      this.searchItemsClicked.emit(this.selectedSearchItems);

      this.changeDetector.detectChanges();
    }
  }
}
