import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private store: any = {};

  save(key: string, val: any): void {
    this.store[key] = val;
  }

  get(key: string, defaultValue?: any): any {
    return this.store[key] ? this.store[key] : defaultValue;
  }
}
