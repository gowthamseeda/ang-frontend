import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

import { BrandProductGroup } from '../brand-product-group/brand-product-group.model';
import { OfferedServiceValidity, Validity } from '../validity/validity.model';

export interface OfferedService extends BrandProductGroup {
  id: string;
  productCategoryId: number;
  serviceId: number;
  onlineOnly?: boolean;
  seriesIds?: number[];
  modelSeriesIds?: string[];
  validity?: Validity;
  openingHours?: OpeningHour[];
  communications?: Communications[];
  contracts?: Contracts[];
  businessSite?: BusinessSite;
}

export interface BusinessSite {
  id: string;
  countryId?: string;
  distributionLevels?: string[];
}

export interface OpeningHour {
  id: number;
  day: string;
  times?: OpeningHourTime[];
  startDate?: string;
  endDate?: string;
}

export interface Communications {
  communicationFieldId: string;
  value: string;
}

export interface Contracts {
  contracteeId: string;
}
export interface OpeningHourTime {
  begin: string;
  end: string;
}

export namespace OfferedService {
  export function mapToProductGroups(): OperatorFunction<OfferedService[], BrandProductGroup[]> {
    return map((offeredServices: OfferedService[]) =>
      offeredServices.map(
        ({ brandId, productGroupId }) => ({ brandId, productGroupId } as BrandProductGroup)
      )
    );
  }

  export function mapToValidities(): OperatorFunction<OfferedService[], OfferedServiceValidity[]> {
    return map((offeredServices: OfferedService[]) =>
      offeredServices.map(offeredService => {
        const { id, validity } = offeredService;
        return new OfferedServiceValidity({
          id,
          validity
        });
      })
    );
  }

  export function mapToValiditiesWithBrandProductGroup(): OperatorFunction<
    OfferedService[],
    (OfferedServiceValidity & BrandProductGroup)[]
  > {
    return map((offeredServices: OfferedService[]) =>
      offeredServices.map(offeredService => {
        return {
          id: offeredService.id,
          brandId: offeredService.brandId,
          productCategoryId: offeredService.productCategoryId,
          productGroupId: offeredService.productGroupId,
          onlineOnly: offeredService.onlineOnly,
          seriesIds: offeredService.seriesIds,
          modelSeriesIds: offeredService.modelSeriesIds,
          validity: offeredService.validity,
          openingHours: offeredService.openingHours,
          serviceId: offeredService.serviceId
        } as OfferedServiceValidity & BrandProductGroup;
      })
    );
  }
}
