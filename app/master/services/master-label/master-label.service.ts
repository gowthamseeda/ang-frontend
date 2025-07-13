import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

import { ApiService } from '../../../shared/services/api/api.service';

import { MasterLabel } from './master-label.model';

const url = '/traits/api/v1/labels';

export interface MasterLabelResponse {
  labels: MasterLabel[];
}

@Injectable()
export class MasterLabelService {
  constructor(private apiService: ApiService) {}

  get(labelId: string): Observable<MasterLabel> {
    return this.apiService.get<MasterLabel>(url + '/' + labelId);
  }

  getAll(): Observable<MasterLabel[]> {
    return this.apiService
      .get<MasterLabelResponse>(url)
      .pipe(map((response: MasterLabelResponse) => response.labels));
  }

  delete(labelId: number): Observable<any> {
    return this.apiService.delete(url + '/' + labelId);
  }

  create(label: MasterLabel): Observable<any> {
    return this.apiService.post(url, label);
  }

  update(label: MasterLabel): Observable<any> {
    return this.apiService.put(url + '/' + label.id, label);
  }
}
