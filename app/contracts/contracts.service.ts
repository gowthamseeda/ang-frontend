import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { LegalStructureRoutingService } from '../legal-structure/legal-structure-routing.service';

import { ContractsDataService } from './contracts.data-service';
import { BrandProductGroupId } from './model/brand-product-group-id.model';
import { BusinessSite } from './model/business-site.model';
import { Company } from './model/company.model';
import { Contract } from './model/contract.model';
import { OfferedService } from './model/offered-service.model';
import { ContractsServiceActions } from './store/actions';
import { AddContract } from './store/actions/contracts.service-actions';
import { ContractState } from './store/reducers';
import * as contractsSelector from './store/selectors/contracts.selectors';
import * as offeredServiceSelector from './store/selectors/offered-services.selectors';
import compareOfferedServiceBy = OfferedService.compareBy;

@Injectable({
  providedIn: 'root'
})
export class ContractsService {
  constructor(
    private store: Store<ContractState>,
    private legalStructureRoutingService: LegalStructureRoutingService,
    private contractsDataService: ContractsDataService
  ) {
    this.legalStructureRoutingService.outletIdChanges.subscribe(contractorId => {
      if (contractorId) {
        this.loadContracts(contractorId);
        this.loadOfferedServices(contractorId);
      }
    });
  }

  getOfferedServicesOfContractor(): Observable<OfferedService[]> {
    return this.store.pipe(select(offeredServiceSelector.selectAll));
  }

  getContractor(): Observable<BusinessSite & Company> {
    return this.legalStructureRoutingService.outletIdChanges.pipe(
      switchMap(outletId => this.contractsDataService.getContractor(outletId))
    );
  }

  getContractsOfContractor(): Observable<Contract[]> {
    return this.store.pipe(select(contractsSelector.selectAll));
  }

  upsertContracts(
    contracteeId: string,
    brandProductGroupIds: BrandProductGroupId[],
    productCategoryId: number,
    serviceId: number,
    serviceCharacteristicId?: number,
    contractor?: BusinessSite & Company
  ) {
    this.getOfferedServicesOfContractor()
      .pipe(take(1))
      .subscribe(offeredServices => {
        if (contractor) {
          const contracts = this.getOfferedServicesBy(
            offeredServices,
            brandProductGroupIds,
            productCategoryId,
            serviceId,
            serviceCharacteristicId
          ).map(
            offeredService =>
              ({
                contractor: contractor,
                contracteeId: contracteeId,
                offeredService: offeredService
              } as AddContract)
          );

          this.store.dispatch(ContractsServiceActions.addContracts({ contracts }));
        } else {
          const contractEntityIds = this.getOfferedServicesBy(
            offeredServices,
            brandProductGroupIds,
            productCategoryId,
            serviceId,
            serviceCharacteristicId
          ).map(offeredService => offeredService.id);

          this.store.dispatch(
            ContractsServiceActions.updateContracts({
              contractEntityIds,
              contracteeId
            })
          );
        }
      });
  }

  deleteContracts(
    brandProductGroupIds: BrandProductGroupId[],
    productCategoryId: number,
    serviceId: number,
    serviceCharacteristicId?: number
  ) {
    this.getOfferedServicesOfContractor()
      .pipe(take(1))
      .subscribe(offeredServices => {
        const contractEntityIds = this.getOfferedServicesBy(
          offeredServices,
          brandProductGroupIds,
          productCategoryId,
          serviceId,
          serviceCharacteristicId
        ).map(offeredService => offeredService.id);

        if (contractEntityIds.length > 0) {
          this.store.dispatch(ContractsServiceActions.removeContracts({ contractEntityIds }));
        }
      });
  }

  saveContracts(contractorId: string) {
    this.store.dispatch(ContractsServiceActions.saveContracts({ contractorId }));
  }

  loadContracts(contractorId: string) {
    this.store.dispatch(ContractsServiceActions.loadContracts({ contractorId }));
  }

  private loadOfferedServices(contractorId: string) {
    this.store.dispatch(ContractsServiceActions.loadOfferedServices({ contractorId }));
  }

  private getOfferedServicesBy(
    offeredServicesSource: OfferedService[],
    brandProductGroupIds: BrandProductGroupId[],
    productCategoryId: number,
    serviceId: number,
    serviceCharacteristicId?: number
  ): OfferedService[] {
    const foundOfferedServices: OfferedService[] = [];

    brandProductGroupIds.forEach(({ brandId, productGroupId }) => {
      const foundOfferedService = offeredServicesSource.find(
        compareOfferedServiceBy(
          productCategoryId,
          brandId,
          productGroupId,
          serviceId,
          serviceCharacteristicId
        )
      );
      if (foundOfferedService) {
        foundOfferedServices.push(foundOfferedService);
      }
    });

    return foundOfferedServices;
  }
}
