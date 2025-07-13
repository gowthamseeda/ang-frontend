import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';

import { RegionalCenterService } from '../services/regional-center.service';

@Injectable()
export class RegionalCenterStoreGuard implements CanActivate {
  constructor(private regionalCenterService: RegionalCenterService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.initStore();
  }

  private initStore(): boolean {
    this.regionalCenterService.fetchData();
    return true;
  }
}
