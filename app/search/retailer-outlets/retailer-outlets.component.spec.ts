import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { BehaviorSubject } from 'rxjs';

import { LegalStructureRoutingService } from '../../legal-structure/legal-structure-routing.service';
import { SearchItem } from '../models/search-item.model';
import { SearchItemResponse } from '../search.service';

import { RetailerOutletsComponent } from './retailer-outlets.component';
import {
  getAutoLangRetailerOutletMock,
  getAutoLangRetailerOutletWithNotificationMock,
  getDaimlerTSSRetailerOutletMock
} from './retailer-outlets.mock';
import { RetailerOutletsService } from './retailer-outlets.service';
import {UserNotificationsService} from "./user-notifications.service";
import {UserNotifications} from "../models/user-notifcations.model";

class LegalStructureRoutingServiceStub {
  outletIdChanges = new BehaviorSubject<string>('GS0');
}

const retailerOutletsResponseMock = {
  total: 2,
  searchItems: [
    getDaimlerTSSRetailerOutletMock(),
    getAutoLangRetailerOutletMock()
  ] as SearchItem<any>[]
} as SearchItemResponse;

const retailerOutletsResponseWithNotificationMock = {
  total: 2,
  searchItems: [
    getDaimlerTSSRetailerOutletMock(),
    getAutoLangRetailerOutletWithNotificationMock()
  ] as SearchItem<any>[]
} as SearchItemResponse;

const userNotificationsResponseMock = [
  {
    businessSiteId: 'GS20000001',
    notificationTasksState: true,
    notificationType: "VERIFICATION_TASK"
  }
] as UserNotifications[];


describe('RetailerOutletsComponent', () => {
  let component: RetailerOutletsComponent;
  let fixture: ComponentFixture<RetailerOutletsComponent>;
  let retailerOutletsServiceSpy: Spy<RetailerOutletsService>;
  let userNotificationsServiceSpy: Spy<UserNotificationsService>;

  beforeEach(
    waitForAsync(() => {
      retailerOutletsServiceSpy = createSpyFromClass(RetailerOutletsService);
      retailerOutletsServiceSpy.getAll.nextWith(retailerOutletsResponseMock);
      userNotificationsServiceSpy = createSpyFromClass(UserNotificationsService);
      userNotificationsServiceSpy.get.nextWith(userNotificationsResponseMock);

      TestBed.configureTestingModule({
        declarations: [RetailerOutletsComponent],
        imports: [TranslateModule.forRoot()],
        providers: [
          {
            provide: LegalStructureRoutingService,
            useValue: new LegalStructureRoutingServiceStub(),
          },
          { provide: RetailerOutletsService, useValue: retailerOutletsServiceSpy },
          { provide: UserNotificationsService, useValue: userNotificationsServiceSpy}
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailerOutletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set selected outlet ID', done => {
      component.selectedOutletId.subscribe(selectedOutletId => {
        expect(selectedOutletId).toEqual('GS0');
        done();
      });
    });

    it('should call user notifications get', () => {
      expect(userNotificationsServiceSpy.get).toHaveBeenCalled();
    });

    it('should load retailer outlets and notifications added', () => {
      expect(component.retailerOutlets).toEqual(retailerOutletsResponseWithNotificationMock.searchItems);
    });
  });

  it('should map the notification status to the retailer outlet', () => {
    const result = component.OutletNotificationMapping(retailerOutletsResponseMock, userNotificationsResponseMock);
    expect(result[1].payload.notification).toEqual(userNotificationsResponseMock[0].notificationTasksState);
  })
});
