import { Injectable } from '@angular/core';
import { Cache } from '../../../shared/util/cache';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

import { ApiService, concatRequests } from '../../../shared/services/api/api.service';
import { Brand } from '../../brand.model';

import {
  AssignedBrandLabel,
  FlatAssignedBrandLabel,
  GroupedAssignedBrandLabel
} from './assigned-brand-label';

class BrandLabelAssignmentsResponse {
  assignedBrandLabels: AssignedBrandLabel[];
}

@Injectable()
export class AssignedBrandLabelsService {
  private cache: Cache<BrandLabelAssignmentsResponse>;

  constructor(private apiService: ApiService) {
    this.cache = new Cache<BrandLabelAssignmentsResponse>(this.apiService, this.buildBaseUrl);
  }

  getBrandLabelAssignments(outletId: string): Observable<AssignedBrandLabel[]> {
    return this.cache
      .getOrLoad(outletId)
      .asObservable()
      .pipe(
        map((brandLabelAssignments: BrandLabelAssignmentsResponse) => {
          return brandLabelAssignments ? brandLabelAssignments.assignedBrandLabels : [];
        })
      );
  }

  save(
    businessSiteId: string,
    creates: FlatAssignedBrandLabel[],
    deletes: FlatAssignedBrandLabel[]
  ): Observable<any> {
    this.cache.clearFor(businessSiteId);

    return concatRequests(
      deletes.map(value =>
        this.apiService.delete(this.buildDeleteUrl(businessSiteId, value.brandId, value.labelId))
      ),
      creates.map(value => this.apiService.post(this.buildBaseUrl(businessSiteId), value))
    );
  }

  getAssignedBrandLabels(
    outletId: string,
    brandRestrictions: string[]
  ): Observable<GroupedAssignedBrandLabel[]> {
    return this.getBrandLabelAssignments(outletId).pipe(
      map((assignedBrandLabels: AssignedBrandLabel[]) =>
        this.groupAssignedBrandLabels(assignedBrandLabels, brandRestrictions)
      )
    );
  }

  private buildDeleteUrl(businessSiteId: string, brandId: string, labelId?: number): string {
    return this.buildBaseUrl(businessSiteId) + '/' + brandId + '?labelId=' + labelId;
  }

  private buildBaseUrl(businessSiteId: string): string {
    return `/traits/api/v1/business-sites/${businessSiteId}/assigned-brand-labels`;
  }

  private groupAssignedBrandLabels(
    assignedBrandLabels: AssignedBrandLabel[],
    brandRestrictions: string[]
  ): GroupedAssignedBrandLabel[] {
    const groupedAssignments: GroupedAssignedBrandLabel[] = [];

    assignedBrandLabels.forEach(assignedBrandLabel => {
      this.addTo(
        groupedAssignments,
        assignedBrandLabel,
        brandRestrictions.length > 0 && !brandRestrictions.includes(assignedBrandLabel.brandId)
      );
    });

    return groupedAssignments;
  }

  private addTo(
    groupedAssignments: GroupedAssignedBrandLabel[],
    assignedBrandLabel: AssignedBrandLabel,
    brandReadonly: boolean
  ): void {
    const existingAssignment = groupedAssignments.find(
      assignment => assignment.labelId === assignedBrandLabel.labelId
    );

    if (existingAssignment && existingAssignment.brands) {
      existingAssignment.brands = existingAssignment.brands.concat(
        new Brand(assignedBrandLabel.brandId, brandReadonly)
      );
    } else {
      groupedAssignments.push(
        new GroupedAssignedBrandLabel(
          assignedBrandLabel.labelId,
          [new Brand(assignedBrandLabel.brandId, brandReadonly)],
          brandReadonly
        )
      );
    }
  }
}
