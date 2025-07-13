import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { OutletStructureService } from '../../../../structures/outlet-structure/services/outlet-structure.service';
import { BusinessSite } from '../../../models/outlet-profile.model';
import {
  MenuPositionedComponent,
  MenuPositionedItem
} from '../../../presentational/view-profile/menu-positioned/menu-positioned.component';
import * as fromOutlet from '../../../store/reducers';
import {
  selectBrandIdsState,
  selectBusinessOrLegalNameState,
  selectBusinessSiteState,
  selectBusinessSiteTypeState,
  selectLoadingStatusState,
  selectProductGroupsState
} from '../../../store/selectors';

@Component({
  selector: 'gp-outlet-tile',
  templateUrl: './outlet-tile.component.html',
  styleUrls: ['./outlet-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutletTileComponent implements OnInit, OnDestroy {
  @Output()
  cardClick: EventEmitter<string> = new EventEmitter<string>();

  isOutletLoading: Observable<boolean>;
  businessSite: Observable<BusinessSite>;
  brandIds: Observable<string[]>;
  brandCodes: Observable<string[]>;
  menuItems: MenuPositionedItem[] = [];

  productGroups: Observable<string[]>;
  buildingType: Observable<string>;
  outletName: Observable<string>;

  @ViewChild(MenuPositionedComponent, { static: true })
  private positionedMenu: MenuPositionedComponent;
  private unsubscribe = new Subject<void>();

  constructor(
    private store: Store<fromOutlet.State>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private structuresStoreService: OutletStructureService
  ) {
    this.businessSite = this.store.pipe(select(selectBusinessSiteState));
    this.isOutletLoading = this.store.pipe(select(selectLoadingStatusState));
    this.brandCodes = this.structuresStoreService.getFirstTwoBrandCodesOfSelectedOutlet();
    this.brandIds = this.store.pipe(select(selectBrandIdsState));
    this.productGroups = this.store.pipe(select(selectProductGroupsState));
    this.buildingType = this.store.pipe(select(selectBusinessSiteTypeState));
    this.outletName = this.store.pipe(select(selectBusinessOrLegalNameState));
    this.businessSite.pipe(takeUntil(this.unsubscribe)).subscribe(outlet => {
      this.initMenuItems(outlet);
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  emitCardClickedEvent($event: any): void {
    this.positionedMenu.triggerMenuShow($event);
  }

  navigateTo(relativeUrl: string): void {
    this.router.navigate([relativeUrl], {
      relativeTo: this.activatedRoute
    });
  }

  private initMenuItems(outlet: BusinessSite): void {
    this.menuItems = [];
    this.menuItems.push({ text: 'BASE_DATA', actionUrl: `../../outlet/${outlet.id}/edit` });
    this.menuItems.push({ text: 'SERVICES', actionUrl: `../../outlet/${outlet.id}/services` });
    this.menuItems.push({ text: 'KEYS', actionUrl: `../../outlet/${outlet.id}/keys` });
    if (outlet.hasAssignedLabels) {
      this.menuItems.push({ text: 'LABELS', actionUrl: `../../outlet/${outlet.id}/labels` });
    }
    this.menuItems.push({ text: 'LEGAL_INFO', actionUrl: `../../outlet/${outlet.id}/legal` });
    this.menuItems.push({
      text: 'OPENING_HOURS_VIA_SERVICES',
      actionUrl: `../../outlet/${outlet.id}/services`
    });
  }
}
