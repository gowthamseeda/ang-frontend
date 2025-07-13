import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { LegalStructureRoutingService } from '../legal-structure/legal-structure-routing.service';
import { ApiService } from '../shared/services/api/api.service';
import { ObjectStatus } from '../shared/services/api/objectstatus.model';

import {
  GeneralCommunicationData,
  NoChangeCommunicationData,
  ServiceCommunicationData
} from './model/communication-data.model';
import { CommunicationField } from './model/communication-field.model';
import { OfferedService } from './model/offered-service.model';
import { OfferedServiceService } from '../services/offered-service/offered-service.service';

const url = 'communications/api/v1';

interface CommunicationFieldResponse {
  communicationFields: CommunicationField[];
}

interface ServiceCommunicationDataResponse {
  communicationData: ServiceCommunicationData[];
}

interface GeneralCommunicationDataResponse {
  communicationData: GeneralCommunicationData[];
}

interface SpokenLanguageResponse {
  spokenLanguageIds: string[];
}

export interface ServiceCommunicationUpdateResponse {
  success: ServiceCommunicationUpdateItemResponse[];
  fail: ServiceCommunicationUpdateItemResponse[];
}

export interface ServiceCommunicationUpdateItemResponse {
  offeredServiceId: string;
  communicationFieldId: string;
  messages: string[] | null;
}

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  constructor(
    private apiService: ApiService,
    private legalStructureRoutingService: LegalStructureRoutingService,
    private offeredServiceService: OfferedServiceService
  ) {}

  getServiceCommunicationDataOfOutlet(): Observable<ServiceCommunicationData[]> {
    return this.legalStructureRoutingService.outletIdChanges.pipe(
      switchMap(outletId => this.getServiceCommunicationDataBy(outletId))
    );
  }

  getGeneralCommunicationDataOfOutlet(): Observable<GeneralCommunicationData[]> {
    return this.legalStructureRoutingService.outletIdChanges.pipe(
      switchMap(outletId => this.getGeneralCommunicationDataBy(outletId))
    );
  }

  getCommunicationFields(): Observable<CommunicationField[]> {
    return this.apiService.get<CommunicationFieldResponse>(`${url}/communication-field`).pipe(
      map(response => response.communicationFields),
      map(communicationFields => communicationFields.sort((a, b) => a.position - b.position))
    );
  }

  getOfferedServicesOfOutlet(): Observable<OfferedService[]> {
    return this.legalStructureRoutingService.outletIdChanges.pipe(
      tap(outletId => this.offeredServiceService.fetchAllForOutlet(outletId)),
      switchMap(() => this.offeredServiceService.getAll())
    );
  }

  getSpokenLanguageIdsOfOutlet(): Observable<string[]> {
    return this.legalStructureRoutingService.outletIdChanges.pipe(
      switchMap(outletId =>
        this.apiService
          .get<SpokenLanguageResponse>(`${url}/business-sites/${outletId}/spoken-languages`)
          .pipe(map(spokenLanguagesResponse => spokenLanguagesResponse?.spokenLanguageIds ?? []))
      )
    );
  }

  updateServiceCommunicationData(
    communicationData: ServiceCommunicationData[],
    noChangeCommunicationData?: NoChangeCommunicationData
  ): Observable<ServiceCommunicationUpdateResponse> {
    return this.legalStructureRoutingService.outletIdChanges.pipe(
      take(1),
      switchMap(outletId =>
        this.updateServiceCommunicationDataOf(
          outletId,
          communicationData,
          noChangeCommunicationData
        )
      )
    );
  }

  updateGeneralCommunicationData(
    communicationData: GeneralCommunicationData[]
  ): Observable<ObjectStatus> {
    communicationData.map(this.convert);

    return this.legalStructureRoutingService.outletIdChanges.pipe(
      take(1),
      switchMap(outletId => this.updateGeneralCommunicationDataOf(outletId, communicationData))
    );
  }

  updateSpokenLanguageIdsOfOutlet(spokenLanguageIds: string[]): Observable<ObjectStatus> {
    return this.legalStructureRoutingService.outletIdChanges.pipe(
      take(1),
      switchMap(businessSiteId => {
        return this.apiService.put(`${url}/business-sites/${businessSiteId}/spoken-languages`, {
          spokenLanguageIds: spokenLanguageIds
        });
      })
    );
  }

  private updateServiceCommunicationDataOf(
    businessSiteId: string,
    communicationData: ServiceCommunicationData[],
    noChangeCommunicationData?: NoChangeCommunicationData
  ): Observable<any> {
    return this.apiService.put(`${url}/business-sites/${businessSiteId}/communication-data`, {
      communicationData,
      noChangeCommunicationData
    });
  }

  private updateGeneralCommunicationDataOf(
    businessSiteId: string,
    communicationData: GeneralCommunicationData[]
  ): Observable<ObjectStatus> {
    return this.apiService.put(
      `${url}/business-sites/${businessSiteId}/general-communication-data`,
      {
        communicationData
      }
    );
  }

  private getServiceCommunicationDataBy(
    businessSiteId: string
  ): Observable<ServiceCommunicationData[]> {
    return this.apiService
      .get<ServiceCommunicationDataResponse>(
        `${url}/business-sites/${businessSiteId}/communication-data`
      )
      .pipe(
        map(response => {
          if (response !== null) {
            return response.communicationData;
          } else {
            return [];
          }
        })
      );
  }

  private getGeneralCommunicationDataBy(
    businessSiteId: string
  ): Observable<GeneralCommunicationData[]> {
    return this.apiService
      .get<GeneralCommunicationDataResponse>(
        `${url}/business-sites/${businessSiteId}/general-communication-data`
      )
      .pipe(
        map(response => {
          if (response !== null) {
            return response.communicationData;
          } else {
            return [];
          }
        })
      );
  }

  private convert(generalCommunicationData: GeneralCommunicationData): GeneralCommunicationData {
    if (generalCommunicationData.brandId === 'BRANDLESS') {
      generalCommunicationData.brandId = undefined;
    }
    return generalCommunicationData;
  }
}
