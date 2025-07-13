import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { ApiService } from '../../../shared/services/api/api.service';

import {MasterOutletRelationship} from "./master-outlet-relationship.model";
import {map} from "rxjs/operators";

const url = '/traits/api/v1/outlet-relationship';

export interface MasterOutletRelationshipResponse {
  outletRelationships: MasterOutletRelationship[];
}

@Injectable()
export class MasterOutletRelationshipService {
  constructor(private apiService: ApiService) {}

  create(outletRelationship: MasterOutletRelationship): Observable<any> {
    return this.apiService.post(url, outletRelationship);
  }

  get(outletRelationshipId: string): Observable<MasterOutletRelationship> {
    return this.apiService.get<MasterOutletRelationship>(url + '/' + outletRelationshipId);
  }

  getAll(): Observable<MasterOutletRelationship[]> {
    return this.apiService
      .get<MasterOutletRelationshipResponse>(url+'s')
      .pipe(map((response: MasterOutletRelationshipResponse) => response.outletRelationships));
  }

  update(outletRelationship: MasterOutletRelationship): Observable<any> {
    return this.apiService.put(url + '/' + outletRelationship.id, outletRelationship);
  }
  delete(outletRelationshipId: string): Observable<any> {
    return this.apiService.delete(url + '/' + outletRelationshipId);
  }
}
