import { formatDate } from '@angular/common';
import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LocaleService } from '../../services/locale/locale.service';

@Pipe({
  name: 'localeDateTime',
  pure: false
})
export class LocaleDateTimePipe implements PipeTransform, OnDestroy {
  private locale = '';
  private unsubscribe = new Subject<void>();

  constructor(private localeService: LocaleService) {
    this.localeService
      .currentBrowserLocale()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(locale => {
        this.locale = locale;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  transform(value: any, format?: string): string {
    return formatDate(value, format ?? 'shortDate', this.locale);
  }
}
