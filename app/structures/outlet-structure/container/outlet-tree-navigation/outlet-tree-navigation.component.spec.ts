import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { OutletTreeNavigationComponent } from './outlet-tree-navigation.component';
import { OutletTreeNavigationService } from './outlet-tree-navigation.service';
import { OutletStructureService } from '../../services/outlet-structure.service';
import { BrandService } from '../../../../services/brand/brand.service';
import { MenuAction, MenuItem } from './outlet-tree-navigation-menu-item.model';
import { Brand } from '../../../../services/brand/brand.model';
import { OutletStructureActionService } from '../../services/outlet-structure-action.service';
import { getSubOutlet_GS000100 } from '../../model/outlet-structure.mock';
import { ActivatedRoute, Router } from '@angular/router';

describe('OutletTreeNavigationComponent Suite', () => {
  let component: OutletTreeNavigationComponent;
  let structureStoreService: OutletStructureService;
  let brandService: BrandService;
  let outletTreeNavigationService: OutletTreeNavigationService;
  let structureActionService: OutletStructureActionService;

  const structureOutlet = getSubOutlet_GS000100();
  const businessSiteId = structureOutlet.businessSiteId;
  const defaultMenuItems: MenuItem[] = [{ label: 'mItemLabel', action: 'mItemAction' }];
  const updatePermission = true;
  const structureOutletBrands: string[] = ['MB', 'SMT'];
  const allBrands: Brand[] = [
    { id: 'MB', name: 'MB' },
    { id: 'SMT', name: 'SMT' },
    { id: 'MYB', name: 'MYB' }
  ];

  class ActivatedRouteStub {
    snapshot = {
      routeConfig: {
        path: ':outletId/edit'
      }
    };

    updatePath(newPath: string) {
      this.snapshot.routeConfig.path = newPath;
    }
  }

  let mockRouter = {
    navigate: jest.fn(),
    routerState: {
      snapshot: {
        url: `/outlet/${businessSiteId}/services`
      }
    }
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        OutletTreeNavigationComponent,
        provideMockStore(),
        {
          provide: OutletStructureService,
          useValue: {
            hasUpdatePermission: jest.fn(),
            getSelectedOutlet: jest.fn(),
            getSelectedOutletBrands: jest.fn(),
            getAvailableActionsOfSelectedOutlet: jest.fn()
          }
        },
        {
          provide: BrandService,
          useValue: {
            getAll: jest.fn()
          }
        },
        {
          provide: OutletStructureActionService,
          useValue: {
            dispatchLoadOutletStructures: jest.fn()
          }
        },
        {
          provide: OutletTreeNavigationService,
          useValue: {
            createMarketStructureForOutlet: jest.fn(),
            removeAllSubletsFromMarketStructure: jest.fn(),
            removeOutletFromMarketStructure: jest.fn(),
            makeOutletSubletOf: jest.fn()
          }
        },
        {
          provide: ActivatedRoute,
          useClass: ActivatedRouteStub
        },
        {
          provide: Router,
          useValue: mockRouter
        }
      ],
      imports: [RouterTestingModule.withRoutes([])]
    });

    component = TestBed.inject(OutletTreeNavigationComponent);
    structureStoreService = TestBed.inject(OutletStructureService);
    brandService = TestBed.inject(BrandService);
    outletTreeNavigationService = TestBed.inject(OutletTreeNavigationService);
    structureActionService = TestBed.inject(OutletStructureActionService);

    jest
      .spyOn(structureStoreService, 'getAvailableActionsOfSelectedOutlet')
      .mockReturnValue(of(defaultMenuItems));
    jest.spyOn(structureStoreService, 'hasUpdatePermission').mockReturnValue(of(updatePermission));
    jest.spyOn(structureStoreService, 'getSelectedOutlet').mockReturnValue(of(structureOutlet));
    jest
      .spyOn(structureStoreService, 'getSelectedOutletBrands')
      .mockReturnValue(of(structureOutletBrands));
    jest.spyOn(brandService, 'getAll').mockReturnValue(of(allBrands));
  });

  test('should be created', () => {
    expect(component).toBeTruthy();
    expect(structureStoreService).toBeTruthy();
    expect(brandService).toBeTruthy();
    expect(outletTreeNavigationService).toBeTruthy();
  });

  describe('ngOnInit should', () => {
    test('set values from store', () => {
      component.ngOnInit();

      expect(component.hasUserUpdatePermission).toBe(updatePermission);
      expect(component.selectedOutletNode).toStrictEqual(structureOutlet);
      expect(component.selectedOutletBrands).toStrictEqual(structureOutletBrands);
      expect(component.allBrands).toStrictEqual(allBrands);
    });

    test('init only default menu items - without toggle affiliate', () => {
      const expectedMenuItems: MenuItem[] = defaultMenuItems;

      component.ngOnInit();

      expect(component.selectedOutletMenuItems).toStrictEqual(expectedMenuItems);
    });

    test('init default menu items and toggle affiliate item with MARK-option', () => {
      const menuItemMarkAffiliate: MenuItem = {
        label: 'MARK_AS_AFFILIATE_OF_DAIMLER',
        action: 'USER_ACTION_TOGGLE_AFFILIATE_STATE'
      };

      const menuItemsExpected: MenuItem[] = [menuItemMarkAffiliate, ...defaultMenuItems];

      component.toggleAffiliate = { isActive: true, isAffiliate: false };
      component.ngOnInit();

      expect(component.selectedOutletMenuItems).toStrictEqual(menuItemsExpected);
    });

    test('init default menu items and toggle affiliate item with UNMARK-option', () => {
      const menuItemUnmarkAffiliate: MenuItem = {
        label: 'UNMARK_AS_AFFILIATE_OF_DAIMLER',
        action: 'USER_ACTION_TOGGLE_AFFILIATE_STATE'
      };

      const menuItemsExpected: MenuItem[] = [menuItemUnmarkAffiliate, ...defaultMenuItems];

      component.toggleAffiliate = { isActive: true, isAffiliate: true };
      component.ngOnInit();

      expect(component.selectedOutletMenuItems).toStrictEqual(menuItemsExpected);
    });
  });

  describe('ngAfterViewInit should', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    test('call structureActionService.dispatchLoadOutletStructures if component was changed', fakeAsync(() => {
      component.changed = of(true);

      component.ngAfterViewInit();
      tick(600);

      expect(structureActionService.dispatchLoadOutletStructures).toHaveBeenCalledWith(
        businessSiteId
      );
    }));

    test('NOT call structureActionService.dispatchLoadOutletStructures if component was not changed', fakeAsync(() => {
      component.changed = of(false);

      component.ngAfterViewInit();
      tick(600);

      expect(structureActionService.dispatchLoadOutletStructures).toHaveBeenCalledTimes(0);
    }));
  });

  describe('menuItemClicked should', () => {
    beforeEach(() => {
      component.ngOnInit();

      jest.spyOn(outletTreeNavigationService, 'createMarketStructureForOutlet');
      jest.spyOn(outletTreeNavigationService, 'removeAllSubletsFromMarketStructure');
      jest.spyOn(outletTreeNavigationService, 'removeOutletFromMarketStructure');
      jest.spyOn(outletTreeNavigationService, 'makeOutletSubletOf');
    });

    test('call outletTreeNavigationService.createMarketStructureForOutlet on menu action MAKE_MAIN_OUTLET', () => {
      const menuActionMakeMainOutlet: MenuAction = { action: 'USER_ACTION_MAKE_MAIN_OUTLET' };
      component.menuItemClicked(menuActionMakeMainOutlet);

      expect(outletTreeNavigationService.createMarketStructureForOutlet).toHaveBeenCalledWith(
        businessSiteId,
        structureOutlet.subOutlet
      );
    });

    test('call outletTreeNavigationService.removeAllSubletsFromMarketStructure on menu action REMOVE_ALL_SUBLETS', () => {
      const menuActionRemoveAllSublets: MenuAction = { action: 'USER_ACTION_REMOVE_ALL_SUBLETS' };
      component.menuItemClicked(menuActionRemoveAllSublets);

      expect(outletTreeNavigationService.removeAllSubletsFromMarketStructure).toHaveBeenCalledWith(
        businessSiteId
      );
    });

    test('call outletTreeNavigationService.removeOutletFromMarketStructure on menu action DETACH_FROM_MARKET_STRUCTURE', () => {
      const menuActionRemoveOutlet: MenuAction = {
        action: 'USER_ACTION_DETACH_FROM_MARKET_STRUCTURE'
      };
      component.menuItemClicked(menuActionRemoveOutlet);

      expect(outletTreeNavigationService.removeOutletFromMarketStructure).toHaveBeenCalledWith(
        businessSiteId,
        structureOutlet.mainOutlet,
        structureOutlet.subOutlet
      );
    });

    test('call outletTreeNavigationService.makeOutletSubletOf on menu action MAKE_SUBLET_OF', () => {
      const targetBusinessSiteId = 'GS78901';
      const menuActionMakeSubletOf: MenuAction = {
        action: 'USER_ACTION_MAKE_SUBLET_OF',
        param: targetBusinessSiteId
      };
      component.menuItemClicked(menuActionMakeSubletOf);

      expect(outletTreeNavigationService.makeOutletSubletOf).toHaveBeenCalledWith(
        structureOutlet,
        targetBusinessSiteId
      );
    });

    test('emit @Output toggleAffiliateRequested on menu action TOGGLE_AFFILIATE_STATE', () => {
      let affiliateRequestedOutput = '';
      const menuActionToggleAffiliate: MenuAction = {
        action: 'USER_ACTION_TOGGLE_AFFILIATE_STATE'
      };

      component.toggleAffiliateRequested.subscribe(
        (requested: string) => (affiliateRequestedOutput = requested)
      );
      component.menuItemClicked(menuActionToggleAffiliate);

      expect(affiliateRequestedOutput).toBe(businessSiteId);
    });
  });

  describe('outletNodeClicked should', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    test('route to new outlet if route and route path exists with :outletId params', () => {
      component.outletNodeClicked('GS1');

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/outlet/GS1/edit'], expect.anything());
    });

    test('route to new outlet even if route path is empty but route path start with /outlet', () => {
      let activatedRoute: ActivatedRouteStub = TestBed.inject<any>(ActivatedRoute);
      activatedRoute.updatePath('');

      component.outletNodeClicked('GS1');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/outlet/GS1/services'], expect.anything());
    });
  });
});
