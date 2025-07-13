import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../shared/services/api/api.service';
import { Contract } from './model/contract.model';
import { OfferedService } from './model/offered-service.model';
import { BusinessSite } from './model/business-site.model';
import { Address } from './model/address.model';
import { Company } from './model/company.model';

const url = '/contracts/api/v1/business-sites';

interface ContractsResponse {
  contracts: Contract[];
}

interface OfferedServicesResponse {
  offeredServices: OfferedService[];
}

export interface OutletResponse {
  outletId: string;
  companyId: string;
  legalName: string;
  nameAddition: string;
  street: string;
  streetNumber: string;
  zipCode: string;
  city: string;
  addressAddition: string;
  district: string;
  state: string;
  province: string;
  country: string;
}

export interface UpdateContract {
  offeredServiceId: string;
  contracteeId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContractsDataService {
  constructor(private apiService: ApiService) {}

  get(contractorId: string): Observable<Contract[]> {
    return this.apiService
      .get<ContractsResponse>(`${url}/${contractorId}/contracts`)
      .pipe(map(response => response.contracts));
  }

  update(outletId: string, contracts: UpdateContract[]): Observable<any> {
    return this.apiService.put(`${url}/${outletId}/contracts`, { contracts });
  }

  getOfferedServices(contractorId: string): Observable<OfferedService[]> {
    return this.apiService
      .get<OfferedServicesResponse>(`${url}/${contractorId}/offered-services`)
      .pipe(map(response => response.offeredServices));
  }

  getContractor(contractorId: string): Observable<BusinessSite & Company> {
    return this.getOutlet(contractorId).pipe(
      map(outlet => ({
        id: outlet.outletId,
        legalName: outlet.legalName,
        companyId: outlet.companyId
      }))
    );
  }

  getContractee(contracteeId: string): Observable<BusinessSite & Address> {
    return this.getOutlet(contracteeId).pipe(
      map(outlet => ({
        id: outlet.outletId,
        legalName: outlet.legalName,
        street: outlet.street,
        streetNumber: outlet.streetNumber,
        zipCode: outlet.zipCode,
        city: outlet.city,
        country: outlet.country
      }))
    );
  }

  private getOutlet(outletId: string): Observable<OutletResponse> {
    return this.apiService.get<OutletResponse>(`${url}/${outletId}`);
  }
}
