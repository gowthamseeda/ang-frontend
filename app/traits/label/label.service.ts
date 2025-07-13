import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

import { ApiService } from '../../shared/services/api/api.service';

import { Label } from './label.model';

interface LabelsResponse {
  labels: Label[];
}

const BASE_URL = '/traits/api/v1/labels';

@Injectable({ providedIn: 'root' })
export class LabelService {
  private labelsSubject: ReplaySubject<LabelsResponse>;

  constructor(private apiService: ApiService) {}

  getAllAssignable(assignableType: string): Observable<Label[]> {
    return this.initializedCache().pipe(
      map(result =>
        result.labels
          .filter(label => !label.assignableTo || label.assignableTo.includes(assignableType))
          .map(
            label =>
              new Label(
                label.id,
                label.name,
                label.translations,
                label.assignableTo,
                label.restrictedToCountryIds,
                label.restrictedToBrandIds,
                label.restrictedToDistributionLevels
              )
          )
      )
    );
  }

  private initializedCache(): Observable<LabelsResponse> {
    if (!this.labelsSubject) {
      this.labelsSubject = new ReplaySubject<LabelsResponse>(1);
      this.apiService
        .get<LabelsResponse>(BASE_URL)
        .subscribe(labelsResponse => this.labelsSubject.next(labelsResponse));
    }
    return this.labelsSubject.asObservable();
  }
}
