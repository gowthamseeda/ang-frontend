import { Injectable } from '@angular/core';

import { OutletResult } from '../../../search/shared/outlet-result/outlet-result.model';
import { replaceAll } from '../../../shared/util/strings';
import { OutletDetails } from '../models/outlet.model';

const HIGHLIGHT_MARKER = '***';

@Injectable()
export class OutletSearchService {
  convertToOutletDetails(outletResult: OutletResult): OutletDetails {
    Object.keys(outletResult).forEach(key => {
      if (typeof outletResult[key] === 'string') {
        outletResult[key] = replaceAll(outletResult[key], HIGHLIGHT_MARKER, '');
      }
    });

    return {
      outletId: outletResult.id,
      companyId: outletResult.companyId,
      legalName: outletResult.legalName,
      isRegisteredOffice: outletResult.registeredOffice,
      city: outletResult.city,
      countryName: outletResult.countryName,
      state: outletResult.state,
      streetNumber: outletResult.streetNumber,
      street: outletResult.street,
      zipCode: outletResult.zipCode,
      isActive: outletResult.active
    };
  }
}
