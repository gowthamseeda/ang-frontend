import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ObservableInput } from 'ngx-observable-input';
import { Observable, Subject } from 'rxjs';
import { debounceTime, delay, takeUntil } from 'rxjs/operators';

import { OutletService } from '../../../../legal-structure/shared/services/outlet.service';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';

@Component({
  selector: 'gp-distribution-level-message',
  templateUrl: './distribution-level-message.component.html',
  styleUrls: ['./distribution-level-message.component.scss']
})
export class DistributionLevelMessageComponent implements OnInit, OnDestroy {
  @Input()
  @ObservableInput()
  businessSiteId: Observable<string>;
  @Input()
  link: string | undefined;
  @Output()
  errorOccurred = new EventEmitter<boolean>(true);

  editPageLink = '';
  private _businessSiteId = '';
  private unsubscribe = new Subject<void>();

  constructor(
    private distributionLevelsService: DistributionLevelsService,
    private outletService: OutletService
  ) {}

  ngOnInit(): void {
    this.subscribeToOutletChanges();
    this.businessSiteId.pipe(takeUntil(this.unsubscribe)).subscribe((businessSiteId: string) => {
      this._businessSiteId = businessSiteId;
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private loadData(): void {
    this.distributionLevelsService
      .get(this._businessSiteId)
      .pipe(debounceTime(100), takeUntil(this.unsubscribe))
      .subscribe((distributionLevels: string[]) => {
        const show = !distributionLevels || distributionLevels.length <= 0;
        this.editPageLink = '/outlet/' + this._businessSiteId + '/' + this.link;
        this.errorOccurred.emit(show);
      });
  }

  private subscribeToOutletChanges(): void {
    this.outletService
      .outletChanges()
      .pipe(delay(1000), takeUntil(this.unsubscribe))
      .subscribe(() => this.loadData());
  }
}
