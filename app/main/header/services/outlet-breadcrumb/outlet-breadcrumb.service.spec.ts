import { TestBed } from '@angular/core/testing';
import { ActivationEnd, Event, NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { NavigationPermissionsService } from '../../../../legal-structure/businessSite/services/navigation-permission.service';
import { ServiceService } from '../../../../services/service/services/service.service';
import {
  activatedRouteSnapshotMock,
  navigationPermissionsMock,
  offeredServicesMock,
  outletBreadcrumbMock,
  outletOfferingBreadcrumbMock,
  serviceNavigationPermissionsMock,
  serviceOfferingBreadcrumbMock
} from '../../models/outlet-breadcrumb.mock';

import { OutletBreadcrumbService } from './outlet-breadcrumb.service';

const events = new BehaviorSubject<Event>({} as Event);

class RouterStub {
  events = events;
}

describe('OutletBreadcrumbService', () => {
  let service: OutletBreadcrumbService;
  let serviceServiceSpy: Spy<ServiceService>;
  let navigationPermissionsServiceSpy: Spy<NavigationPermissionsService>;

  beforeEach(() => {
    serviceServiceSpy = createSpyFromClass(ServiceService);
    navigationPermissionsServiceSpy = createSpyFromClass(NavigationPermissionsService);

    serviceServiceSpy.getAllOfferedServices.nextWith(offeredServicesMock);
    navigationPermissionsServiceSpy.getPermissions.nextWith(navigationPermissionsMock);
    navigationPermissionsServiceSpy.getServicePermissions.nextWith(
      serviceNavigationPermissionsMock
    );

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: Router, useClass: RouterStub },
        { provide: ServiceService, useValue: serviceServiceSpy },
        { provide: NavigationPermissionsService, useValue: navigationPermissionsServiceSpy }
      ]
    });
    service = TestBed.inject(OutletBreadcrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('should construct outlet breadcrumb', () => {
    beforeEach(() => {
      events.next(new ActivationEnd(activatedRouteSnapshotMock));
      events.next(new NavigationEnd(1, '', ''));
    });

    it('should construct outlet breadcrumb', done => {
      service.breadcrumbItems.subscribe(breadcrumbItems => {
        expect(breadcrumbItems).toEqual([
          outletBreadcrumbMock,
          outletOfferingBreadcrumbMock,
          ...serviceOfferingBreadcrumbMock
        ]);
        done();
      });
    });
  });
});
