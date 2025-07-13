import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { TaskData } from 'app/tasks/task.model';
import { combineLatest, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';

import { BusinessSiteStoreService } from '../../businessSite/services/business-site-store.service';
import { Outlet } from '../../shared/models/outlet.model';
import * as fromLegalInformation from '../../store';
import { LegalBusinessSite, LegalCompany, LegalContract } from '../model/legal-information.model';
import {
  ContractStatusActions,
  LegalInformationActions,
  SavingStatusActions
} from '../store/actions';
import { LegalInformationStoreGuard } from '../store/legal-information-store.guard';
import {
  selectLegalContracts,
  selectLegalInfoBusinessSite,
  selectLegalInfoCompany
} from '../store/selectors';
import {
  BusinessSiteInfoState,
  CompanyInfoState,
  ContractState,
  LegalContractStatus
} from '../store/state.model';

@Injectable()
export class LegalInformationActionService {
  private businessSiteAction = new Subject<Action>();
  private companyAction = new Subject<Action>();

  constructor(
    private store: Store<fromLegalInformation.State>,
    private storeGuard: LegalInformationStoreGuard,
    private outletStoreService: BusinessSiteStoreService
  ) {
    this.setDebouceTime(this.businessSiteAction, 500);
    this.setDebouceTime(this.companyAction, 500);
  }

  dispatchResetSavingStatus(): void {
    this.store.dispatch(SavingStatusActions.resetSavingStatus());
  }

  dispatchLoadAction(outletId: string): void {
    this.storeGuard.dispatchAction(outletId).pipe(take(1)).subscribe();
  }

  dispatchSaveAction(taskData?: TaskData): void {
    combineLatest([
      this.store.pipe(select(selectLegalInfoCompany)),
      this.store.pipe(select(selectLegalInfoBusinessSite)),
      this.store.pipe(select(selectLegalContracts)),
      this.outletStoreService.getOutlet()
    ])
      .pipe(take(1))
      .subscribe((data: [CompanyInfoState, BusinessSiteInfoState, ContractState[], Outlet]) => {
        const [company, businessSite, contracts, outlet] = data;
        const shouldDispatchContracts = (contracts ?? []).some(
          contract => contract.status !== LegalContractStatus.DEFAULT
        );

        const correlationId = shouldDispatchContracts ? contracts.length : -1;

        this.store.dispatch(
          LegalInformationActions.saveLegalInformation({
            correlationId: correlationId,
            businessSiteId: outlet.id,
            companyId: outlet.companyId,
            companyVatNumber: company.companyVatNumber,
            legalFooter: company.legalFooter,
            legalFooterAdditionalTranslations: company.legalFooterAdditionalTranslations,
            nationalTaxNumber: businessSite.nationalTaxNumber,
            taskData
          })
        );

        if (shouldDispatchContracts) {
          this.store.dispatch(
            ContractStatusActions.saveContractStatus({
              correlationId: correlationId,
              businessSiteId: outlet.id,
              contractStatus: contracts.filter(
                contract => contract.status !== LegalContractStatus.REMOVED
              )
            })
          );
        }
      });
  }

  dispatchCancelAction(outletId: string): void {
    this.dispatchLoadAction(outletId);
  }

  dispatchAddContractStatusAction(): void {
    this.store.dispatch(ContractStatusActions.addContractStatus());
  }

  dispatchRemoveContractStatusAction(contractId: number): void {
    this.store.dispatch(ContractStatusActions.removeContractStatus({ contractId }));
  }

  dispatchUpdateContractStatusAction(legalContract: LegalContract): void {
    this.companyAction.next(ContractStatusActions.updateContractStatus({ legalContract }));
  }

  dispatchUpdateLegalBusinessSiteAction(legalBusinessSite: LegalBusinessSite): void {
    this.businessSiteAction.next(
      LegalInformationActions.updateLegalBusinessSite(legalBusinessSite)
    );
  }

  dispatchUpdateLegalCompanyAction(legalCompany: LegalCompany): void {
    this.companyAction.next(
      LegalInformationActions.updateLegalCompany({
        id: legalCompany.id,
        vatNumber: legalCompany.vatNumber,
        legalFooter: legalCompany.legalFooter
      })
    );
  }

  private setDebouceTime(subject: Subject<Action>, time: number): void {
    subject
      .pipe(debounceTime(time), distinctUntilChanged())
      .subscribe(action => this.store.dispatch(action));
  }
}
