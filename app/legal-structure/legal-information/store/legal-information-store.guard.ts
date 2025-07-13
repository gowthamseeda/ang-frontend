import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { BusinessSiteStoreService } from '../../businessSite/services/business-site-store.service';
import { paramOutletId } from '../../legal-structure-routing-paths';
import * as fromLegalStructure from '../../store';

import { ContractStatusActions, LegalInformationActions } from './actions';

@Injectable()
export class LegalInformationStoreGuard implements CanActivate {
  constructor(
    private store: Store<fromLegalStructure.State>,
    private userAuthorizationService: UserAuthorizationService,
    private businessSiteStoreService: BusinessSiteStoreService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const outletId = route.paramMap.get(paramOutletId);
    return this.dispatchAction(outletId ? outletId : '');
  }

  dispatchAction(outletId: string): Observable<boolean> {
    return this.businessSiteStoreService.getOutlet().pipe(
      distinctUntilChanged(),
      switchMap(outlet => {
        return this.userAuthorizationService.isAuthorizedFor
          .permissions(['traits.contractstatus.read'])
          .country(outlet.countryId)
          .verify()
          .pipe(
            tap(isAuthorized => {
              this.store.dispatch(
                LegalInformationActions.loadLegalInformation({
                  outletId: outletId,
                  companyId: outlet.companyId
                })
              );
              if (isAuthorized) {
                this.store.dispatch(
                  ContractStatusActions.loadContractStatus({
                    outletId: outletId,
                    companyId: outlet.companyId
                  })
                );
              }
            }),
            map(() => true)
          );
      })
    );
  }
}
