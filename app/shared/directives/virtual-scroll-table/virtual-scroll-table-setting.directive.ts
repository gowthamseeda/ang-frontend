import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { Directive, forwardRef } from '@angular/core';

import { VirtualScrollTableStrategy } from './virtual-scroll-table-strategy.service';

export function virtualScrollTableStrategyFactory(
  directive: VirtualScrollTableSettingDirective
): VirtualScrollTableStrategy {
  return directive.scrollStrategy;
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'cdk-virtual-scroll-viewport',
  providers: [
    {
      provide: VIRTUAL_SCROLL_STRATEGY,
      useFactory: virtualScrollTableStrategyFactory,
      deps: [forwardRef(() => VirtualScrollTableSettingDirective)]
    }
  ]
})
export class VirtualScrollTableSettingDirective {
  get rowHeight(): number {
    return 48;
  }

  get headerRowHeight(): number {
    return 48;
  }

  get buffer(): number {
    return 20;
  }

  scrollStrategy = new VirtualScrollTableStrategy(
    this.rowHeight,
    this.buffer,
    this.headerRowHeight
  );
}
