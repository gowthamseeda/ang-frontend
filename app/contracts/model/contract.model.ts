import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

import { BrandProductGroupsData } from '../../services/shared/components/brand-product-groups-data-table/brand-product-groups-data-table.component';

import { Address } from './address.model';
import { BrandProductGroupId } from './brand-product-group-id.model';
import { BusinessSite } from './business-site.model';
import { Company } from './company.model';
import { OfferedService } from './offered-service.model';

export interface ContractPartners {
  contractor: BusinessSite & Company;
  contractee: BusinessSite & Address;
}

export interface Contract extends ContractPartners {
  offeredService: OfferedService;
}

export namespace Contract {
  export function filterBy(
    productCategoryId: number,
    serviceId: number,
    serviceCharacteristicId?: number
  ): OperatorFunction<Contract[], Contract[]> {
    return map((contracts: Contract[]) =>
      contracts.filter(
        contract =>
          contract.offeredService.productCategoryId === productCategoryId &&
          contract.offeredService.serviceId === serviceId &&
          contract.offeredService.serviceCharacteristicId === serviceCharacteristicId
      )
    );
  }

  export function mapToBrandProductGroupIds(contracts: Contract[]): BrandProductGroupId[] {
    return contracts.map(
      contract =>
        ({
          brandId: contract.offeredService.brandId,
          productGroupId: contract.offeredService.productGroupId
        } as BrandProductGroupId)
    );
  }

  export function mapToBrandProductGroupsContractees(
    contracts: Contract[]
  ): BrandProductGroupsData<BusinessSite & Address>[] {
    return contracts.reduce((accumulator, current) => {
      const foundContract = accumulator.find(
        contract => contract.data && contract.data.id === current.contractee.id
      );
      if (foundContract !== undefined) {
        foundContract.brandProductGroupIds.push({
          brandId: current.offeredService.brandId,
          productGroupId: current.offeredService.productGroupId
        } as BrandProductGroupId);
      } else {
        accumulator.push({
          data: current.contractee,
          brandProductGroupIds: [
            {
              brandId: current.offeredService.brandId,
              productGroupId: current.offeredService.productGroupId
            }
          ]
        } as BrandProductGroupsData<BusinessSite & Address>);
      }
      return accumulator;
    }, [] as BrandProductGroupsData<BusinessSite & Address>[]);
  }
}
