import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { EnableIfMarkedForHighlightingDirective } from '../../../shared/directives/enable-element-if-marked-for-highlighting/enable-if-marked-for-highlighting.directive';
import { SearchFilterTag } from '../../models/search-filter.model';
import { SearchItem } from '../../models/search-item.model';
import { getAutoLangSearchItemMock } from '../../models/search.mock';

import { OutletResult } from './outlet-result.model';
import { OutletResultComponent } from './outlet-result.component';
import {createSpyFromClass, Spy} from "jest-auto-spies";
import {UserNotificationsService} from "../../retailer-outlets/user-notifications.service";

describe('OutletResultComponent', () => {
  let component: OutletResultComponent;
  let fixture: ComponentFixture<OutletResultComponent>;
  let userNotificationsServiceSpy: Spy<UserNotificationsService>;

  beforeEach(
    waitForAsync(() => {
      userNotificationsServiceSpy = createSpyFromClass(UserNotificationsService);
      userNotificationsServiceSpy.updateNotification.nextWith({status: 'UPDATED'});
      TestBed.configureTestingModule({
        declarations: [OutletResultComponent, EnableIfMarkedForHighlightingDirective],
        imports: [TranslateModule.forRoot(), RouterTestingModule],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          { provide: UserNotificationsService, useValue: userNotificationsServiceSpy}
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.searchItem = getAutoLangSearchItemMock() as SearchItem<OutletResult>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('markAllIfTagged()', () => {
    it('should return the complete value marked', () => {
      component.searchFilters = [new SearchFilterTag('wiesenstr', 'street')];
      const searchText = component.markAllIfTagged('***wiesenstr***asse', 'street');

      expect(searchText).toEqual('***wiesenstrasse***');
    });

    it('should return the marked value as it is', () => {
      component.searchFilters = [];
      const searchText = component.markAllIfTagged('***wiesenstr***asse', 'street');

      expect(searchText).toEqual('***wiesenstr***asse');
    });
  });

  describe('onSearchItemClick()', () => {
    it('should emit search item', () => {
      const searchItemClickedSpy = spyOn(component.searchItemClicked, 'emit');
      component.onSearchItemClick();
      expect(searchItemClickedSpy).toHaveBeenCalledWith(component.searchItem);
      expect(userNotificationsServiceSpy.updateNotification).toHaveBeenCalledWith(component.searchItem.payload.id);
      expect(component.searchItem.payload.notification).toEqual(false);
    });
  });
});
