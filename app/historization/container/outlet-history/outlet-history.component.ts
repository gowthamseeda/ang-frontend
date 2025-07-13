import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { paramOutletId } from '../../../legal-structure/legal-structure-routing-paths';
import { OutletHistorySnapshot, SnapshotEntry } from '../../models/outlet-history-snapshot.model';
import { HistorizationService } from '../../service/historization.service';

@Component({
  selector: 'gp-outlet-history',
  templateUrl: './outlet-history.component.html',
  styleUrls: ['./outlet-history.component.scss']
})
export class OutletHistoryComponent implements OnInit, OnDestroy {
  outletId: string;
  outletHistorySnapshot: OutletHistorySnapshot;
  selectedDate: string;
  selectedSnapshotEntry?: SnapshotEntry;
  comparingSnapshotEntry?: SnapshotEntry;
  isUserCountryPermitted: boolean;

  private unsubscribe = new Subject<void>();
  displayChangesToggleEvent: boolean = false;

  hideEditorsToggleEvent: boolean = false;

  showChangeOnlyToggleEvent: boolean = false;

  hideAdditionalTranslationsToggleEvent: boolean = false;

  hideExtraInformationToggleEvent: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private historizationService: HistorizationService
  ) {}

  ngOnInit(): void {
    this.getOutletIdByRouteParams();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onDateSelected(selectedDate: string): void {
    this.selectedDate = selectedDate;
    const historySnapshotGroup = this.outletHistorySnapshot.groups;
    this.selectedSnapshotEntry = historySnapshotGroup.find(snapshot => {
      return snapshot.group === selectedDate;
    });
    if (this.selectedSnapshotEntry) {
      const currentSnapshotIndex = historySnapshotGroup.indexOf(this.selectedSnapshotEntry);
      // to find comparing snapshot
      if (currentSnapshotIndex + 1 < historySnapshotGroup.length) {
        this.comparingSnapshotEntry = historySnapshotGroup[currentSnapshotIndex + 1];
      } else {
        this.comparingSnapshotEntry = undefined;
      }
    }
  }

  private getOutletIdByRouteParams(): void {
    this.activatedRoute.paramMap
      .pipe(
        tap((params: ParamMap) => (this.outletId = params.get(paramOutletId) || '')),
        tap(() => this.getOutletHistory()),
        takeUntil(this.unsubscribe)
      )
      .subscribe();
  }

  private getOutletHistory(): void {
    this.historizationService
      .get(this.outletId)
      .pipe(
        tap(
          (outletSnapshot: OutletHistorySnapshot) => (this.outletHistorySnapshot = outletSnapshot)
        ),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        () =>
          (this.isUserCountryPermitted = this.outletHistorySnapshot.groups[0].snapshot.permitted)
      );
  }

  receivedEvent(status: boolean) {
    this.displayChangesToggleEvent = status;
  }

  receivedHideEditorsEvent(status: boolean) {
    this.hideEditorsToggleEvent = status;
  }

  receivedShowChangeOnlyEvent(status: boolean) {
    this.showChangeOnlyToggleEvent = status;
  }

  receivedHideAdditionalTranslationsEvent(status: boolean) {
    this.hideAdditionalTranslationsToggleEvent = status;
  }

  receivedHideExtraInformationEvent(status: boolean) {
    this.hideExtraInformationToggleEvent = status;
  }
}
