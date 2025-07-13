import {
  ArrayDataSource,
  CollectionViewer,
  isDataSource,
  ListRange
} from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  CdkHeaderRowDef,
  CdkTable,
  DataSource,
  STICKY_POSITIONING_LISTENER,
  _CoalescedStyleScheduler,
  _COALESCED_STYLE_SCHEDULER
} from '@angular/cdk/table';
import {
  ContentChildren,
  Directive,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  QueryList
} from '@angular/core';
import { isObservable, Observable, of, Subject } from 'rxjs';
import { map, pairwise, shareReplay, startWith, switchMap, takeUntil } from 'rxjs/operators';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'mat-table [virtualDataSource]',
  providers: [{ provide: STICKY_POSITIONING_LISTENER, useExisting: VirtualTableDirective }]
})
export class VirtualTableDirective<T> implements CollectionViewer, OnInit, OnDestroy {
  @ContentChildren(CdkHeaderRowDef) headerRowDefs: QueryList<CdkHeaderRowDef>;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('virtualDataSource')
  set dataSource(value: DataSource<T> | Observable<T[]> | null) {
    this._dataSource = value;
    if (isDataSource(value)) {
      this.dataSourceChanges.next(value);
    } else {
      this.dataSourceChanges.next(
        new ArrayDataSource<T>(isObservable(value) ? value : Array.from(value || []))
      );
    }
  }
  get dataSource(): DataSource<T> | Observable<T[]> | null {
    return this._dataSource;
  }

  viewChange = new Subject<ListRange>();
  dataSourceChanges = new Subject<DataSource<T>>();
  dataStream: Observable<T[] | ReadonlyArray<T>> = this.dataSourceChanges.pipe(
    startWith(null),
    pairwise(),
    switchMap(([previous, current]) => this.changeDataSource(previous, current)),
    shareReplay(1)
  );

  private _dataSource: DataSource<T> | Observable<T[]> | null;
  private virtualizedDataStream = new Subject<T[] | ReadonlyArray<T>>();
  private data: T[] | readonly T[];
  private destroyed = new Subject<void>();
  private renderedItems: T[] | ReadonlyArray<T>;
  private renderedRange: ListRange = { start: 0, end: 0 };

  constructor(
    private viewport: CdkVirtualScrollViewport,
    private table: CdkTable<T>,
    ngZone: NgZone,
    @Inject(_COALESCED_STYLE_SCHEDULER) private _coalescedStyleScheduler: _CoalescedStyleScheduler
  ) {
    this.renderDataSourceWithVirtualScroll(viewport, table, ngZone);
  }

  ngOnInit(): void {
    this.setStickyHeaderPosition();
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.dataSourceChanges.complete();
    this.virtualizedDataStream.complete();
  }

  measureRangeSize(range: ListRange, orientation: 'horizontal' | 'vertical'): number {
    throw new Error('Method not implemented.');
  }

  private renderDataSourceWithVirtualScroll(
    viewport: CdkVirtualScrollViewport,
    table: CdkTable<T>,
    ngZone: NgZone
  ): void {
    table.dataSource = this.virtualizedDataStream;
    this.dataStream.subscribe(data => {
      this.data = data;
      this.onRenderedDataChange();
    });
    viewport.renderedRangeStream.pipe(takeUntil(this.destroyed)).subscribe((range: ListRange) => {
      this.renderedRange = range;
      ngZone.run(() => this.viewChange.next(range));
      this.onRenderedDataChange();
    });
    viewport.attach(this);
  }

  private setStickyHeaderPosition(): void {
    this.viewport.scrolledIndexChange
      .pipe(
        map(() => this.viewport.getOffsetToRenderedContentStart()),
        takeUntil(this.destroyed)
      )
      .subscribe(offset => {
        const position = offset ?? 0;
        offset = -position;

        const stickyStates: boolean[] = this.headerRowDefs.map(rowDef => rowDef.sticky);
        const rows = this.table._getRenderedRows(this.table._headerRowOutlet);
        const stickyOffsets: number[] = [];
        const stickyCellHeights: (number | undefined)[] = [];
        const elementsToStick: HTMLElement[][] = [];

        for (let rowIndex = 0, stickyOffset = offset; rowIndex < rows.length; rowIndex++) {
          stickyOffsets[rowIndex] = stickyOffset;

          if (!stickyStates[rowIndex]) {
            continue;
          }

          const row = rows[rowIndex];
          elementsToStick[rowIndex] = [row];

          const height = row.getBoundingClientRect().height;
          stickyOffset += height;
          stickyCellHeights[rowIndex] = height;
        }

        this._coalescedStyleScheduler.schedule(() => {
          for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            if (!stickyStates[rowIndex]) {
              continue;
            }
            elementsToStick[rowIndex].forEach(element => {
              element.style.top = `${stickyOffsets[rowIndex]}px`;
            });
          }
        });
      });
  }

  private onRenderedDataChange(): void {
    if (!this.renderedRange) {
      return;
    }
    this.renderedItems = this.data.slice(this.renderedRange.start, this.renderedRange.end);
    this.virtualizedDataStream.next(this.renderedItems);
  }

  private changeDataSource(
    oldDataSource: DataSource<T> | null,
    newDataSource: DataSource<T> | null
  ): Observable<T[] | ReadonlyArray<T>> {
    oldDataSource?.disconnect(this);
    return newDataSource ? newDataSource.connect(this) : of();
  }
}
