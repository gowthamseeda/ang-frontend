import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserSettings } from '../../../../user-settings/user-settings/model/user-settings.model';
import { OpeningHours } from '../../../models/opening-hours.model';
import { LocatedAddress, LocatedPOBox } from '../../../models/outlet-profile.model';
import { ProductCategory, Service } from '../../../models/services.model';
import { ProductCategoryWithServices } from '../../../presentational/view-profile/outlet-profile-product-category-and-services/product-category-with-services.model';
import * as fromOutlet from '../../../store/reducers';
import { selectLoadingStatusState } from '../../../store/selectors/loading-status.selectors';
import { selectOpeningHours } from '../../../store/selectors/opening-hours.selectors';
import {
  selectLocatedAddress,
  selectLocatedPOBox
} from '../../../store/selectors/outlet-profile.selectors';
import {
  selectPrimaryProductCategory,
  selectPrimaryProductCategoryServices,
  selectSecondaryProductCategories
} from '../../../store/selectors/services.selectors';
import { selectUserSettings } from '../../../store/selectors/user-settings.selectors';

@Component({
  selector: 'gp-services-tile',
  templateUrl: './services-tile.component.html',
  styleUrls: ['./services-tile.component.scss']
})
export class ServicesTileComponent implements OnInit, OnDestroy {
  isLoading: Observable<boolean>;
  locatedAddress: Observable<LocatedAddress>;
  poBox: Observable<LocatedPOBox>;

  primaryProductCategoryWithServices: ProductCategoryWithServices;
  secondaryProductCategories: string[] = [];

  productCategories: Observable<ProductCategory[]>;
  services: Observable<Service[]>;
  userSettings: Observable<UserSettings>;
  openingHours: Observable<OpeningHours>;

  private unsubscribe = new Subject<void>();

  constructor(private store: Store<fromOutlet.State>) {
    this.isLoading = this.store.pipe(select(selectLoadingStatusState));

    combineLatest([
      this.store.pipe(select(selectPrimaryProductCategory)),
      this.store.pipe(select(selectPrimaryProductCategoryServices)),
      this.store.pipe(select(selectOpeningHours))
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([productCategory, services]) => {
        this.primaryProductCategoryWithServices = this.initPrimaryProductCategoryWithServices(
          productCategory,
          services
        );
      });

    this.store
      .pipe(select(selectSecondaryProductCategories), takeUntil(this.unsubscribe))
      .subscribe(productCategories => {
        this.secondaryProductCategories = productCategories.map(
          productCategory => productCategory.name
        );
      });

    this.locatedAddress = this.store.pipe(select(selectLocatedAddress));
    this.poBox = this.store.pipe(select(selectLocatedPOBox));
    this.userSettings = this.store.pipe(select(selectUserSettings));
    this.openingHours = this.store.pipe(select(selectOpeningHours));
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initPrimaryProductCategoryWithServices(
    productCategory: ProductCategory | undefined,
    services: Service[]
  ): ProductCategoryWithServices {
    let serviceNames: string[] = [];
    let productCategoryName = '';

    if (services.length > 0 && productCategory !== undefined) {
      productCategoryName = productCategory.name;
      serviceNames = services
        .map(service => (service.serviceName ? service.serviceName : 'unknown'))
        .filter(name => name !== 'unknown');
    }
    return { productCategoryName: productCategoryName, serviceNames: serviceNames };
  }

  hasOfferedProductCategories(): boolean {
    return (
      this.primaryProductCategoryWithServices !== undefined ||
      this.secondaryProductCategories.length > 0
    );
  }
}
