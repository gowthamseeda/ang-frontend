import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Country } from '../../geography/country/country.model';
import { ApiService } from '../../shared/services/api/api.service';

import { Timezone } from './timezone.model';

const url = '/app/assets/timezones/timezones.txt';

@Injectable()
export class TimezoneService {
  constructor(private apiService: ApiService) {}

  getTimezones(): Observable<Timezone[]> {
    return this.apiService
      .get<string>(url, undefined, 'text')
      .pipe(map((timezones: string) => this.parse(timezones)));
  }

  convertUtcToNumber(country: Country): Country {
    if (country.timeZone) {
      const offsetStr = country.timeZone.split('UTC')[1].split(':');
      let offset = parseFloat(offsetStr[0]) * 3600;

      if (offset < 0) {
        offset -= parseFloat(offsetStr[1]) * 60;
      } else {
        offset += parseFloat(offsetStr[1]) * 60;
      }

      country.timeZone = offset.toString();

      return country;
    }
    return country;
  }

  convertNumberToUtc(country: Country): string {
    let utc = '';

    if (country.timeZone) {
      const offset = parseFloat(country.timeZone);
      let hour = Math.floor(offset / 3600);
      const minutes = Math.abs(Math.floor((offset % 3600) / 60));

      if (hour > -1) {
        utc = `UTC+${this.formatHour(hour)}:${this.formatMinutes(minutes)}`;
      } else {
        if (hour < 0 && minutes > 0) {
          hour += 1;
        }
        utc = `UTC${this.formatHour(hour)}:${this.formatMinutes(minutes)}`;
      }
    }
    return utc;
  }

  private parse(payload: string): Timezone[] {
    const lines = payload.split(/\r?\n|\r/);
    const timezones: Timezone[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (this.checkUtcExists(line)) {
        const utcOffset = line.substr(0, line.indexOf(' '));
        const names = line.substr(line.indexOf(' ') + 1).split(',');

        names.forEach(name => {
          timezones.push(new Timezone(this.removeBrackets(utcOffset), [name.trim()]));
        });
      }
    }
    return this.groupByUtcOffset(timezones);
  }

  private checkUtcExists(line: string): boolean {
    return line.includes('(UTC') && !line.includes('(UTC)');
  }

  private groupByUtcOffset(timezones: Timezone[]): Timezone[] {
    const itemsByUtcOffset = timezones.reduce(
      (timezoneMap: Map<string, Timezone>, timezoneItem: Timezone) => {
        const existingItem = timezoneMap.get(timezoneItem.utcOffset);
        if (existingItem) {
          existingItem.names = [...existingItem.names, ...timezoneItem.names];
          existingItem.names.sort(this.sortByTimezoneName);
        } else {
          timezoneMap.set(timezoneItem.utcOffset, timezoneItem);
        }
        return timezoneMap;
      },
      new Map()
    );

    return Array.from(itemsByUtcOffset.values());
  }

  private sortByTimezoneName(a: string, b: string): number {
    return a.localeCompare(b);
  }

  private removeBrackets(line: string): string {
    return line.replace(/^\(|\)$/g, '');
  }

  private formatHour(hour: number): string {
    if (hour > -10 && hour < 0) {
      return `-0${Math.abs(hour)}`;
    }
    return hour > -1 && hour < 10 ? '0' + hour.toString() : hour.toString();
  }

  private formatMinutes(minutes: number): string {
    return minutes === 0 ? minutes.toString() + '0' : minutes.toString();
  }
}
