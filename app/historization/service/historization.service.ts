import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { ApiService } from '../../shared/services/api/api.service';
import {
  MasterDataBrands,
  MasterDataCountry,
  MasterDataKeyTypes,
  MasterDataLabels,
  MasterDataLanguage,
  MasterDataOutletRelationships,
  MasterDataProductGroup,
  MasterDataService,
  MasterDataCloseDownReason
} from '../models/master-data-history-snapshot.model';
import {
  OfferedServiceValidity,
  OutletHistorySnapshot
} from '../models/outlet-history-snapshot.model';
import { RelationshipDefination } from  '../models/outletRelationship-relationship-defination.model';

export const Url = environment.settings.enableHistorizationPostgres
  ? '/historization/api/v1/postgres/business-sites/summary/'
  : '/historization/api/v1/business-sites/';

export const historizationServiceBaseUrl = '/historization/api/v1/postgres';

@Injectable()
export class HistorizationService {
  constructor(private apiService: ApiService) {}

  get(businessSiteId: string): Observable<OutletHistorySnapshot> {
    return this.apiService.get<OutletHistorySnapshot>(Url + businessSiteId + '/group?groupBy=DAY');
  }

  getOfferedServiceValidity(
    businessSiteId: string,
    offeredServiceId: string,
    date: string
  ): Observable<OfferedServiceValidity> {
    return this.apiService.get<OfferedServiceValidity>(
      Url + businessSiteId + '/' + offeredServiceId + '/validity?date=' + date
    );
  }

  getMasterDataCountry(countryId: string, historyDate: string): Observable<MasterDataCountry> {
    return this.apiService.get<MasterDataCountry>(`${historizationServiceBaseUrl}/country/${countryId}/${historyDate}`);
  }

  getMasterDataBrand(brandId: string, historyDate: string): Observable<MasterDataBrands> {
    return this.apiService.get<MasterDataBrands>(`${historizationServiceBaseUrl}/brand/${brandId}/${historyDate}`);
  }

  getMasterDataOutletRelationship(outletRelationshipId: string, historyDate: string): Observable<MasterDataOutletRelationships>{
    return this.apiService.get<MasterDataOutletRelationships>(`${historizationServiceBaseUrl}/outlet-relationship/${RelationshipDefination[outletRelationshipId] || outletRelationshipId}/${historyDate}`);
  }

  getMasterDataProductGroup(productGroupId: string, historyDate: string): Observable<MasterDataProductGroup> {
    return this.apiService.get<MasterDataProductGroup>(`${historizationServiceBaseUrl}/productGroup/${productGroupId}/${historyDate}`);
  }

  getMasterDataLabel(labelId: string, historyDate: string): Observable<MasterDataLabels> {
    return this.apiService.get<MasterDataLabels>(`${historizationServiceBaseUrl}/label/${labelId}/${historyDate}`);
  }

  getMasterDataLanguage(languageId: string, historyDate: string): Observable<MasterDataLanguage> {
    return this.apiService.get<MasterDataLanguage>(`${historizationServiceBaseUrl}/language/${languageId}/${historyDate}`);
  }

  getMasterDataKeyType(keyTypeId: string, historyDate: string): Observable<MasterDataKeyTypes> {
    return this.apiService.get<MasterDataKeyTypes>(`${historizationServiceBaseUrl}/keyType/${keyTypeId}/${historyDate}`);
  }

  getMasterDataService(serviceId: number, historyDate: string): Observable<MasterDataService> {
    return this.apiService.get<MasterDataService>(`${historizationServiceBaseUrl}/service/${serviceId}/${historyDate}`)
  }
  
  getMasterDataCloseDownReason(closeDownReasonId: number, historyDate: string): Observable<MasterDataCloseDownReason> {
    return this.apiService.get<MasterDataCloseDownReason>(`${historizationServiceBaseUrl}/close-down-reason/${closeDownReasonId}/${historyDate}`);
  }
}
