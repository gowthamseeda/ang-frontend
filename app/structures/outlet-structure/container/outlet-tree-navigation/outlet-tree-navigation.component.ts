import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, filter, take, takeUntil } from 'rxjs/operators';

import { Brand } from '../../../../services/brand/brand.model';
import { BrandService } from '../../../../services/brand/brand.service';
import { OutletStructureOutlets } from '../../model/outlet-structure.model';
import { OutletStructureActionService } from '../../services/outlet-structure-action.service';
import { OutletStructureService } from '../../services/outlet-structure.service';

import { MenuAction, MenuItem } from './outlet-tree-navigation-menu-item.model';
import { OutletTreeNavigationService } from './outlet-tree-navigation.service';

export interface ToggleAffiliate {
  isActive: boolean;
  isAffiliate: boolean;
}

@Component({
  selector: 'gp-outlet-tree-navigation',
  templateUrl: './outlet-tree-navigation.component.html',
  styleUrls: ['./outlet-tree-navigation.component.scss']
})
export class OutletTreeNavigationComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input()
  changed: Observable<boolean>;
  @Input()
  toggleAffiliate: ToggleAffiliate;

  @Output()
  toggleAffiliateRequested = new EventEmitter<string>();

  @Output()
  outletClicked = new EventEmitter<any>();

  hasUserUpdatePermission: boolean;
  selectedOutletNode?: OutletStructureOutlets;
  selectedOutletBrands: string[];
  selectedOutletMenuItems: MenuItem[];
  allBrands: Brand[];

  private unsubscribe = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private structuresStoreService: OutletStructureService,
    private structuresActionService: OutletStructureActionService,
    private outletTreeNavigationService: OutletTreeNavigationService,
    private brandService: BrandService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.structuresStoreService.hasUpdatePermission(),
      this.structuresStoreService.getSelectedOutlet(),
      this.structuresStoreService.getSelectedOutletBrands(),
      this.structuresStoreService.getAvailableActionsOfSelectedOutlet(),
      this.brandService.getAll()
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        const [
          hasUpdatePermissions,
          selectedOutlet,
          selectedOutletBrands,
          defaultMenuItems,
          allBrands
        ] = data;

        this.selectedOutletNode = selectedOutlet;
        this.selectedOutletBrands = selectedOutletBrands;
        this.hasUserUpdatePermission = hasUpdatePermissions;
        this.allBrands = allBrands;
        this.determineNodeActions(defaultMenuItems);
      });
  }

  ngAfterViewInit(): void {
    if (this.changed) {
      this.changed
        .pipe(
          takeUntil(this.unsubscribe),
          filter(value => value === true),
          debounceTime(500)
        )
        .subscribe(() => {
          if (this.selectedOutletNode) {
            this.structuresActionService.dispatchLoadOutletStructures(
              this.selectedOutletNode.businessSiteId
            );
          }
        });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.hasChangedToggleAffiliate(changes.toggleAffiliate)) {
      this.toggleAffiliate = changes.toggleAffiliate.currentValue;
      this.refreshNodeActions();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  outletNodeClicked(businessSiteId: string): void {
    const route: Route | null = this.activatedRoute.snapshot.routeConfig;
    const currentPath = this.router.routerState.snapshot.url;
    const currentQueryParams = this.activatedRoute.snapshot.queryParams;
    const currentBusinessSiteId = this.selectedOutletNode?.businessSiteId;
    if (route && route.path) {
      const targetRoutePath = route.path.replace(':outletId', businessSiteId);
      this.router.navigate([`/outlet/${targetRoutePath}`], {
        relativeTo: this.activatedRoute,
        fragment: this.activatedRoute.snapshot.fragment ?? undefined
      });
    } else if (currentPath.startsWith('/outlet') && currentBusinessSiteId) {
      const targetRoutePath = currentPath
        .replace(currentBusinessSiteId, businessSiteId)
        .split('?')[0];
      this.router.navigate([`${targetRoutePath}`], {
        queryParams: currentQueryParams,
        relativeTo: this.activatedRoute,
        fragment: this.activatedRoute.snapshot.fragment ?? undefined
      });
    }
    this.outletClicked.emit();
  }

  menuItemClicked(menuAction: MenuAction): void {
    if (!this.selectedOutletNode) {
      return;
    }

    switch (menuAction.action) {
      case 'USER_ACTION_TOGGLE_AFFILIATE_STATE': {
        this.toggleAffiliateRequested.emit(this.selectedOutletNode.businessSiteId);
        break;
      }
      case 'USER_ACTION_MAKE_MAIN_OUTLET': {
        this.outletTreeNavigationService.createMarketStructureForOutlet(
          this.selectedOutletNode.businessSiteId,
          this.selectedOutletNode.subOutlet
        );
        break;
      }
      case 'USER_ACTION_REMOVE_ALL_SUBLETS': {
        this.outletTreeNavigationService.removeAllSubletsFromMarketStructure(
          this.selectedOutletNode.businessSiteId
        );
        break;
      }
      case 'USER_ACTION_DETACH_FROM_MARKET_STRUCTURE': {
        this.outletTreeNavigationService.removeOutletFromMarketStructure(
          this.selectedOutletNode.businessSiteId,
          this.selectedOutletNode.mainOutlet,
          this.selectedOutletNode.subOutlet
        );
        break;
      }
      case 'USER_ACTION_MAKE_SUBLET_OF': {
        this.outletTreeNavigationService.makeOutletSubletOf(
          this.selectedOutletNode,
          menuAction.param
        );
        break;
      }
      default: {
        console.error(`unknown user action: ${menuAction.action}, ${menuAction.param}`);
        break;
      }
    }
  }

  private determineNodeActions(defaultMenuItems: MenuItem[]): void {
    this.selectedOutletMenuItems =
      this.toggleAffiliate && this.toggleAffiliate.isActive
        ? [
            {
              label: this.toggleAffiliate.isAffiliate
                ? 'UNMARK_AS_AFFILIATE_OF_DAIMLER'
                : 'MARK_AS_AFFILIATE_OF_DAIMLER',
              action: 'USER_ACTION_TOGGLE_AFFILIATE_STATE'
            },
            ...defaultMenuItems
          ]
        : defaultMenuItems;
  }

  private refreshNodeActions(): void {
    this.structuresStoreService
      .getAvailableActionsOfSelectedOutlet()
      .pipe(take(1))
      .subscribe(defaultMenuItems => {
        this.determineNodeActions(defaultMenuItems);
      })
      .unsubscribe();
  }

  private hasChangedToggleAffiliate(changedAffiliate: SimpleChange): boolean {
    return (
      changedAffiliate &&
      (changedAffiliate.previousValue === undefined ||
        changedAffiliate.previousValue.isAffiliate !== changedAffiliate.currentValue.isAffiliate ||
        changedAffiliate.previousValue.isActive !== changedAffiliate.currentValue.isActive)
    );
  }
}
