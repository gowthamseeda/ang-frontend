import { getLocaleFirstDayOfWeek, WeekDay } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Times } from 'app/opening-hours/models/opening-hour.model';
import {
  formatTime,
  timeFormatOf,
  TIME_FORMAT_24
} from '../../../../opening-hours/util/opening-hours-formatter';
import { ascend, descend, equals, groupBy, map, prop, sortWith } from 'ramda';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocaleService } from '../../../../shared/services/locale/locale.service';
import { OpeningHoursData, OpeningHoursDiff, OpeningHoursDiffData } from '../../../task.model';

export const weekStringStartSaturday = ['SA', 'SU', 'MO', 'TU', 'WE', 'TH', 'FR'];
export const weekStringStartSunday = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
export const weekStringStartMonday = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

@Component({
  selector: 'gp-task-diff-opening-hours',
  templateUrl: './task-diff-opening-hours.component.html',
  styleUrls: ['./task-diff-opening-hours.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDiffOpeningHoursComponent implements OnInit, OnDestroy {
  @Input() taskDiff: OpeningHoursDiff;
  @Input() languageId: string;
  localeTimeFormat = TIME_FORMAT_24;
  defaultEmptyValue = '-';
  localizedWeekDays: string[] = weekStringStartSunday;
  groupedAndSortedOpeningHours: any;

  private unsubscribe = new Subject<void>();

  constructor(private localeService: LocaleService) {}

  ngOnInit(): void {
    this.localeService
      .currentBrowserLocale()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(locale => {
        this.localeTimeFormat = timeFormatOf(locale);
        this.localizedWeekDays = this.localeWeekDays(locale);
      });

    this.groupOpeningHours();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  highlighted(diff: OpeningHoursDiffData): boolean {
    return !equals(diff.old, diff.new);
  }

  translatedServiceNameBy(data: OpeningHoursData): string {
    const serviceNameTranslation = data.serviceNameTranslations?.find(
      i => i.languageId === this.languageId
    );

    return serviceNameTranslation?.name ?? data.serviceName ?? data.serviceId.toString();
  }

  formattedTimeBy(times: Times): string {
    const begin = formatTime(times?.begin, this.localeTimeFormat);
    const end = formatTime(times?.end, this.localeTimeFormat);
    return `${begin} - ${end}`;
  }

  private localeWeekDays(locale: string): string[] {
    const firstDayOfWeek = getLocaleFirstDayOfWeek(locale);
    switch (firstDayOfWeek) {
      case WeekDay.Monday:
        return weekStringStartMonday;
      case WeekDay.Saturday:
        return weekStringStartSaturday;
      default:
        return weekStringStartSunday;
    }
  }

  private groupOpeningHours(): void {
    const groupByServiceBrandProductGroupDiff = groupBy(
      (openingHour: any) =>
        openingHour.serviceId +
        openingHour.brandId +
        openingHour.productGroupId +
        openingHour.startDate +
        openingHour.endDate +
        JSON.stringify(openingHour.diff),
      this.taskDiff.openingHoursDiff
    );

    const openingHoursGroups = Object.values(
      map((val: any) => {
        const firstValue = val[0];
        return {
          serviceId: firstValue.serviceId,
          serviceName: firstValue.serviceName,
          brandId: firstValue.brandId,
          productGroupId: firstValue.productGroupId,
          diff: firstValue.diff,
          days: this.sortDaysByDayOfWeek(val.map((va: any) => va.day)),
          startDate: firstValue.startDate,
          endDate: firstValue.endDate,
          payload: val
        };
      }, Object.values(groupByServiceBrandProductGroupDiff))
    );

    const groupByServiceDiffDays = groupBy(
      (openingHoursGroup: any) =>
        openingHoursGroup.serviceId +
        JSON.stringify(openingHoursGroup.diff) +
        openingHoursGroup.days +
        openingHoursGroup.startDate +
        openingHoursGroup.endDate,
      openingHoursGroups
    );

    const groupedOpeningHours = Object.values(
      map((val: any) => {
        const firstValue = val[0];
        return {
          serviceId: firstValue.serviceId,
          serviceName: firstValue.serviceName,
          diff: firstValue.diff,
          days: firstValue.days,
          startDate: firstValue.startDate,
          endDate: firstValue.endDate,
          brandProductGroupMap: this.mapBrandProductGroup(val)
        };
      }, Object.values(groupByServiceDiffDays))
    );

    this.groupedAndSortedOpeningHours = sortWith(
      [ascend(prop('serviceId')), descend(prop('startDate'))],
      groupedOpeningHours
    );
  }

  private sortDaysByDayOfWeek(days: string[]): string[] {
    return this.localizedWeekDays.filter(dayOfWeek => days.includes(dayOfWeek));
  }

  private mapBrandProductGroup(payloads: any): Map<string, Set<string>> {
    const brandProductGroupMap = new Map();

    payloads.forEach((val: any) => {
      if (brandProductGroupMap.has(val.brandId)) {
        brandProductGroupMap.get(val.brandId).add(val.productGroupId);
      } else {
        brandProductGroupMap.set(val.brandId, new Set().add(val.productGroupId));
      }
    });

    return brandProductGroupMap;
  }
}
