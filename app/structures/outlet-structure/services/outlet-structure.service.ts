import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import * as fromStructure from '../../store';
import { MenuItem } from '../container/outlet-tree-navigation/outlet-tree-navigation-menu-item.model';
import { Company } from '../model/company.model';
import { OutletStructureOutlets } from '../model/outlet-structure.model';
import { FlatStructureNode } from '../presentational/outlet-structure-tree/model/flat-structure-node.model';
import {
  selectActiveFlattenOutlets,
  selectAllFlattenOutlets,
  selectAvailableActionsOfSelectedStructureNode,
  selectCompany,
  selectFirstTwoBrandsOfSelectedOutlet,
  selectInitializedState,
  selectIsOutletStructureLoadingState,
  selectMarketStructureTag,
  selectOutletBrandState,
  selectSelectedOutlet,
  selectSelectedOutletIndex,
  selectSiblingOutletIds,
  selectSubletIds,
  selectSubletParentId
} from '../store/selectors';
import { RETAILER_ROLE } from '../../../help/help.constants';
import { UserService } from '../../../iam/user/user.service';

@Injectable({ providedIn: 'root' })
export class OutletStructureService {
  constructor(
    private store: Store<fromStructure.State>,
    private userService: UserService,
    private userAuthorizationService: UserAuthorizationService
  ) {}

  isInitializedFor(outletId: string): Observable<boolean> {
    return this.store.pipe(select(selectInitializedState, { outletId: outletId }));
  }

  getSelectedOutlet(): Observable<OutletStructureOutlets | undefined> {
    return this.store.pipe(select(selectSelectedOutlet));
  }

  hasUpdatePermission(): Observable<boolean> {
    return this.store.pipe(
      select(selectSelectedOutlet),
      switchMap((outletStructureOutlets: OutletStructureOutlets) => {
        return this.userAuthorizationService.isAuthorizedFor
          .permissions([
            'legalstructure.businesssite.update',
            'structures.marketstructure.create',
            'structures.marketstructure.update',
            'structures.marketstructure.delete'
          ])
          .businessSite(outletStructureOutlets?.businessSiteId)
          .country(outletStructureOutlets?.countryId)
          .distributionLevels(outletStructureOutlets?.distributionLevels ?? [])
          .verify();
      })
    );
  }

  getFlattenOutlets(): Observable<FlatStructureNode[]> {
    return this.userService
      .getRoles()
      .pipe(
        mergeMap(roles =>
          roles.includes(RETAILER_ROLE)
            ? this.store.pipe(select(selectActiveFlattenOutlets))
            : this.store.pipe(select(selectAllFlattenOutlets))
        )
      );
  }

  getCompany(): Observable<Company | undefined> {
    return this.store.pipe(select(selectCompany));
  }

  getIsLoading(): Observable<boolean> {
    return this.store.pipe(select(selectIsOutletStructureLoadingState));
  }

  getSelectedOutletMarketStructureTags(): Observable<string[]> {
    return this.store.pipe(select(selectMarketStructureTag));
  }

  getSelectedOutletBrands(): Observable<string[]> {
    return this.store.pipe(select(selectOutletBrandState));
  }

  getSelectedOutletIndex(): Observable<number> {
    return this.store.pipe(select(selectSelectedOutletIndex));
  }

  getAvailableActionsOfSelectedOutlet(): Observable<MenuItem[]> {
    return this.store.pipe(select(selectAvailableActionsOfSelectedStructureNode));
  }

  getSiblingOutletIds(outletId: string): Observable<string[]> {
    return this.store.pipe(select(selectSiblingOutletIds, { outletId }));
  }

  getSubletIds(outletId: string): Observable<string[]> {
    return this.store.pipe(select(selectSubletIds, { outletId }));
  }

  getSubletParentId(outletId: string): Observable<string> {
    return this.store.pipe(select(selectSubletParentId, { outletId }));
  }

  getFirstTwoBrandCodesOfSelectedOutlet(): Observable<string[]> {
    return this.store.pipe(select(selectFirstTwoBrandsOfSelectedOutlet));
  }
}
