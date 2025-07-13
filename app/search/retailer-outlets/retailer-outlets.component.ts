import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { LegalStructureRoutingService } from '../../legal-structure/legal-structure-routing.service';
import { SearchItem } from '../models/search-item.model';
import { OutletResult } from '../shared/outlet-result/outlet-result.model';

import { RetailerOutletsService } from './retailer-outlets.service';
import {UserNotificationsService} from "./user-notifications.service";
import {SearchItemResponse} from "../search.service";
import {UserNotifications} from "../models/user-notifcations.model";

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'gp-retailer-outlets',
  templateUrl: './retailer-outlets.component.html',
  styleUrls: ['./retailer-outlets.component.scss']
})
export class RetailerOutletsComponent implements OnInit {
  retailerOutlets: SearchItem<OutletResult>[] = [];
  selectedOutletId: Observable<string>;
  error: Error;

  private retailerOutletsSubscription: Subscription;
  private currentPage = 0;
  private totalRetailerOutlets: number;
  private userNotificationsSubscription: Subscription;

  constructor(
    private legalStructureRoutingService: LegalStructureRoutingService,
    private retailerOutletsService: RetailerOutletsService,
    private userNotificationsService: UserNotificationsService,
    private changeDetector: ChangeDetectorRef,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.selectedOutletId = this.legalStructureRoutingService.outletIdChanges;
    this.loadRetailerOutlets();
  }

  lazyLoadRetailerOutlets(event: any): void {
    if (event.target?.scrollTop > 0) {
      if (this.retailerOutlets.length >= this.totalRetailerOutlets) {
        return;
      }

      this.currentPage += 1;
      this.loadRetailerOutlets(this.currentPage);
    }
  }

  get isLoading(): boolean {
    return this.retailerOutletsSubscription && !this.retailerOutletsSubscription.closed
      && this.userNotificationsSubscription && !this.userNotificationsSubscription.closed;
  }

  private loadRetailerOutlets(page = 0): void {
    this.userNotificationsSubscription = this.userNotificationsService.get().subscribe(
        userNotificationsResponse => {
          this.retailerOutletsSubscription = this.retailerOutletsService.getAll(page).subscribe(
            retailerOutletsResponse => {
              this.retailerOutlets = this.OutletNotificationMapping(retailerOutletsResponse, userNotificationsResponse);
              this.totalRetailerOutlets = retailerOutletsResponse.total;
              this.changeDetector.detectChanges();
            },
            error => (this.error = error)
          );
        },
      error => {
          this.error = error;
        }
    );
  }

  OutletNotificationMapping(retailerOutletsResponse: SearchItemResponse, userNotificationsResponse: UserNotifications[]) {
    return this.retailerOutlets
    .concat(retailerOutletsResponse.searchItems)
    .map(retailerOutlet => {
      const matchingNotification = userNotificationsResponse.filter(
        userNotification => retailerOutlet.id.includes(userNotification.businessSiteId)
      )
      var notificationType = "";
      matchingNotification.forEach( notification => {
        if (matchingNotification && notification.notificationTasksState) {
          retailerOutlet.payload.notification = notification.notificationTasksState;

          if(notification.notificationType === "VERIFICATION_TASK"){
            notificationType = notificationType + this.translateService.instant('VERIFICATION_TASK') + "\n";
          }else if(notification.notificationType === "TASK_STATUS_UPDATED"){
            notificationType = notificationType + this.translateService.instant('TASK_STATUS_UPDATED') + "\n";
          }else if(notification.notificationType === "DATA_UPDATED"){
            notificationType = notificationType + this.translateService.instant('DATA_UPDATED') + "\n";
          }
        }
        retailerOutlet.payload.notificationType = notificationType;
      })
      return retailerOutlet;
    });
  }
}
