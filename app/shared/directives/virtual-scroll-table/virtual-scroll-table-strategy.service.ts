import { CdkVirtualScrollViewport, VirtualScrollStrategy } from '@angular/cdk/scrolling';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export class VirtualScrollTableStrategy implements VirtualScrollStrategy {
  scrolledIndex = new Subject<number>();
  scrolledIndexChange = this.scrolledIndex.pipe(distinctUntilChanged());

  private viewport: CdkVirtualScrollViewport;
  private readonly buffer: number;
  private readonly headerHeight: number;
  private readonly rowHeight: number;

  constructor(rowHeight: number, buffer: number, headerHeight: number) {
    this.rowHeight = rowHeight;
    this.buffer = buffer;
    this.headerHeight = headerHeight;
    this.updateTotalContentSize();
    this.updateContent();
  }

  attach(viewport: CdkVirtualScrollViewport): void {
    this.viewport = viewport;
    this.updateTotalContentSize();
    this.updateContent();
  }

  detach(): void {
    this.scrolledIndex.complete();
  }

  onContentScrolled(): void {
    this.updateContent();
  }

  onDataLengthChanged(): void {
    this.updateTotalContentSize();
    this.updateContent();
  }

  onContentRendered(): void {}

  onRenderedOffsetChanged(): void {}

  scrollToIndex(index: number, behavior: ScrollBehavior): void {}

  protected updateContent(): void {
    if (this.viewport) {
      const viewportSize = this.viewport.getViewportSize();
      const dataLength = this.viewport.getDataLength();
      const scrollOffset = this.viewport.measureScrollOffset();

      const firstVisibleIndex = Math.floor((scrollOffset + this.headerHeight) / this.rowHeight);

      const bufferedItems = Math.min(this.buffer, firstVisibleIndex);
      const itemsInViewport = Math.ceil(viewportSize / this.rowHeight);
      const itemsToRender = itemsInViewport + this.buffer;
      const newOffset = this.rowHeight * (firstVisibleIndex - bufferedItems);
      const newRange = {
        start: Math.max(0, firstVisibleIndex - bufferedItems),
        end: Math.min(dataLength, firstVisibleIndex + itemsToRender)
      };

      this.viewport.setRenderedContentOffset(newOffset);
      this.viewport.setRenderedRange(newRange);
      this.scrolledIndex.next(Math.floor(firstVisibleIndex));
    }
  }

  protected updateTotalContentSize(): void {
    this.viewport?.setTotalContentSize(this.viewport.getDataLength() * this.rowHeight);
  }
}
