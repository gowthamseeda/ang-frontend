import { Injectable } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../shared/services/api/api.service';

import { User, UserDataRestrictions } from './user.model';

const url = '/iam/api/v1/current-user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new ReplaySubject<User>(1);

  constructor(private apiService: ApiService, private permissionsService: NgxPermissionsService) {
    this.loadUser();
  }

  loadUser(): void {
    this.apiService.get<User>(url).subscribe(userResponse => this.userSubject.next(<User>this.decodePermission(userResponse)));

    this.getPermissions().subscribe((permissions: string[]) =>
      this.permissionsService.loadPermissions(permissions)
    );
  }

  decodePermission(user: User | undefined | null): User | undefined | null {
    if (user == null) {
      return user;
    }
    user.permissions = user.permissions.map( permission =>
      atob(permission).replace(user.userId,'')
    );
    return user;
  }

  getCurrent(): Observable<User> {
    return this.userSubject.asObservable();
  }

  getPermissions(): Observable<string[]> {
    return this.getCurrent().pipe(map(user => user?.permissions ?? []));
  }

  getRoles(): Observable<string[]> {
    return this.getCurrent().pipe(map(user => user?.roles ?? []));
  }

  getUserDataRestrictions(): Observable<UserDataRestrictions> {
    return this.getCurrent().pipe(
      map(user => user?.dataRestrictions ?? new UserDataRestrictions())
    );
  }

  getBusinessSiteRestrictions(): Observable<string[]> {
    return this.getRestrictionsFor('BusinessSite');
  }

  getCountryRestrictions(): Observable<string[]> {
    return this.getRestrictionsFor('Country');
  }

  getBrandRestrictions(): Observable<string[]> {
    return this.getRestrictionsFor('Brand');
  }

  getProductGroupRestrictions(): Observable<string[]> {
    return this.getRestrictionsFor('ProductGroup');
  }

  getDistributionLevelRestrictions(): Observable<string[]> {
    return this.getRestrictionsFor('DistributionLevel');
  }

  getDefaultCountryId(): Observable<string | null | undefined> {
    return this.getCurrent().pipe(
      map(user => {
        return user.country;
      })
    );
  }

  private getRestrictionsFor(id: string): Observable<string[]> {
    return this.getUserDataRestrictions().pipe(map(dataRestrictions => dataRestrictions[id] ?? []));
  }
}
