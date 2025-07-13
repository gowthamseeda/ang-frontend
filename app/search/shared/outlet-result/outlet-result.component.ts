import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SearchFilter } from '../../models/search-filter.model';
import { SearchItem } from '../../models/search-item.model';

import { OutletResult } from './outlet-result.model';
import {UserNotificationsService} from "../../retailer-outlets/user-notifications.service";
import {tap} from "rxjs/operators";

@Component({
  selector: 'gp-outlet-result',
  templateUrl: './outlet-result.component.html',
  styleUrls: ['./outlet-result.component.scss']
})
export class OutletResultComponent {
  @Input()
  searchItem: SearchItem<OutletResult>;
  @Input()
  searchFilters: SearchFilter[] = [];
  @Input()
  disabledRouting = false;
  @Input()
  active = false;
  @Input()
  retailOutlet = false;
  @Output()
  searchItemClicked = new EventEmitter<SearchItem<OutletResult>>();

  routerLink: RouterLink | any[];

  constructor( private userNotificationsService: UserNotificationsService ) {}

  markAllIfTagged(text: string | string[], fieldName: string): string | undefined | string[] {
    if (!text) {
      return;
    }
    if (typeof text === 'string') {
      return this.markAllIfStringTagged(text, fieldName);
    } else {
      const newMarkedText: string[] = [];
      text.forEach(element => {
        newMarkedText.push(this.markAllIfStringTagged(element, fieldName));
      });
      return newMarkedText && newMarkedText.length > 0 ? newMarkedText.join(', ') : '-';
    }
  }

  onSearchItemClick(): void {
    this.userNotificationsService.updateNotification(this.searchItem.payload.id)
      .pipe(
      tap(() => {
        this.searchItem.payload.notification = false;
      })
    ).subscribe();
    this.searchItemClicked.emit(this.searchItem);
  }

  private markAllIfStringTagged(text: string, fieldName: string): string {
    let newMarkedText;

    if (this.isFieldNameTagged(fieldName) && this.isTextHighlighted(text)) {
      newMarkedText = text.replace(/\*\*\*/g, '');
      newMarkedText = '***' + newMarkedText + '***';
    } else {
      newMarkedText = text;
    }

    return newMarkedText;
  }

  private isFieldNameTagged(fieldName: string): boolean {
    return (
      this.searchFilters.length > 0 &&
      this.searchFilters.filter(value => value.name === fieldName).length > 0
    );
  }

  private isTextHighlighted(text: string): boolean {
    const regExp = /[\*]{3}/g;
    return ((text || '').match(regExp) || []).length >= 2;
  }
}
