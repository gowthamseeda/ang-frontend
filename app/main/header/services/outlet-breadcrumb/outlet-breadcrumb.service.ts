import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, noop, Observable } from 'rxjs';
import { buffer, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';

import { NavigationPermissionsService } from '../../../../legal-structure/businessSite/services/navigation-permission.service';
import {
  NavigationPermissions,
  ServiceNavigationPermissions
} from '../../../../legal-structure/businessSite/services/navigation-permissions.model';
import {
  paramOutletId,
  viewOutletPath
} from '../../../../legal-structure/legal-structure-routing-paths';
import { Service } from '../../../../services/service/models/service.model';
import { MultiSelectDataService } from '../../../../services/service/services/multi-select-service-data.service';
import { ServiceService } from '../../../../services/service/services/service.service';
import {
  BREADCRUMB_OUTLET_OFFERING_MAP,
  BREADCRUMB_SERVICE_OFFERING_MAP,
  BreadcrumbData,
  BreadcrumbItem,
  BreadcrumbLevel,
  OutletOffering,
  ServiceOffering
} from '../../models/header.model';

const isActivationEnd = (event: any) => event instanceof ActivationEnd;
const isNavigationEnd = (event: any) => event instanceof NavigationEnd;

@Injectable({
  providedIn: 'root'
})
export class OutletBreadcrumbService {
  breadcrumbItems: BehaviorSubject<BreadcrumbItem[]> = new BehaviorSubject<BreadcrumbItem[]>([]);

  private routeSnapshot: ActivatedRouteSnapshot;
  private breadcrumbData: BreadcrumbData;
  private navigationPermissions: NavigationPermissions;
  private serviceNavigationPermissions: ServiceNavigationPermissions;
  private offeredServices: Service[] = [];
  private outletId: string;
  private serviceId: number;
  private isMultiEdit: boolean;

  constructor(
    private router: Router,
    private serviceService: ServiceService,
    private navigationPermissionsService: NavigationPermissionsService,
    private multiSelectDataService: MultiSelectDataService
  ) {
    this.onRouterEvents()
      .pipe(
        switchMap(() =>
          combineLatest([
            this.navigationPermissionsService.getPermissions(),
            this.navigationPermissionsService.getServicePermissions(),
            this.serviceService.getAllOfferedServices(),
            this.multiSelectDataService.isTargetsEmpty
          ])
        ),
        tap(
          ([
            navigationPermissions,
            serviceNavigationPermissions,
            offeredServices,
            isSelectedServicesEmpty
          ]) => {
            this.outletId = this.routeSnapshot.paramMap.get(paramOutletId) || '';
            this.breadcrumbData = this.routeSnapshot.data['breadcrumb'];
            this.navigationPermissions = navigationPermissions;
            this.serviceNavigationPermissions = serviceNavigationPermissions;
            this.offeredServices = offeredServices;
            this.isMultiEdit = !isSelectedServicesEmpty;
            this.constructBreadcrumbs();
          }
        )
      )
      .subscribe();
  }

  private onRouterEvents(): Observable<ActivatedRouteSnapshot[]> {
    return this.router.events.pipe(
      filter(isActivationEnd),
      map((event: ActivationEnd) => event.snapshot),
      filter(event => event.data.breadcrumb !== undefined),
      buffer(this.router.events.pipe(filter(isNavigationEnd))),
      distinctUntilChanged(),
      tap(events => (events.length !== 0 ? (this.routeSnapshot = events[0]) : noop()))
    );
  }

  private constructBreadcrumbs(): void {
    const arr: BreadcrumbItem[] = [];
    let isServiceOffering = false;
    let isOutletOffering = false;

    switch (this.breadcrumbData.level) {
      case BreadcrumbLevel.SERVICE_OFFERING:
        if (this.isMultiEdit) {
          this.constructMultiSelectServiceOfferingBreadcrumbs().map(breadcrumbItem =>
            arr.push(breadcrumbItem)
          );
        } else {
          this.constructServiceOfferingBreadcrumbs().map(breadcrumbItem =>
            arr.push(breadcrumbItem)
          );
        }
        isServiceOffering = true;
      /* falls through */
      case BreadcrumbLevel.OUTLET_OFFERING:
        arr.push(this.constructOutletOfferingBreadcrumb(isServiceOffering));
        isOutletOffering = true;
      /* falls through */
      case BreadcrumbLevel.OUTLET:
        arr.push(this.constructOutletBreadcrumb(isOutletOffering, isServiceOffering));
    }

    this.breadcrumbItems.next(arr.reverse());
  }

  private constructOutletBreadcrumb(
    isOutletOffering: boolean,
    isServiceOffering: boolean
  ): BreadcrumbItem {
    const label = `Outlet ${this.outletId}`;
    const children = this.constructOutletBreadcrumbItems(isServiceOffering);

    let breadcrumbItem: BreadcrumbItem = { label, children };

    if (isOutletOffering) {
      const path = this.constructPath(viewOutletPath);
      breadcrumbItem = { ...breadcrumbItem, path };
    }

    return breadcrumbItem;
  }

  private constructOutletOfferingBreadcrumb(isServiceOffering: boolean = false): BreadcrumbItem {
    const outletOffering =
      this.breadcrumbData.offering !== undefined ? this.breadcrumbData.offering : '';
    const label = BREADCRUMB_OUTLET_OFFERING_MAP[outletOffering].label;

    let breadcrumbItem: BreadcrumbItem = { label };

    if (outletOffering === OutletOffering.SERVICES || isServiceOffering) {
      breadcrumbItem = this.constructOutletOfferingServiceBreadcrumb(isServiceOffering);
    }

    return breadcrumbItem;
  }

  private constructOutletOfferingServiceBreadcrumb(isServiceOffering: boolean): BreadcrumbItem {
    const label = BREADCRUMB_OUTLET_OFFERING_MAP[OutletOffering.SERVICES].label;
    const children = this.constructOutletOfferingServiceBreadcrumbItems();

    let breadcrumbItem: BreadcrumbItem = { label, children };

    if (isServiceOffering) {
      const path = this.constructPath(BREADCRUMB_OUTLET_OFFERING_MAP[OutletOffering.SERVICES].path);
      breadcrumbItem = { ...breadcrumbItem, path };
    }

    return breadcrumbItem;
  }

  private constructMultiSelectServiceOfferingBreadcrumbs(): BreadcrumbItem[] {
    const serviceOffering =
      this.breadcrumbData.offering !== undefined ? this.breadcrumbData.offering : '';
    const serviceOfferingLabel = BREADCRUMB_SERVICE_OFFERING_MAP[serviceOffering].label;
    return [{ label: serviceOfferingLabel }, { label: 'Multi-Edit' }];
  }

  private constructServiceOfferingBreadcrumbs(): BreadcrumbItem[] {
    const serviceOffering =
      this.breadcrumbData.offering !== undefined ? this.breadcrumbData.offering : '';
    const serviceOfferingLabel = BREADCRUMB_SERVICE_OFFERING_MAP[serviceOffering].label;

    this.serviceId = Number(this.routeSnapshot.queryParamMap.get('serviceId'));
    const offeredService =
      this.offeredServices.find(service => service.serviceId === this.serviceId) ||
      ({ name: '' } as Service);

    const label = offeredService.name;
    const children = this.constructServiceOfferingBreadcrumbItems(offeredService);

    return [{ label: serviceOfferingLabel }, { label, children }];
  }

  private constructOutletBreadcrumbItems(isServiceOffering: boolean): BreadcrumbItem[] {
    return this.filterOutletOfferingsByNavigationPermissions()
      .filter(
        outletOffering =>
          OutletOffering[outletOffering] !==
          (isServiceOffering ? OutletOffering.SERVICES : this.breadcrumbData.offering)
      )
      .map(outletOffering => {
        const offering = BREADCRUMB_OUTLET_OFFERING_MAP[OutletOffering[outletOffering]];
        return {
          label: offering.label,
          path: this.constructPath(offering.path)
        };
      });
  }

  private constructOutletOfferingServiceBreadcrumbItems(): BreadcrumbItem[] {
    return this.offeredServices
      .map(service => {
        return {
          label: service.name,
          children: this.constructServiceOfferingBreadcrumbItems(service)
        };
      })
      .filter(service => service.children.length !== 0);
  }

  private constructServiceOfferingBreadcrumbItems(service: Service): BreadcrumbItem[] {
    return this.filterServiceOfferingsByNavigationPermissions(service)
      .filter(serviceOffering =>
        service.serviceId === this.serviceId
          ? ServiceOffering[serviceOffering] !== this.breadcrumbData.offering
          : true
      )
      .map(serviceOffering => {
        const offering = BREADCRUMB_SERVICE_OFFERING_MAP[ServiceOffering[serviceOffering]];
        return {
          label: offering.label,
          path: this.constructPath(offering.path),
          queryParams: {
            productCategoryId: service.productCategoryId,
            serviceId: service.serviceId
          }
        };
      });
  }

  private filterOutletOfferingsByNavigationPermissions(): string[] {
    return Object.keys(OutletOffering)
      .filter(outletOffering => isNaN(+outletOffering))
      .filter(outletOffering => {
        switch (OutletOffering[outletOffering]) {
          case OutletOffering.LABELS:
            return this.navigationPermissions.assignedBrandLabelsEnabled;
          case OutletOffering.SERVICES:
            return this.navigationPermissions.servicesEnabled;
          case OutletOffering.SHAREHOLDER:
            return this.navigationPermissions.shareHolderEnabled;
          case OutletOffering.OUTLET_RELATIONSHIPS:
            return this.navigationPermissions.outletRelationshipsEnabled;
          case OutletOffering.HISTORIZATION:
            return this.navigationPermissions.historizationEnabled;
          default:
            return true;
        }
      });
  }

  private filterServiceOfferingsByNavigationPermissions(service: Service): string[] {
    return Object.keys(ServiceOffering)
      .filter(serviceOffering => isNaN(+serviceOffering))
      .filter(serviceOffering => {
        switch (ServiceOffering[serviceOffering]) {
          case ServiceOffering.VALIDITY:
            return this.serviceNavigationPermissions.validityEnabled;
          case ServiceOffering.OPENING_HOURS:
            return (
              this.serviceNavigationPermissions.openingHoursEnabled && service.openingHoursSupport
            );
          case ServiceOffering.CONTRACTS:
            return this.serviceNavigationPermissions.contractsEnabled;
          case ServiceOffering.COMMUNICATION:
            return this.serviceNavigationPermissions.communicationEnabled;
          default:
            return true;
        }
      });
  }

  private constructPath(path?: string): string {
    return path !== undefined
      ? `/outlet/${path.replace(':outletId', this.outletId)}`
      : this.constructPath(viewOutletPath);
  }
}
