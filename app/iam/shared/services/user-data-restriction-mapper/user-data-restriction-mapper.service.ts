import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataRestrictionMapperService {
  getDataRestrictionValues(
    userDataRestrictions: { [dataRestrictionId: string]: string[] },
    dataRestrictionId: string
  ): string[] {
    const restrictionId = userDataRestrictions[dataRestrictionId];

    if (!restrictionId) {
      return [];
    }
    return restrictionId;
  }
}
