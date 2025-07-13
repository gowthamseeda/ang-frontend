import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

import { BrandProductGroupValidity } from '../../services/offered-service/brand-product-group-validity.model';
import { Validity } from '../../services/validity/validity.model';

import { BrandProductGroupId } from './brand-product-group-id.model';

interface OfferedServiceCompositeId extends BrandProductGroupId {
  productCategoryId: number;
  serviceId: number;
  serviceCharacteristicId?: number;
}

export interface OfferedService extends OfferedServiceCompositeId {
  id: string;
  service?: string;
  serviceCharacteristic?: string;
  validity?: Validity;
}

export namespace OfferedService {
  export function filterBy(
    productCategoryId: number,
    serviceId: number,
    serviceCharacteristicId?: number
  ): OperatorFunction<OfferedService[], OfferedService[]> {
    return map((offeredServices: OfferedService[]) =>
      offeredServices.filter(
        offeredService =>
          offeredService.productCategoryId === productCategoryId &&
          offeredService.serviceId === serviceId &&
          offeredService.serviceCharacteristicId === serviceCharacteristicId
      )
    );
  }

  export function mapToBrandProductGroupIds(
    offeredServices: OfferedService[]
  ): BrandProductGroupId[] {
    return offeredServices.map(
      offeredService =>
        ({
          brandId: offeredService.brandId,
          productGroupId: offeredService.productGroupId
        } as BrandProductGroupId)
    );
  }

  export function mapToBrandProductGroupValidities(
    offeredServices: OfferedService[]
  ): BrandProductGroupValidity[] {
    return offeredServices.map(
      offeredService =>
        ({
          brandId: offeredService.brandId,
          productGroupId: offeredService.productGroupId,
          validity: offeredService.validity
        } as BrandProductGroupId)
    );
  }

  export function compareBy(
    productCategoryId: number,
    brandId: string,
    productGroupId: string,
    serviceId: number,
    serviceCharacteristicId?: number
  ): (offeredService: OfferedService) => boolean {
    return (offeredService: OfferedService) =>
      offeredService.productCategoryId === productCategoryId &&
      offeredService.serviceId === serviceId &&
      offeredService.serviceCharacteristicId === serviceCharacteristicId &&
      offeredService.brandId === brandId &&
      offeredService.productGroupId === productGroupId;
  }
}
