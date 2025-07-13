import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

@Injectable()
export class NavigationService {
  constructor(private router: Router) {}

  navigateAbsoluteTo(target: string | UrlTree): Promise<boolean> {
    return this.router.navigateByUrl(target);
  }
}
